import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Address from "../models/addressModel.js";
import { getMakingCharge } from "../utils/pricing.js";
import { instance } from '../index.js';
import Payment from '../models/paymentModel.js';

export const formatOrderAddress = async (addr) => {
    if (!addr) return undefined;
    let target = addr;
    if (typeof target === 'string') {
        try {
            target = JSON.parse(target);
        } catch {
            target = await Address.findById(target).lean();
        }
    } else if (target._id && !target.addressLine1) {
        target = await Address.findById(target._id).lean();
    }
    if (!target) return undefined;
    return {
        fullName: target.fullName || '',
        addressLine1: target.addressLine1 || '',
        addressLine2: target.addressLine2 || '',
        city: target.city || '',
        country: target.country || '',
        postalCode: target.postalCode || '',
        phoneNumber: target.phoneNumber || ''
    };
};

export const createOrder = async (req, res) => {
    try {
        const { amount, userId, products, paymentMethod, status, totalAmount, deliveryDate, address } = req.body;
        console.log('createOrder payload:', { amount, userId, products, paymentMethod, status, totalAmount, deliveryDate, address });
        const makingCharge = await getMakingCharge();

        // Fetch product prices and calculate unitPriceAtPurchase
        const productIds = products.map(p => p.productId);
        const dbProducts = await Product.find({ _id: { $in: productIds } }).select("_id price").lean();
        const priceMap = new Map(dbProducts.map(p => [String(p._id), Number(p.price || 0)]));

        const orderLines = products.map(p => {
            const basePrice = priceMap.get(String(p.productId)) ?? 0;
            const unitPriceAtPurchase = basePrice + makingCharge;
            return {
                productId: p.productId,
                quantity: p.quantity,
                unitPriceAtPurchase,
                size: p.size,
                metalType: p.metalType,
                engraving: p.engraving,
                stone: p.stone,
                finish: p.finish
            };
        });

        const orderDate = new Date();
        const expectedDeliveryDate = new Date(orderDate);
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 10);

        const resolvedAddress = await formatOrderAddress(address);

        const newOrder = new Order({
            userId,
            products: orderLines,
            totalAmount,
            paymentId: null, // COD orders don’t have a paymentId
            paymentMethod: paymentMethod || 'cod',
            status: status || 'pending',
            orderDate: orderDate,
            expectedDeliveryDate: expectedDeliveryDate,
            address: resolvedAddress
        });
        await newOrder.save();
        console.log('Order created:', newOrder);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('paymentId');
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId, status: { $ne: 'payment_pending' } }).sort({ orderDate: -1 })
      .populate({
        path: "products",
        populate: { path: "productId" },
      })
      .populate('paymentId');
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const validOrders = await Promise.all(
      orders
        .filter(order => order !== null)
        .map(async (order) => {
          const orderObj = order.toObject ? order.toObject() : { ...order };
          if ((!orderObj.address || !orderObj.address.addressLine1) && orderObj.userId) {
            const uid = orderObj.userId?._id || orderObj.userId;
            const fallbackAddr = await Address.findOne({ userId: uid }).lean();
            if (fallbackAddr) {
              orderObj.address = {
                fullName: fallbackAddr.fullName || '',
                addressLine1: fallbackAddr.addressLine1 || '',
                addressLine2: fallbackAddr.addressLine2 || '',
                city: fallbackAddr.city || '',
                country: fallbackAddr.country || '',
                postalCode: fallbackAddr.postalCode || '',
                phoneNumber: fallbackAddr.phoneNumber || ''
              };
            }
          }
          return orderObj;
        })
    );
    res.status(200).json(validOrders);
  } catch (error) {
    res.status(500).json({
      message: 'Error in fetching orders',
      error: error.message,
    });
  }
}


export const updateStatus=async(req,res)=>{
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const orderToUpdate = await Order.findById(orderId).populate('paymentId');
        if (!orderToUpdate) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If cancelling an already confirmed/paid order, process refund
        if (status === 'cancelled' && orderToUpdate.paymentId && orderToUpdate.status !== 'cancelled') {
             const payment = await Payment.findById(orderToUpdate.paymentId);
             if (payment && payment.razorpay_payment_id) {
                 try {
                     await instance.payments.refund(payment.razorpay_payment_id, {
                         amount: orderToUpdate.totalAmount * 100, // in paise
                         speed: "normal"
                     });
                     console.log("Refund processed for payment:", payment.razorpay_payment_id);
                 } catch (refundError) {
                     console.error("Refund failed or already refunded:", refundError);
                     // Note: We swallow error here to let the cancel state change occur even if already refunded
                 }
             }
        }

        orderToUpdate.status = status;
        const updatedOrder = await orderToUpdate.save();

        res.status(200).json(updatedOrder);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const getAllAdminOrders=async(req,res)=>{
  try{
      const page = req.query.page || 1;
      const pageSize = 10; 
      const skip = (page - 1) * pageSize;

      const totalOrders = await Order.countDocuments({ status: { $ne: 'payment_pending' } });
      const orders = await Order.find({ status: { $ne: 'payment_pending' } }).sort({ orderDate: -1 })
          .populate({
              path: 'userId',
              select: 'username email'
          })
          .populate({
              path: 'products.productId',
              model: 'Product'
          })
          .populate('paymentId')
          .skip(skip)
          .limit(pageSize);

      const enrichedOrders = await Promise.all(
          orders.map(async (order) => {
              const orderObj = order.toObject ? order.toObject() : { ...order };
              if ((!orderObj.address || !orderObj.address.addressLine1) && orderObj.userId) {
                  const uid = orderObj.userId?._id || orderObj.userId;
                  const fallbackAddr = await Address.findOne({ userId: uid }).lean();
                  if (fallbackAddr) {
                      orderObj.address = {
                          fullName: fallbackAddr.fullName || '',
                          addressLine1: fallbackAddr.addressLine1 || '',
                          addressLine2: fallbackAddr.addressLine2 || '',
                          city: fallbackAddr.city || '',
                          country: fallbackAddr.country || '',
                          postalCode: fallbackAddr.postalCode || '',
                          phoneNumber: fallbackAddr.phoneNumber || ''
                      };
                  }
              }
              return orderObj;
          })
      );

      res.status(200).json({ orders: enrichedOrders, totalOrders });
  }
  catch(error){
    res.status(500).json({message:error.message})
  }
} 