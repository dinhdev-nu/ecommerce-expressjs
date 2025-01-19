'use strict'

const shopModel = require('../models/shop.model')
const userModel = require('../models/user.model')
const tokenModel = require('../models/token.model')
const { BadRequestError } = require('../core/error.respon')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')   
const { createTokenPair } = require('../auths/authUtils')
const { getInforData } = require('../utils')
const { createToken } = require('./token.service')

class AccessService {

    static handleRefreshToken = async({user, refreshToken, tokens, model }) => {
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

            const foundUser = await model.findOne({email: user.email}).lean()
            if(!foundUser)  
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
                shop: getInforData(foundUser, ['_id', 'name', 'email']),
                tokens: tokenPair
            }
            
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

    static login = async({email, password, model}) => {
        try {

            const foundEmail = await model.findOne({email}).lean()
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

                user: getInforData(foundEmail, ['_id', 'name', 'email']),
                tokens: tokenPair,

            }


        } catch (error) {
            throw error
        }

    }

    static signup = async({ name, email, password, model, roles }) => {
        try {
            
            const foundEmail = await model.findOne({email}).lean()

            if(foundEmail)
                throw new BadRequestError('Email already exists')

            const hashPassword = await bcrypt.hash(password, 10)

            const newUser = await model.create({
                name,
                email,
                password: hashPassword,
                roles: roles
            })
            userModel.create({
                userId: newUser._id,
                roles: roles
            })
            return newUser
        } catch (error) {
            throw error
        }

    }
}

module.exports = AccessService