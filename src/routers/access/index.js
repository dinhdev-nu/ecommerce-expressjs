'use strict';

const { Router } = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/catch.error');
const { authentication } = require('../../auths/authUtils');
const router = Router()

router.post('/signup', asyncHandler(accessController.signup))
router.post('/login', asyncHandler(accessController.login))

router.use(asyncHandler(authentication))

router.post('/logout', asyncHandler(accessController.logout))
router.post('/refreshtoken', asyncHandler(accessController.handleRefreshToken))

module.exports = router
