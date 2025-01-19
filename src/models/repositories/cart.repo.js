'use strict'

const { update } = require("lodash")
const cartModel = require("../cart.model")

const createCart = async (payload) => {
    return await cartModel.create(payload)
}

const findCartToUpdate = async (userId) => {
    const filter = { cart_userId: userId }
    return await cartModel.findOne(filter)
}

const findCart = async (userId) => {
    const filter = { cart_userId: userId }
    return await cartModel.findOne(filter).lean()
}

const updateQuantityCart = async ({userId, product_id, quantity}) => {

    const query = {
        cart_userId: userId,
        "cart_products.product_id": product_id   
    },update = {
        $inc: {
            "cart_products.$.quantity": +quantity
        }
    }, options = {
        new: true
    }
    
    const updateCart = await cartModel.findOneAndUpdate(query, update, options).lean()
    return updateCart

}



module.exports = {
    createCart,
    findCart,
    findCartToUpdate,
    updateQuantityCart
}
