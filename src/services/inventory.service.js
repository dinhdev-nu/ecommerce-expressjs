'use strict'

const { BadRequestError } = require('../core/error.respon')
const { 
    createInventory, createHistoryInventory ,
    findInventory, getInventoris, getHistoryInventory,
    updateInventory,
    deleteInventory,
    deleteHistoryInventory,
} = require('../models/repositories/inventory.repo')
const ProductFactory = require('./product.service')
const { product } = require('../models/product.model')
const productModel = require('../models/product.model')
const { InventoryHistory } = require('../models/inventory.model')



const createInventoryForProduct = async ({ product_id, shop_id, inventory }) => {
    
    const newInventory = await createInventory({shop_id, product_id, payload: inventory})
    if(inventory) {
        const newHistory = await createHistoryInventory({
            inventory_id: newInventory._id,
            action: 'initial',
            quantity: newInventory.inventory_stock
        })

        return {newInventory, newHistory}
    }

    throw new BadRequestError('Inventory create failed ')
    
}

const updateInventoryForProduct = async ({

    shop_id, inventory_id, quantity_new, quantity_old, location
}) => {
    
    try {
        const inventory = await updateInventory({
            shop_id, inventory_id, quantity_new, location
        })
        await product.findByIdAndUpdate(inventory.inventory_productId, {product_quantity: quantity_new})
    
        await InventoryHistory.create({
            inventory_id: inventory._id,
            action: 'restock',
            quantity: quantity_new - quantity_old
            })
        return { inventory }
    } catch (error) {
        console.log(error)
        throw new BadRequestError('Update inventory failed')
    } 
}

const getInventoryForProduct = async ({
    shop_id, product_id
}) => {
    return await findInventory({shop_id, product_id})
}

const deleteInventoryForProduct = async ({
    shop_id, product_id
}) => {
    const inventory = await deleteInventory({shop_id, product_id})
    if(!inventory)
        throw new BadRequestError('Inventory not found')
    deleteHistoryForInventory({inventory_id: inventory._id})
    return { inventory }
}


const getInventoriesForShop = async ({ shop_id, getStatus }) => {
    const select = ['inventory_stock', 'inventory_location', 'status', 'createdAt']

    return await getInventoris({shop_id, getStatus, select})
}

const createHistoryForInventory = async (payload) => {
    return await createHistoryInventory(payload)
}

const getHistoryForInventory = async ({inventory_id}) => {
    const select = ['action', 'quantity', 'date']
    return await getHistoryInventory({inventory_id, select})
}

const deleteHistoryForInventory = async ({inventory_id}) => {
    return await deleteHistoryInventory({inventory_id})
}

module.exports = {
    createInventoryForProduct,
    updateInventoryForProduct,
    getInventoryForProduct,
    getInventoriesForShop,
    createHistoryForInventory,
    getHistoryForInventory,
    deleteInventoryForProduct,
    deleteHistoryForInventory
}
