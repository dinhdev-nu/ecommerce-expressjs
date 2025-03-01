'use strict'

const { SuccessResponse } = require("../core/success.respon")
const { orderConfirm } = require("../services/payment.service")

class PaymentController {
    async createPayment( req, res, next ){
        new SuccessResponse({
            message: "Payment created successfully",
            metadata: await orderConfirm({
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new PaymentController()