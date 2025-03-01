'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const orderSchema = new Schema({
    order_userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    order_items: [{
        product_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        product_name: { type: String, required: true },
        product_quantity: { type: Number, required: true },
        product_price: { type: Number, required: true },
        discount_id: {
            type: Schema.Types.ObjectId,
            ref: 'Discount'
        },  
        discount_amount: { type: Number, default: 0 },
        final_price: { type: Number, required: true }
    }, { _id: false }],
    order_total: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
        required: true,
        default: 'pending'
    },
    order_payment: {
        payment_method: {
            type: String,
            enum: ['card', 'cash', 'paypal'],
            default: 'card'
        },
        payment_status: {
            type: String,
            enum: ['unpaid', 'paid', 'failed'],
            default: 'unpaid'
        }
    },
    order_address: {
        full_name: { type: String, required: true },
        phone_number: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
    },
    order_note: { type: String, default: 'This order has no note' },
    order_expiredAt: { 
        type: Date,  
        default: new Date(Date.now() + 5 * 60 * 1000) 
    },
    
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


// Expire after 5 minutes (300 seconds)
orderSchema.index({ order_expiredAt: 1 }, { expireAfterSeconds: 0 })



module.exports = model(DOCUMENT_NAME, orderSchema)