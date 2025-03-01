'use strict'

const { Router } = require('express')
const { asyncHandler } = require('../../helpers/catch.error')
const { authentication } = require('../../auths/authUtils')
const productController = require('../../controllers/product.controller')
const router = Router()

router.get('/', asyncHandler(productController.getAllProducts)) // OK
router.get('/search', asyncHandler(productController.searchProduct)) // OK
router.get('/shop/publish/:shop_id', asyncHandler(productController.getProductPublishedByShop)) // OK
router.get('/filter', asyncHandler(productController.filterProduct))
router.get('/detail/:product_id', asyncHandler(productController.getProductDetail)) // OK

router.use(asyncHandler(authentication))
// create
router.post('/', asyncHandler(productController.create)) // OK

// update
router.put('/update/:product_id', asyncHandler(productController.update)) // OK
router.patch('/update/draft/:product_id', asyncHandler(productController.updateProductDraft))  // OK
router.patch('/update/publish/:product_id', asyncHandler(productController.updateProductPublished))  // OK

// delete
router.delete('/delete/:product_id', asyncHandler(productController.delete)) // OK

// get
router.get('/shop/draft', asyncHandler(productController.getProductDraftsByShop)) // OK
router.get('/shop/products', asyncHandler(productController.getAllProductsByShop))  // OK


module.exports = router