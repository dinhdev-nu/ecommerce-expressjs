'use strict'

const shopModel = require('../models/shop.model')
const { BadRequestError } = require('../core/error.respon')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')   
const { createTokenPair } = require('../auths/authUtils')
const { getInforData } = require('../utils')
const { createToken } = require('./token.service')
const tokenModel = require('../models/token.model')

class AccessService {

    static handleRefreshToken = async({user, refreshToken, tokens}) => {
        try {

            const { userId, email } = user

            if(!refreshToken)
                throw new BadRequestError('Invalid User')

            if(tokens.refreshTokens_used.includes(refreshToken)){
                await tokenModel.deleteOne({user: userId})
                throw new BadRequestError('Something went wrong! Please login again')
            }

            if(tokens.refresh_token !== refreshToken)
                throw new BadRequestError('Shop not registered!')

            const foundshop = await shopModel.findOne({email: user.email}).lean()
            if(!foundshop)  
                throw new BadRequestError('Shop not registered!')
            const payload = {
                userId,
                email
            }
            const tokenPair = await createTokenPair({payload, publicKey: tokens.public_key, privateKey: tokens.private_key})

            tokens.refresh_token = tokenPair.refreshToken
            tokens.refreshTokens_used.push(refreshToken)
            await tokens.save()

            return{
                shop: getInforData(foundshop, ['_id', 'name', 'email']),
                tokens: tokenPair
            }
            // privateKey = crypto.randomBytes(64).toString('hex')
            // publicKey = crypto.randomBytes(64).toString('hex')

            // payload = {
            //     userId,
            //     email
            // }
            // const tokenPair = await createTokenPair({payload, publicKey, privateKey})


            // const result = await createToken({
            //     userId, 
            //     publicKey, privateKey, 
            //     refreshToken: tokenPair.refreshToken,
            //     refreshTokenUsed: [refreshToken]
            // })

            // return {
            //     shop: getInforData(user, ['_id', 'email']),
            //     tokens: tokenPair
            // }


        } catch (error) {
            throw error
        }
    }


    static logout = async(userId) => {
        try {
            const result = await tokenModel.deleteOne({user: userId})

            return result
        } catch (error) {
            throw error
        }
    }

    static login = async({email, password}) => {
        try {

            const foundEmail = await shopModel.findOne({email}).lean()
            if(!foundEmail)
                throw new BadRequestError('Email or password is incorrect or not found')
            
            const isPassword = await bcrypt.compare(password, foundEmail.password)
            if(!isPassword)
                throw new BadRequestError('Email or password is incorrect or not found')

            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            const payload = {
                userId: foundEmail._id,
                email
            }
            const tokenPair = await createTokenPair({payload, publicKey, privateKey})
            
            await createToken({userId: foundEmail._id, publicKey, privateKey, refreshToken: tokenPair.refreshToken })

            return {

                shop: getInforData(foundEmail, ['_id', 'name', 'email']),
                tokens: tokenPair,

            }


        } catch (error) {
            throw error
        }

    }

    static signup = async({name, email, password}) => {
        try {
            const foundEmail = await shopModel.findOne({email}).lean()

            if(foundEmail)
                throw new BadRequestError('Email already exists')

            const hashPassword = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name,
                email,
                password: hashPassword,
                roles: ['shop']
            })

            return newShop
        } catch (error) {
            throw error
        }

    }
}

module.exports = AccessService