import Payment from '../models/paymentModel.js';
import Order from '../models/orderModel.js';
import { instance } from '../index.js';
import User from '../models/userModel.js';
import Cart from '../models/cartModel.js';
import CartItem from '../models/cartItemModel.js';
import crypto from 'crypto';
import Product from "../models/productModel.js";
import { getMakingCharge } from "../utils/pricing.js";
import { formatOrderAddress } from "./orderController.js";

export const createPayment = async (req, res) => {
  try {
    const { amount, userId, products, totalAmount, address } = req.body;
    
    const options = {
      amount: Number(amount * 100),  // smallest currency unit
      currency: "INR",
      receipt: "order_rcpt_" + Date.now().toString().slice(-6)
    };
    
    // Create order in Razorpay
    const order = await instance.orders.create(options);
    
    // Track the payment
    const payment = new Payment({
      amount: options.amount / 100,
      paymentDate: new Date(),
      paymentMethod: 'razorpay',
      razorpay_order_id: order.id
    });
    const savedPayment = await payment.save();

    // Generate accurate pricing
    const makingCharge = await getMakingCharge();
    const decodedProducts = typeof products === 'string' ? JSON.parse(decodeURIComponent(products)) : products;
    const productIds = decodedProducts.map(p => p.productId);

    const dbProducts = await Product.find({ _id: { $in: productIds } }).select("_id price").lean();
    const priceMap = new Map(dbProducts.map(p => [String(p._id), Number(p.price || 0)]));

    const orderLines = decodedProducts.map(p => {
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
      userId: userId,
      products: orderLines,
      totalAmount: totalAmount, 
      paymentId: savedPayment._id,
      razorpay_order_id: order.id,
      paymentMethod: 'online',
      status: 'payment_pending',
      orderDate: orderDate,
      expectedDeliveryDate: expectedDeliveryDate,
      address: resolvedAddress 
    });
    await newOrder.save();
    
    res.status(200).json({
      order,
      dbOrderId: newOrder._id
    });
  } catch (error) {
    console.log("inside createpayment error", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, dbOrderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Database operations
      const order = await Order.findById(dbOrderId);
      if (order) {
        // Upon successful payment verification, change status from 'payment_pending' to 'pending'
        // (which means it's now waiting for admin approval).
        if (order.status === 'payment_pending') {
          order.status = 'pending';
        }
        await order.save();

        // Update Payment record
        await Payment.findOneAndUpdate(
          { razorpay_order_id },
          {
            razorpay_payment_id,
            razorpay_signature,
          }
        );
        
        console.log("Order confirmed via direct verification:", dbOrderId);
        return res.status(200).json({ success: true, message: "Payment verified successfully" });
      } else {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest('hex');

    const razorpaySignature = req.headers['x-razorpay-signature'];

    if (expectedSignature !== razorpaySignature) {
      console.error("Webhook signature mismatch.");
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const payload = req.body;
    console.log("Razorpay Webhook Received:", payload.event);

    if (payload.event === 'order.paid' || payload.event === 'payment.captured') {
        let paymentEntity;
        if (payload.event === 'payment.captured') {
            paymentEntity = payload.payload.payment.entity;
        } else {
            paymentEntity = payload.payload.order.entity; 
        }
        
        let razorpay_order_id = paymentEntity.order_id || paymentEntity.id; 
        
        const order = await Order.findOne({ razorpay_order_id });
        if (order) {
             // If payment is confirmed via webhook, move from 'payment_pending' to 'pending'
             if (order.status === 'payment_pending') {
                 order.status = 'pending';
                 await order.save();
                 console.log("Order payment received via webhook, status updated to pending for approval:", order._id);
             } else {
                 console.log("Order payment received via webhook, status remains:", order.status, order._id);
             }
        }

        if (payload.event === 'payment.captured') {
            await Payment.findOneAndUpdate(
               { razorpay_order_id },
               {
                  razorpay_payment_id: paymentEntity.id,
                  razorpay_signature: "webhook"
               }
            );
        }
    } else if (payload.event === 'payment.failed') {
        const paymentEntity = payload.payload.payment.entity;
        const razorpay_order_id = paymentEntity.order_id;
        console.log("Payment failed for order:", razorpay_order_id);
        
        const order = await Order.findOne({ razorpay_order_id });
        if (order && (order.status === 'pending' || order.status === 'payment_pending')) {
            order.status = 'failed';
            await order.save();
            console.log("Order marked as failed via webhook:", order._id);
        }
    } else if (payload.event.startsWith('refund.')) {
        console.log("Refund event received:", payload.event);
        
        const refundObj = payload.payload.refund.entity;
        const payment = await Payment.findOne({ razorpay_payment_id: refundObj.payment_id });
        
        if (payment) {
            const order = await Order.findOne({ paymentId: payment._id });
            if (order) {
                if (payload.event === 'refund.processed') {
                    order.status = 'cancelled';
                    await order.save();
                    console.log("Order marked cancelled via refund processed webhook.");
                } else if (payload.event === 'refund.failed') {
                    console.error("Refund failed for order:", order._id);
                    // Optionally alert admin here
                } else if (payload.event === 'refund.created') {
                    console.log("Refund initiated for order:", order._id);
                }
            }
        }
    }

    res.status(200).json({ success: true });
  } catch (error) {
     console.error("Webhook error:", error);
     res.status(500).send("Webhook Error");
  }
};