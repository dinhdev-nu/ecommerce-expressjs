'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'apikeys'

const ApiKeySchema = new Schema ({
    apikey: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222', '3333']
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, ApiKeySchema)