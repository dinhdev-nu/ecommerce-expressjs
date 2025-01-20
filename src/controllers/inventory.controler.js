'use strict'

const { SuccessResponse } = require("../core/success.respon")
const { 
    createInventoryForProduct,
    updateInventoryForProduct,
    getInventoryForProduct,
    deleteInventoryForProduct,
    getInventoriesForShop,
    createHistoryForInventory,
    getHistoryForInventory,
    deleteHistoryForInventory
} = require("../services/inventory.service")

class InventoryControler {
    createInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Create inventory success",
            metadata: await createInventoryForProduct({
                product_id: req.body.product_id,
                shop_id: req.user.userId,
                inventory: req.body.inventory
            })
        }).send(res)
    }

    updateInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Update inventory success",
            metadata: await updateInventoryForProduct({
                shop_id: req.user.userId,
                product_id: req.body.product_id,
                quantity_new: req.body.quantity_new,
                quantity_old: req.body.quantity_old,
                location: req.body.location
            })
        }).send(res)
    }

    getInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Get inventory success",
            metadata: await getInventoryForProduct({
                shop_id: req.user.userId,
                product_id: req.params.product_id
            })
        }).send(res)
    }

    deleteInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete inventory success",
            metadata: await deleteInventoryForProduct({
                shop_id: req.user.userId,
                product_id: req.params.product_id
            })
        }).send(res)
    }

    getInventories = async (req, res, next) => {
        new SuccessResponse({
            message: "Get inventories success",
            metadata: await getInventoriesForShop({
                shop_id: req.user.userId,
                getStatus: req.query.status
            })
        }).send(res)
    }

    createHistory = async (req, res, next) => {
        new SuccessResponse({
            message: "Create history success",
            metadata: await createHistoryForInventory({
                inventory_id: req.body.inventory_id,
                action: req.body.action,
                quantity: req.body.quantity
            })
        }).send(res)
    }

    getHistory = async (req, res, next) => {
        new SuccessResponse({
            message: "Get history success",
            metadata: await getHistoryForInventory({
                inventory_id: req.params.inventory_id
            })
        }).send(res)
    }

    deleteHistory = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete history success",
            metadata: await deleteHistoryForInventory({
                inventory_id: req.params.inventory_id
            })
        }).send(res)
    }

}

module.exports = new InventoryControler()

