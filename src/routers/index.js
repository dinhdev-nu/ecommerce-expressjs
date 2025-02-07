const { Router } = require('express');
const { checkAuthen, checkPermission } = require('../auths/checkAuth');
const router = Router()

router.use(checkAuthen)
router.use(checkPermission('0000'))

router.use('/v1/api/access', require('./access'))
router.use('/v1/api/upload', require('./upload'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/order', require('./order'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/admin', require('./admin'))
router.use('/v1/api/admin', require('./admin'))

module.exports = router