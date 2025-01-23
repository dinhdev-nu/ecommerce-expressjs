'use strict'

const { SuccessResponse } = require("../core/success.respon")
const { createOrder, updateStatusOrder, getDetailOrder, getlistOrderForUser, cancelOrder } = require("../services/order.service")

class OrderController {
    async createOrder( req, res, next ){
        new SuccessResponse ({
            message: "Order created successfully",
            metadata: await createOrder ({
                order_userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }

    async updateOrder ( req, res, next ){
        new SuccessResponse ({
            message: "Order updated successfully",
            metadata: await updateStatusOrder ({
                order_userId: req.user.userId,
                order_status: req.body.order_status,
                orderId: req.params.orderId
            })
        }).send(res)
    }

    async cancelOrder ( req, res, next ){
        new SuccessResponse ({
            message: "Order canceled successfully",
            metadata: await  cancelOrder ({
                order_userId: req.user.userId,
                orderId: req.params.orderId
            })
        }).send(res)
    }

    async getDetailOrder ( req, res, next ){
        new SuccessResponse ({
            message: "Order detail",
            metadata: await getDetailOrder ({
                order_userId: req.user.userId,
                orderId: req.params.orderId
            })
        }).send(res)
    }
    async getlistOrder ( req, res, next ){
        new SuccessResponse ({
            message: "List order",
            metadata: await getlistOrderForUser ({
                order_userId: req.user.userId
            })
        }).send(res)
    }

}

module.exports = new OrderController()