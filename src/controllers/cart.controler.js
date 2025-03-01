'use strict'

const { SuccessResponse } = require('../core/success.respon')
const { addToCart, deleteItemProuct, getListCart, updateQuanity, getDetailCart } = require('../services/cart.service')

class CartControler {
    setToCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Add to cart successfully',
            metadata: await addToCart({
                user_id: req.user.userId,
                product: req.body
            })
        }).send(res)
    }
    deteleItem = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Delete item successfully',
            metadata: await deleteItemProuct({
                userId: req.user.userId,
                productId: req.params.productId
            })
        }).send(res)
    }
    getListCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list cart successfully',
            metadata: await getListCart(req.user.userId)
        }).send(res)
    }
    getDetailCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get detail cart successfully',
            metadata: await getDetailCart(req.user.userId)
        }).send(res)
    }

    updateQuanity = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Update quantity successfully',
            metadata: await updateQuanity({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new CartControler 