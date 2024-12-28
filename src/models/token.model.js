'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Token'
const COLLECTION_NAME = 'tokens'

const TokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    public_key: {
        type: String,
        required: true
    },
    private_key: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    refreshTokens_used: {
        type: Array,
        default: []
    }
}, { 
    timestamps: true,
    collection: COLLECTION_NAME
})

TokenSchema.index({ user: 1 })

module.exports = model(DOCUMENT_NAME, TokenSchema)