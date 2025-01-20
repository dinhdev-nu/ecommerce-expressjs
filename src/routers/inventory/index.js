'use strict'

const router = require('express').Router()
const { asyncHandler } = require('../../helpers/catch.error');
const { authentication } = require('../../auths/authUtils');
const inventoryControler = require('../../controllers/inventory.controler');

router.use(asyncHandler(authentication))

router.post('/create', asyncHandler(inventoryControler.createInventory))
router.put('/update', asyncHandler(inventoryControler.updateInventory))
router.get('/get/:product_id', asyncHandler(inventoryControler.getInventory))
router.delete('/delete/:product_id', asyncHandler(inventoryControler.deleteInventory))
router.get('/get', asyncHandler(inventoryControler.getInventories))

router.post('/history/create', asyncHandler(inventoryControler.createHistory))
router.get('/history/:inventory_id', asyncHandler(inventoryControler.getHistory))
router.delete('/history/delete/:inventory_id', asyncHandler(inventoryControler.deleteHistory))

module.exports = router
