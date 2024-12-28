'use strict'

const jwt = require('jsonwebtoken')
const { ForbiddenError, AuthFailureError,  BadRequestError } = require('../core/error.respon')
const shopModel = require('../models/shop.model')
const tokenModel = require('../models/token.model')

const HEADER = {
    CLIENT_ID: 'x-client-id', // id shop
    REFRESHTOKEN: 'x-rtoken-id',
    AUTHORIZATION: 'athorization' //  accessToken  cua login        
}

const createTokenPair = async ({payload, publicKey, privateKey}) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '2d'
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7d'
        })

        await jwt.verify(accessToken, publicKey, (error, decoded) => {
            if(error)
                console.log(error)
            else console.log(decoded)
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw error
    }
}

const handleRefreshToken = async(req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if(!userId){
        throw new AuthFailureError('Invalid User')
    }
    const tokens = await tokenModel.findOne({user: userId})
    if(!tokens){
        throw new AuthFailureError('Invalid User or user was logout')
    }

    const refreshToken = req.headers[HEADER.REFRESHTOKEN]?.toString()
    if(refreshToken){
        const decoded = await verifyToken(refreshToken, tokens.private_key)

        if(decoded.userId !== userId){
            throw new AuthFailureError('Invalid User')
        }

        req.user = decoded,
        req.tokens = tokens,
        req.refreshToken = refreshToken
        return next()
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if(!accessToken){
        throw new AuthFailureError('Invalid User')
    }
    const decoded = await verifyToken(accessToken, tokens.public_key)

    if(decoded.userId !== userid){
        throw new AuthFailureError('Invalid User')
    }

    req.user = decoded
    return next()
}

const verifyToken = async(token, publicKey) => {
    try {
        const decoded = await jwt.verify(token, publicKey)
        return decoded
    } catch (error) {
        throw error
    }
}

module.exports = {
    createTokenPair,
    verifyToken,
    handleRefreshToken
}