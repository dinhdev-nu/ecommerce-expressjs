'use strict'

const router = require('express').Router()
const { asyncHandler } = require('../../helpers/catch.error')
const { authentication } = require('../../auths/authUtils')
const orderController = require('../../controllers/order.controller')

router.use(asyncHandler(authentication))


router.post('/create', asyncHandler(orderController.createOrder))
router.patch('/update/:orderId', asyncHandler(orderController.updateOrder))
router.patch('/cancel/:orderId', asyncHandler(orderController.cancelOrder))
router.get('/detail/:orderId', asyncHandler(orderController.getDetailOrder))
router.get('/list', asyncHandler(orderController.getlistOrder))

module.exports = router