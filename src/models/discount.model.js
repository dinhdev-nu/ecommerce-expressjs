const e = require("express")
const { } = require("mongoose")

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_shopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fix_amount'
    },
    discount_value: {
        type: Number,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_status: {
        type: String,
        required: true
    },
    discount_max_usage: {
        type: Number,
        required: true
    },
    discount_current_usage: {
        type: Number,
        required: true
    },
    discount_min_order: {
        type: Number,
        required: true
    },
    discount_is_active: {
        type: Boolean,
        required: true
    },
    discount_apply_to: {
        type: String,
        required: true,
        enum: ['all', 'specific_products']
    },
    discount_specific_products: {
        type: [Schema.Types.ObjectId],
        ref: 'Product'
    },
    is_deleted: {
        type: Boolean,
        default: false
    } 
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
discountSchema.methods.updateDiscount = function (data) {
    this.is_deleted = this.discount_end_date < new Date() ? true : false
}

module.exports = model(DOCUMENT_NAME, discountSchema)