'use strict'

const { Schema, model } = require('mongoose')
const { default: slugify } = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

const ProductSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: { type: String},
    product_thumb: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_description: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
        index: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Clothing', 'Electrics', 'Furniture']
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_average_rating: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be above 5"],
        set: (val) => {
            return Math.round(val*10)/10
        }
    },
    product_variation: {
        type: [Schema.Types.Mixed],
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublic: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

ProductSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


ProductSchema.index({ product_name: "text", product_slug: 'text'})

const Clothing = new Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    material: { type: String, required: true },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    timestamps: true,
    collection: "clothings"
})

const Electrics = new Schema({ 
    brand: { type: String, required: true },
    model: { type: String, required: true },
    power: { type: String, required: true },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    timestamps: true,
    collection: "electronics"
})

const Furniture = new Schema({
    material: { type: String, required: true },
    color: { type: String, required: true },
    weight: { type: String, required: true },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    timestamps: true,
    collection: "furnitures"
})



module.exports = {
    product: model(DOCUMENT_NAME, ProductSchema),
    clothing: model('Clothing', Clothing),
    electrics: model('Electrics', Electrics),
    furniture: model('Furniture', Furniture)
}