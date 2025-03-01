'use strict'

const { findDiscountByCode, findDiscountById } = require("../models/repositories/discount.repo")
const { NotFoundError, BadRequestError } = require("../core/error.respon")
const handleDiscountCode = async (req, res, next) => {
    try {
        const { discount_code, discount_shopId, discount_id } = req.body
        let foundDiscount ;
        if(!discount_id)
            foundDiscount = await findDiscountByCode({ discount_code, discount_shopId })
        else
            foundDiscount = await findDiscountById(discount_id)

        if(!foundDiscount || !foundDiscount.discount_is_active)
            throw new BadRequestError('Discount code not found !')

        if(foundDiscount.discount_current_usage >= foundDiscount.discount_max_usage)
            throw new BadRequestError("Discount code has been used up ! Pls try another one")

        const { discount_start_date, discount_end_date } = foundDiscount
        const currentDate = new Date()
        if(currentDate < discount_start_date || currentDate > discount_end_date)
            throw new BadRequestError("Discount has expired !")

        req.discount = foundDiscount
        next()

    } catch (error) {
        throw new BadRequestError(error.message)
    }
}

module.exports = {
    handleDiscountCode
}