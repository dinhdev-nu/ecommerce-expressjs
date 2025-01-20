const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const cartSchema = new Schema({
    cart_userId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    cart_status: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: [Schema.Types.Mixed],
        required: true,
        default: []
        
    },
    cart_count: {
        type: Number,
        default: 0,
        min: 0
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, cartSchema);
