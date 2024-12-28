'use strict';

const tokenModel = require("../models/token.model");

const createToken = async({ userId, publicKey, privateKey, refreshToken, refreshTokenUsed = []}) => {
    try {
        const filter = {
            user: userId
        }, update = {
            public_key: publicKey,
            private_key: privateKey,
            refresh_token: refreshToken,
            refreshTokens_used: refreshTokenUsed
        }, options = {
            upsert: true,
            new: true
        }
    
        const newToken = await tokenModel.findOneAndUpdate(filter, update, options)
        return newToken ? newToken.public_key : null
    
    } catch (error) {
        throw error
    }
}

module.exports = { 
    createToken
}
