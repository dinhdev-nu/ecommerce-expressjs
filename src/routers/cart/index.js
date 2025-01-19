'use strict';

const { Router } = require('express');
const CartControler = require('../../controllers/cart.controler');
const { asyncHandler } = require('../../helpers/catch.error');
const { authentication } = require('../../auths/authUtils');
const router = Router()


router.post('/addtocart', asyncHandler(CartControler.setToCart))
router.delete('/deleteitem/:productId', asyncHandler(CartControler.deteleItem))
router.get('/getlistcart/:userId', asyncHandler(CartControler.getListCart))
router.put('/updatequanity', asyncHandler(CartControler.updateQuanity))



module.exports = router
