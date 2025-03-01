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

const findCartAndItem = async ( userId, select = []) => {
    const filter = { cart_userId: userId }
    const getSelect = select.join(' ')
    return await cartModel.findOne(filter)
                .populate('cart_products', getSelect)
                .lean()
}

const updateQuantityCart = async ({userId, product_id, quantity}) => {

    const query = {
        cart_userId: userId,
        "cart_preview.product_id": product_id   
    },update = {
        $inc: {
            "cart_preview.$.quantity": quantity
        }
    }, options = {
        new: true
    }
    
    return await cartModel.findOneAndUpdate(query, update, options).lean()

}



module.exports = {
    createCart,
    findCart,
    findCartToUpdate,
    updateQuantityCart,
    findCartAndItem
}
