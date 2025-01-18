'use strict';

const { SuccessResponse } = require('../core/success.respon');
const AccessService = require('../services/access.service');
const { block } = require('../services/user.service');

class AccessControler {
    signup = async (req, res, next) => {
        new SuccessResponse({
            message: 'Sign up success',
            metadata: await AccessService.signup({
                ...req.body,
                model: req.modelRef,
                roles: await block(req.roles)
            })
        }).send(res)
    }
    
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login success',
            metadata: await AccessService.login({
                ...req.body,
                model: req.modelRef,
                roles: req.roles
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout(req.user.userId)
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Refresh token success',
            metadata: await AccessService.handleRefreshToken({
                user: req.user, 
                refreshToken: req.refreshToken, 
                tokens: req.tokens,
                model: req.modelRef
            })
        }).send(res)
    }
}

module.exports = new AccessControler