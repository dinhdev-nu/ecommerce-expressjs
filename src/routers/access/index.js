'use strict';

const { Router } = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/catch.error');
const { authentication } = require('../../auths/authUtils');
const { handleRoleUser }  = require('../../services/user.service')
const router = Router()

router.use(asyncHandler(handleRoleUser))

router.post('/signup/:roles', asyncHandler(accessController.signup))
router.post('/login/:roles', asyncHandler(accessController.login))

router.use(asyncHandler(authentication))

router.post('/logout/:roles', asyncHandler(accessController.logout))
router.post('/refreshtoken/:roles', asyncHandler(accessController.handleRefreshToken))

module.exports = router
