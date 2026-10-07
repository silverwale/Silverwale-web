import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPriceAtPurchase: {
            type: Number,
            required: true
        },
        size: {
            type: String
        },
        metalType: {
            type: String
        },
        engraving: {
            type: String
        },
        stone: {
            type: String
        },
        finish: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    razorpay_order_id: {
        type: String
    },
    address: {
        fullName: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        country: String,
        postalCode: String,
        phoneNumber: String
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'cod'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    expectedDeliveryDate: {
        type: Date
    },
    status:{
        type:String,
        enum:['payment_pending','pending','confirmed','processing','shipped','delivered','cancelled','failed'],
        default:'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
