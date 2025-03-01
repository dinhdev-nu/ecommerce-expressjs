'use strict'

const router = require('express').Router()
const { handleDiscountCode } = require('../../middlewares/check.discount.code')
const { asyncHandler } = require('../../helpers/catch.error')
const discountControler = require('../../controllers/discount.controler')
const { authentication } = require('../../auths/authUtils')



router.get('/all', asyncHandler(discountControler.getAllActiveDiscounts))
router.get('/detail', asyncHandler(discountControler.getDiscount))
router.get('/product/:productId', asyncHandler(discountControler.getDiscountsForProduct))
router.post('/apply', asyncHandler(handleDiscountCode), asyncHandler(discountControler.applyDiscount))


router.use(asyncHandler(authentication))

router.get('/shop', asyncHandler(discountControler.getDiscountsForShop))
router.post('/create', asyncHandler(discountControler.createDiscount))
router.put('/update', asyncHandler(discountControler.updateDiscount))
router.patch('/update/status/:discount_id', asyncHandler(discountControler.updateStatus))
router.delete('/delete/:discount_id', asyncHandler(discountControler.deleteDiscount))

module.exports = router