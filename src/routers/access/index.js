'use strict';

const { Router } = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/catch.error');
const { authentication, handleToken } = require('../../auths/authUtils');
const { handleRoleUser }  = require('../../services/user.service')
const router = Router()

router.use(handleRoleUser)
 

// roles? là parmas có thể có hoặc không
router.post('/signup/:roles?', asyncHandler(accessController.signup))
router.post('/login/:roles?', asyncHandler(accessController.login))


router.post('/refreshtoken/:roles',asyncHandler(handleToken), asyncHandler(accessController.handleRefreshToken))

router.use(asyncHandler(authentication))

router.post('/logout/:roles', asyncHandler(accessController.logout))

module.exports = router
