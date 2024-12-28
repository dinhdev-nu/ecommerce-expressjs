'use strict';

const { Router } = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/catch.error');
const { handleRefreshToken } = require('../../auths/authUtils');
const router = Router()

router.post('/signup', asyncHandler(accessController.signup))
router.post('/login', asyncHandler(accessController.login))

router.use(asyncHandler(handleRefreshToken))

router.post('/logout', asyncHandler(accessController.logout))
router.post('/refreshtoken', asyncHandler(accessController.handleRefreshToken))

module.exports = router
