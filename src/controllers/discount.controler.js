'use strict'

const {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getAllActiveDiscounts,
    getDiscountsForShop,
    getDetailDiscount,
    applyDiscount,
    updateStatus,
    getDiscountsForProduct
} = require('../services/discount.service')
const { SuccessResponse } = require('../core/success.respon')

class DiscountController {
    createDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Create discount success",
            metadata: await createDiscount({
                discount_shopId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    updateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Update discount success",
            metadata: await updateDiscount({
                discount_id: req.body.discount_id,
                shop_id: req.user.userId,
                payload: {
                    discount_shopId: req.user.userId,
                    ...req.body
                }
            })
        }).send(res)
    }

    updateStatus = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Update status discount success",
            metadata: await updateStatus({
                discount_id: req.params.discount_id,
                shop_id: req.user.userId
            })
        }).send(res)
    }
    
    deleteDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete discount success",
            metadata: await deleteDiscount({
                discount_id: req.params.discount_id,
                shop_id: req.user.userId
            })
        }).send(res)
    }
    
    getDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discount success",
            metadata: await getDetailDiscount({
                discount_code: req.params.discount_code,
            })
        }).send(res)
    }
    getDiscountsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discounts success",
            metadata: await getDiscountsForShop({
                shop_id: req.user.userId,
                discount_type: req.query.discount_type
            })
        }).send(res)
    }
    getAllActiveDiscounts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all active discounts success", 
            metadata: await getAllActiveDiscounts({
                discount_shopId: req.query.shop_id,
                discount_type: req.query.type
            })
        }).send(res)
    }
    getDiscountsForProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discounts for product success",
            metadata: await getDiscountsForProduct({
                product_id: req.params.productId,
                shop_id: req.query.shopId
            })
        }).send(res)
    }
    
    applyDiscount = async ( req, res, next) => {
        new SuccessResponse({
            message: "Apply discount success",
            metadata: await applyDiscount({
                discount: req.discount,
                
                product: req.body.product, 
            })
        }).send(res)
    }

}

module.exports = new DiscountController()