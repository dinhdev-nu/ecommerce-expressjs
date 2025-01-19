'use strict'

const { SuccessResponse } = require('../core/success.respon')
const { addToCart, deleteItemProuct, getListCart, updateQuanity } = require('../services/cart.service')

class CartControler {
    setToCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Add to cart successfully',
            metadata: await addToCart(req.body)
        }).send(res)
    }
    deteleItem = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Delete item successfully',
            metadata: await deleteItemProuct(req.params.productId)
        }).send(res)
    }
    getListCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list cart successfully',
            metadata: await getListCart(req.params.userId)
        }).send(res)
    }
    updateQuanity = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Update quantity successfully',
            metadata: await updateQuanity(req.body)
        }).send(res)
    }
}

module.exports = new CartControler 