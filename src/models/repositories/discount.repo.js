'use strict'

const discountModel = require("../discount.model")

const findDiscountByCode = async ({discount_code, discount_shopId}) => {
    try {
        return await discountModel.findOne({ discount_code, discount_shopId }).lean()
    } catch (error) {
        throw error
    }
}

module.exports = {
    findDiscountByCode
}