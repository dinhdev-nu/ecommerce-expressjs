'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'comments'

const commentSchema = new Schema({
    comment_prouductId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    comment_userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    comment_content: {
        type: String,
        required: true
    },
    comment_rating: {
        type: Number,
        default: 0
    },
    comment_left: {
        type: Number,
        required: true
    },
    comment_right: {
        type: Number,
        required: true
    }

},
{
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = model(DOCUMENT_NAME, commentSchema)