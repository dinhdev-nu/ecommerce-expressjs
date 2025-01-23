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
        product_quantity: { type: Number, required: true },
        product_price: { type: Number, required: true }
    }],
    order_total: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
        default: 'pending',
    },
    order_payment: {
        payment_method: {
            type: String,
            enum: ['card', 'cash', 'paypal'],
            required: true
        },
        payment_status: {
            type: String,
            enum: ['unpaid', 'paid', 'failed'],
            default: 'unpaid'
        }
    },
    order_address: {
        full_name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true },
    },
    order_note: { type: String, default: ''},
    order_discount: {
        discount_code: { type: String, default: '' },
        discount_amount: { type: Number, default: 0 },
        discount_for_product: {type: Schema.Types.ObjectId, ref: 'Product'}
    }
    
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})



module.exports = model(DOCUMENT_NAME, orderSchema)