'use strict'

const { findDiscountByCode } = require("../models/repositories/discount.repo")
const { NotFoundError } = require("../core/error.respon")
const handleDiscountCode = async (req, res, next) => {
    try {
        const { discount_code, discount_shopId } = req.body
        const foundDiscount = await findDiscountByCode({ discount_code, discount_shopId })
        if(!discount_code)
            throw new NotFoundError('Discount code not found')
        if(!foundDiscount.discount_is_active)
            throw new NotFoundError('Discount code not found')

        if(foundDiscount.discount_current_usage >= foundDiscount.discount_max_usage)
            throw new NotFoundError('Discount code not found')

        const { discount_start_date, discount_end_date } = foundDiscount
        const currentDate = new Date()
        if(currentDate < discount_start_date || currentDate > discount_end_date)
            throw new NotFoundError('Discount code not found')

        req.discount = foundDiscount
        next()

    } catch (error) {
        throw error
    }
}

module.exports = {
    handleDiscountCode
}