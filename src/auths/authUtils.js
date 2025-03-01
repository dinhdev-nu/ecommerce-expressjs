'use strict'

const jwt = require('jsonwebtoken')
const { AuthFailureError } = require('../core/error.respon')
const tokenModel = require('../models/token.model')

const HEADER = {
    CLIENT_ID: 'x-client-id', // id shop
    REFRESHTOKEN: 'x-rtoken-id',
    AUTHORIZATION: 'authorization' //  accessToken  cua login        
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

const authentication = async(req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if(!userId){
        throw new AuthFailureError('Invalid User ')
    }
    const tokens = await tokenModel.findOne({user: userId})
    if(!tokens){
        throw new AuthFailureError('Invalid User or user was logout')
    }
    

    // case refresh token from headers
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

    const token = req.headers[HEADER.AUTHORIZATION]?.toString()
    const accessToken = token?.split(' ')[1]
    
    if(!accessToken){
        throw new AuthFailureError('Invalid User ')
    }
    const decoded = await verifyToken(accessToken, tokens.public_key)
    if(decoded.userId !== userId){
        throw new AuthFailureError('Invalid User ')
    }

    req.user = decoded
    return next()
}

// case refresh token from cookies
const handleToken = async(req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]?.toString()
    if(!userId){
        throw new AuthFailureError('Invalid User ')
    }
    const tokens = await tokenModel.findOne({user: userId})
    if(!tokens){
        throw new AuthFailureError('Invalid User or user was logout')
    }
    const refreshToken = req.cookies[process.env.JWT_KEY]?.toString()
    if(!refreshToken){
        throw new AuthFailureError('Invalid User ')
    }
    const decoded = await verifyToken(refreshToken, tokens.private_key)

    if(decoded.userId !== userId){
        throw new AuthFailureError('Invalid User')
    }

    req.user = decoded,
    req.tokens = tokens,
    req.refreshToken = refreshToken
    return next()
    
}


const verifyToken = async(token, publicKey) => {
    try {
        const decoded = await jwt.verify(token, publicKey)
        return decoded
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthFailureError('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new AuthFailureError('Invalid token');
        }
    }
}

module.exports = {
    createTokenPair,
    verifyToken,
    authentication,
    handleToken
}