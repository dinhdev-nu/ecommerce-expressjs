'use strict';

const { Router } = require('express');
const { asyncHandler } = require('../../helpers/catch.error');
const { authentication } = require('../../auths/authUtils');
const { handleRoleUser }  = require('../../services/user.service');
const permissionController = require('../../controllers/permission.controller');
const router = Router()

// router.use(asyncHandler(authentication))

router.post('', asyncHandler(permissionController.createPermission))

module.exports = router
