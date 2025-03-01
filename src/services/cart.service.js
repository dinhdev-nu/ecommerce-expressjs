'use strict'

const { BadRequestError } = require("../core/error.respon");
const cartModel = require("../models/cart.model");
const { findCart, createCart, findCartToUpdate, updateQuantityCart, findCartAndItem } = require("../models/repositories/cart.repo");

const addToCart = async ({ user_id, product }) => {
    if (!product || !product.product_id ) {
        throw new BadRequestError("Invalid product data");
    }
    if(!product.quantity) {
        product.quantity = 1
    }
    const foundCart = await findCartToUpdate(user_id)

    if(!foundCart) {
        const newCart = await createCart({
            cart_userId: user_id,
            cart_preview: [product],
            cart_products: [product.product_id],
            cart_count: 1
        })
        return newCart
    }
    // c1 
    const products = foundCart.cart_products
    const foundIndex = products.findIndex(p => p.toString() === product.product_id)
    if(foundIndex !== -1) {
        const product_preview  = foundCart.cart_preview[foundIndex]
        product_preview.quantity += product.quantity
        // danh dau array da thay doi vi mgdb khong the tu dong nhan dien su thay doi cua array
        foundCart.markModified('cart_preview') 
    } else {
        foundCart.cart_products.push(product.product_id)
        foundCart.cart_preview.push(product)
        
        foundCart.cart_count +=  1
    }

    return await foundCart.save()
}

const getListCart = async (userId) => {
    const foundCart = await findCart(userId)
    return foundCart.cart_preview
}

const getDetailCart = async (userId) => {
    try {
        const select = [
            "product_id",
            "product_name",
            "product_price",
            "product_thumb",
            "product_quantity"
        ]
        const foundCart = await findCartAndItem(userId, select)
        
        const map = new Map(foundCart.cart_preview.map(p => [p.product_id, p.quantity]))
        const cart = foundCart.cart_products.map(p => {
            const quantity = map.get(p._id.toString()) || 0
            return {
                ...p,
                quantity: quantity,
                totalPrice: p.product_price * quantity
            }
        })
        const total = cart.reduce((acc, cur) => {
            return acc + cur.product_price * cur.quantity
        }, 0)
        // lodash 
        // const map = _.keyBy(foundCart.cart_preview.product_id, "_id")
        // const cart = foundCart.cart_products.map(p => {
        //     return {
        //         ...p,
        //         quantity: map[p._id.toString()] || 0
        //     }
        // })
        return {
            cart,
            total
        }
    } catch (error) {
        console.log(error)
        throw new BadRequestError("Invalid cart data")
    }
}

const deleteItemProuct = async ({userId, productId}) => {
    const query = {
        cart_userId: userId,
    },
    update = {
        $pull: {
            cart_products: productId, // [1, 2, 4]
            cart_preview: { product_id: productId }
        },
        $inc: {
            cart_count: -1
        }
    },
    options = {
        new: true
    }

    return await cartModel.findOneAndUpdate(query, update, options).lean()
}

const updateQuanity = async (payload) => {
    const { 
        userId, product_id, 
        quantityOld, quantityNew 
    } = payload
    if(quantityOld === quantityNew) return

    const quantity = quantityNew - quantityOld
    
    if(quantityOld !== 0 && quantityOld - quantity < 0) return

    const updateCart = await updateQuantityCart({userId, product_id, quantity})

    return updateCart

}

module.exports = {
    addToCart,
    getListCart,
    deleteItemProuct,
    updateQuanity,
    getDetailCart
}