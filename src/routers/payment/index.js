'use strict'

const router = require('express').Router()
const { authentication } = require('../../auths/authUtils')
const paymentController = require('../../controllers/payment.controller')
const { asyncHandler } = require('../../helpers/catch.error')


router.use(asyncHandler(authentication))

router.use('/create', asyncHandler(paymentController.createPayment))

module.exports = router