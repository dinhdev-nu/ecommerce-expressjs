const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

const UserSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    roles: {
        type: String,
        enum: ['admin', 'customer', 'shop'],    
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, UserSchema)