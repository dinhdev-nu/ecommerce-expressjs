const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

const inventorySchema = new Schema({
    inventory_productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    inventory_shopId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    status: {
        type: String,
        enum: ['in_stock', 'out_of_stock'],
        default: 'in_stock'
    },
    inventory_stock: {
        type: Number,
        required: true,
        min: 0
    },
    inventory_location: {
        type: String,
        default: "unknown"
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

inventorySchema.pre('save', function(next){
    this.status = this.inventory_stock > 0 ? 'in_stock' : 'out_of_stock'
    next()
})

const inventoriesHisotrySchema = new Schema({
    inventory_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Inventory'
    },
    action: {
        type: String,
        enum: ["restock", "deduct", "initial"],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true,
    collection: 'inventories_history'
})

module.exports = {
    Inventory: model(DOCUMENT_NAME, inventorySchema),
    InventoryHistory: model('InventoryHistory', inventoriesHisotrySchema)
}