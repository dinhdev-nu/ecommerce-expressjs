'use strict'

const { Types } = require("mongoose")
const { BadRequestError } = require("../core/error.respon")
const discountModel = require("../models/discount.model")
const { findDiscountByCode } = require("../models/repositories/discount.repo")
const { getSelect } = require("../utils")

const createDiscount = async (payload) => {
    try {

        const {
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_min_order, discount_apply_to,
            discount_max_usage, discount_is_active,
            discount_specific_products
         } = payload
        const foundDiscount = await findDiscountByCode({discount_code, discount_shopId})
        if(foundDiscount)
            throw new BadRequestError('Discount code already exists')


        return await discountModel.create({
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_min_order, discount_apply_to,
            discount_max_usage, discount_is_active, 
            discount_specific_products: discount_apply_to === "all" ? [] : discount_specific_products
        })

        
    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
}

const updateDiscount = async ({discount_id, shop_id , payload}) => {
    try {
        
        const {
            discount_shopId, discount_name,
            discount_description, discount_type,
            discount_value, discount_start_date,
            discount_end_date, discount_code,
            discount_max_usage,
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
            discount_max_usage,
            discount_min_order, discount_apply_to,
            discount_specific_products: discount_apply_to === "all" ? [] : discount_specific_products
        },
        options = {new: true}

        return await discountModel.findOneAndUpdate(filter, update, options).lean()
    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
}

const updateStatus = async ({ discount_id, shop_id }) => {
    try {
        const query = {
            discount_shopId : shop_id,
            _id: discount_id,
        }
        const discount = await discountModel.findOne(query)
        if(!discount)
            throw new BadRequestError('Discount not found')
        const status = discount.discount_is_active
        discount.discount_is_active = !status
        return await discount.save()
    } catch (error) {
        throw new BadRequestError('Discount not found')
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
        throw new BadRequestError('Discount not found')
    }
}

const getDiscountsForShop = async ({ shop_id, discount_type}) => {
    try {
        const filter = {
            discount_shopId: shop_id
        }
        if(discount_type)
            filter.discount_type = discount_type

        const Select = [
            'discount_name','discount_type',
            'discount_value', 'discount_start_date', 'discount_end_date',
            'discount_code','discount_is_active'
        ]
        return await discountModel.find(filter).select(getSelect(Select)).lean()

    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
}

const getDetailDiscount = async ({ discount_id }) => {
    const filter = {
        _id: discount_id,
    }

    return await discountModel.findOne(filter)
            .populate('discount_specific_products').lean()   
}
const getDiscountsForProduct = async ({ product_id, shop_id }) => {
    try {
        const discounts =  await discountModel.aggregate([
            {
                $match: {
                    discount_shopId: new Types.ObjectId(shop_id),
                    discount_is_active: true
                }
            },
            {
                $match: {
                    $or: [
                        { discount_apply_to: "all" },
                        { discount_specific_products: new Types.ObjectId(product_id) }
                    ]
                }
            },
            {
                $project: {
                    discount_name: 1,
                    discount_value: 1,
                    discount_start_date: 1,
                    discount_end_date: 1,
                    discount_code: 1,
                    discount_type: 1,
                    discount_user_used: 1,
                    discount_current_usage: 1,
                    discount_max_usage: 1,
                    discount_min_order: 1,
                }
            }
        ])

        const setDiscount = (i, message) => {
            discounts[i].inValid = false
            discounts[i].message = message
        }

        discounts.forEach((dis, i) => {
            if(dis.discount_user_used.includes(product_id)){
                setDiscount(i , 'Discount already used')
            }
            else if(dis.discount_current_usage >= dis.discount_max_usage){
                setDiscount(i, 'Discount reached max usage')
            }
            else if(dis.discount_end_date < new Date()){
                setDiscount(i, 'Discount expired')
            }
            else if(dis.discount_start_date > new Date()){
                setDiscount(i, 'Discount not started yet')
            }
        })

        return discounts

    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
}

const deleteDiscount = async ({ discount_id, shop_id }) => {
    try {
        const filter = {
            _id: discount_id,
            discount_shopId: shop_id,
        }
        return await discountModel.findOneAndDelete(filter).lean()
    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
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
    try {
        const { discount, product } = payload

        const orderPrice = product.quantity * product.product_price
        if(orderPrice < discount.discount_min_order)
            throw new BadRequestError("Order value is not enough to apply discount")

        const { discount_apply_to, discount_specific_products, discount_type, discount_value } = discount

        if(discount_apply_to === "specific_products"){
            const isDiscountValid = discount_specific_products.every(productId => {
                return productId.toString() === product._id
            })
            if(!isDiscountValid)
                throw new BadRequestError('Discount not valid for this product!')
        } 

        const discountDetails = {
            discountAmount: discount_value,  
            originalPrice: orderPrice,  
            totalDiscount: 0,  
            finalPrice: 0  
        }
        
        let appliedDiscount = discount_value;
        
        if (discount_type === 'percentage') {
            appliedDiscount = orderPrice * discount_value / 100;
        }
        
        discountDetails.totalDiscount = appliedDiscount;
        discountDetails.finalPrice = orderPrice - discountDetails.totalDiscount;
        

        return discountDetails
    } catch (error) {
        console.log(error)
        throw new BadRequestError('Discount not found ! Pls try another one')
        
    }
}

module.exports = {
    createDiscount,
    updateDiscount,
    updateStatus,
    getAllActiveDiscounts,
    getDiscountsForShop,
    getDetailDiscount,
    deleteDiscount,
    applyDiscount,
    getDiscountsForProduct
}

    