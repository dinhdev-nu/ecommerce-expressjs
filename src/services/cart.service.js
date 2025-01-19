'use strict'

const { BadRequestError } = require("../core/error.respon");
const cartModel = require("../models/cart.model");
const { findCart, createCart, findCartToUpdate, updateQuantityCart } = require("../models/repositories/cart.repo")

const addToCart = async ({ userId, product  = {} }) => {
    if (!product || !product.product_id || !product.quantity) {
        throw new BadRequestError("Invalid product data");
    }
    const foundCart = await findCartToUpdate(userId)

    if(!foundCart) {
        const newCart = await createCart({
            cart_userId: userId,
            cart_products: [product],
            cart_count: 1
        })
        return newCart
    }
    const products = foundCart.cart_products
    const foundIndex = products.findIndex(p => p.product_id === product.product_id)
    if(foundIndex !== -1) {
        products[foundIndex].quantity += product.quantity
        
        // danh dau array da thay doi vi mgdb khong the tu dong nhan dien su thay doi cua array
        foundCart.markModified('cart_products') 
    } else {
        foundCart.cart_products.push(product)
        foundCart.cart_count +=  1
    }

    return await foundCart.save()
}

const getListCart = async (userId) => {
    const foundCart = await findCart(userId)
    if(foundCart.cart_products.length === 0 || !foundCart) {
        return {
            products: [],
            totalMoney: 0
        }
    }
    const totalMoney = foundCart.cart_products.reduce((total, product) => {
        return total + product.product_price * product.quantity
    }, 0)
    return {
        products : foundCart.cart_products,
        totalMoney: totalMoney
    }
}

const deleteItemProuct = async ({userId, productId}) => {
    const query = {
        cart_userId: userId,
        "cart_products.product_id": productId
    },
    update = {
        $pull: {
            cart_products: {
                product_id: productId
            }
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

const updateQuanity = async ({ userId, product_id, quantity}) => {
    
    const updateCart = await updateQuantityCart({userId, product_id, quantity})
    
    const product = updateCart.cart_products.find(p => p.quantity <= 0 )
    if(product) {
        return await deleteItemProuct({userId, productId: product.product_id})
    }

    return updateCart

}



module.exports = {
    addToCart,
    getListCart,
    deleteItemProuct,
    updateQuanity
}