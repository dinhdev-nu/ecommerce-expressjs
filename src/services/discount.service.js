'use strict'

const { BadRequestError } = require("../core/error.respon")
const discountModel = require("../models/discount.model")
const { findDiscountByCode } = require("../models/repositories/discount.repo")

const createDiscount = async (payload) => {
    try {

        const {
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_status, discount_max_usage,
            discount_min_order, discount_apply_to,
            discount_specific_products
         } = payload

        const foundDiscount = await findDiscountByCode({discount_code, discount_shopId})
        if(foundDiscount || foundDiscount.discount_is_active)
            throw new BadRequestError('Discount code already exists')


        return await discountModel.create({
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_status, discount_max_usage,
            discount_min_order, discount_apply_to,
            discount_specific_products: discount_apply_to === "all" ? [] : discount_specific_products
        })

        
    } catch (error) {
        throw error
    }
}

const updateDiscount = async ({discount_id, shop_id , payload}) => {
    try {
        
        const {
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_status, discount_max_usage,
            discount_min_order, discount_apply_to,
            discount_specific_products
        } = payload 

        const filter = {
            _id: discount_id,
            discount_shopId: shop_id
        }
        const foundDiscount = await discountModel.findOne(filter).lean()
        if(!foundDiscount)
            throw new BadRequestError('Discount not found')

        const update = {
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_status, discount_max_usage,
            discount_min_order, discount_apply_to,
            discount_specific_products: discount_apply_to === "all" ? [] : discount_specific_products
        },
        options = {new: true}

        return await discountModel.findOneAndUpdate(filter, update, options).lean()
    } catch (error) {
        throw error
    }
}

const getAllActiveDiscounts = async ({ shop_id, discount_type}) => {
    try {
        
        const filter = {
            discount_status: 'active',
        }
        if(shop_id)
            filter.discount_shopId = shop_id
        if(discount_type)
            filter.discount_type = discount_type

        return await discountModel.find(filter).lean()

    } catch (error) {
        throw error
    }
}

const getDiscountsForShop = async ({ shop_id, discount_type}) => {
    try {
        const filter = {
            discount_shopId: shop_id
        }
        if(discount_type)
            filter.discount_type = discount_type

        return await discountModel.find(filter).lean()

    } catch (error) {
        throw error
    }
}

const getDetailDiscount = async ({ discount_id }) => {
    const filter = {
        _id: discount_id,
    }

    return await discountModel.findOne(filter)
            .populate('discount_specific_products').lean()   
}


const deleteDiscount = async ({ discount_id, shop_id }) => {
    const filter = {
        _id: discount_id,
        discount_shopId: shop_id
    }
    return await discountModel.findOneAndDelete(filter).lean()
}
/***
    * @param {Object} payload: {
        "discount_code": "NEWYEAR2025",
        "discount_id": "63f45acade6f1a4f69b54321",
        "user_id": "63f45acade6f1a4f69b54321", ( chua )
        "order_value": 150,
        "products": ["63f45acade6f1a4f69b12345", "63f45acade6f1a4f69b67890"]
    }

    * @returns {Object} : {
        "discount_value": 15,
        "final_price": 135
    }
 ***/
const applyDiscount = async (payload) => {
    const { discount, products, order_value } = payload

    const { discount_apply_to, discount_specific_products, discount_type, discount_value } = discount
    if(order_value < discount.discount_min_order || discount.discount_current_usage > discount.discount_max_usage)
        throw new BadRequestError('Discount not valid for this order')
    if(discount_apply_to === "specific_products"){
        const isDiscountValid = products.every(product => {
            return discount_specific_products.includes(product)
        })
        if(!isDiscountValid)
            throw new BadRequestError('Discount not valid for these products')
    } 

    const result = {
        discount_value: discount_value,
        final_price: 0
    }

    if(discount_type == 'percentage'){
        result.discount_value = order_value * discount_value / 100
    }

    result.final_price = order_value - result.discount_value

    return result
}

module.exports = {
    createDiscount,
    updateDiscount,
    getAllActiveDiscounts,
    getDiscountsForShop,
    getDetailDiscount,
    deleteDiscount,
    applyDiscount
}

    