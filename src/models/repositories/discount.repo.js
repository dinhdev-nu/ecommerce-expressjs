'use strict'

const { BadRequestError } = require("../../core/error.respon")
const discountModel = require("../discount.model")

const findDiscountByCode = async ({discount_code, discount_shopId}) => {
    try {
        return await discountModel.findOne({ discount_code, discount_shopId }).lean()
    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
}

const findDiscountById = async (discountId) => {
    try {
        return await discountModel.findById(discountId).lean()
    } catch (error) {
        throw new BadRequestError('Discount not found')
    }
}


module.exports = {
    findDiscountByCode,
    findDiscountById
}