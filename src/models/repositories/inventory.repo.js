'use strict'

const { Inventory, InventoryHistory } = require("../inventory.model")
const { getUnSelect, getSelect } = require('../../utils/index')


// Inventory
const findInventory = async ({shop_id, product_id}) => {
    const filter = {
        inventory_productId: product_id,
        inventory_shopId: shop_id
    }
    return await Inventory.findOne(filter).lean()
}  

const getInventoris = async ({shop_id, getStatus, select}) => {
    const SELECT = getSelect(select)
    const filter = {
        inventory_shopId: shop_id
    }
    if (getStatus) filter.status = getStatus

    return await Inventory.find(filter)
                .select(SELECT)
                .populate(
                    'inventory_productId', 
                    getSelect(['product_name', 'product_price', 'product_thumb', 'product_quantity'])
                )
                .lean()
}

const createInventory = async ({shop_id, product_id, payload}) => {
    const filter = {
        inventory_productId: product_id,
        inventory_shopId: shop_id
    },
    update = {
        ...payload,
        inventory_productId: product_id,
        inventory_shopId: shop_id
    }, 
    options = {
        upsert: true,
        new: true
    }
    if(payload.inventory_stock <= 0) update.status = 'out_of_stock'

    return await Inventory.findOneAndUpdate(filter, update, options)
                        .populate('inventory_productId', getSelect(['product_type', 'product_quantity']))
                        .lean()
}

const updateInventory = async ({shop_id, product_id, quantity_new , quantity_old, location}) => {
    const filter = {
        inventory_productId: product_id,
        inventory_shopId: shop_id
    }, 
    update = {
        $inc: {
            inventory_stock: +quantity_new - +quantity_old,
            __v: 1
        }
    },
    options = {
        new: true
    }
    if(location) update.inventory_location = location

    if(+quantity_new === 0 || +quantity_new - +quantity_old + +quantity_old ===0) 
        update.status = 'out_of_stock'

    return await Inventory.findOneAndUpdate(filter, update, options).lean()

}

const deleteInventory = async ({shop_id, product_id}) => {
    const filter = {
        inventory_productId: product_id,
        inventory_shopId: shop_id
    }
    return await Inventory.findOneAndDelete(filter).lean()

}
// HistoryInventory

const createHistoryInventory = async ({inventory_id, action, quantity}) => {
    const payload = {
        inventory_id,
        action,
        quantity
    }
    return await InventoryHistory.create(payload)

}

const getHistoryInventory = async ({inventory_id, select}) => {
    const SELECT = getSelect(select)
    const filter = {
        inventory_id
    }
    return await InventoryHistory.find(filter)
                .select(SELECT)
                .lean() 
}

const deleteHistoryInventory = async ({inventory_id}) => {
    const filter = {
        inventory_id
    }
    return await InventoryHistory.deleteMany(filter)
}

module.exports = {
    // Inventory
    findInventory,
    createInventory,
    getInventoris,
    updateInventory,
    deleteInventory,
    // HistoryInventory
    createHistoryInventory,
    getHistoryInventory,
    deleteHistoryInventory
}