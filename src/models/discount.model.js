'use strict'

const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_shopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
        type: String,
        enum: ['percentage', 'fix_amount'],
        default: 'fix_amount'
    },
    discount_value: {type: Number, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_code: { type: String, required: true, unique: true },
    discount_max_usage: {type: Number, required: true },
    discount_current_usage: {type: Number, default: 0 },
    discount_user_used: { type: [Schema.Types.ObjectId], default: [] },
    discount_min_order: {type: Number, required: true },
    discount_is_active: { type: Boolean, required: true },
    discount_apply_to: {
        type: String,
        required: true,
        enum: ['all', 'specific_products', 'serveral_products']
    },
    discount_specific_products: {
        type: [Schema.Types.ObjectId],
        ref: 'Product'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


discountSchema.pre('save', function(next){
    this.discount_code = this.discount_code.toUpperCase()
    next()
})


module.exports = model(DOCUMENT_NAME, discountSchema)