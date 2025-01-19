const { Router } = require('express');
const { checkAuthen, checkPermission } = require('../auths/checkAuth');
const router = Router()

router.use(checkAuthen)
router.use(checkPermission('0000'))

router.use('/v1/api/access', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/cart', require('./cart'))

module.exports = router