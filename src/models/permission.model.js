'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Permission'
const COLLECTION_NAME = 'permissions'

const permissionSchema = new Schema({
    role_name: {
        type: String,
        required: true,
    },
    permission: {
        type: String,
        required: true,
    }
}, {
    collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, permissionSchema)

