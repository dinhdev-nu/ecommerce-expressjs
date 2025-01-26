'use strict'
const { SuccessResponse } = require('../core/success.respon')
const { createComment, deleteComment, updateComment, getComment, getReplyComment } = require('../services/comment.service')

class CommentController {
    
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create comment successfully',
            metadata: await createComment({
                user_id: req.user.userId,
                ...req.body
            })
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete comment successfully',
            metadata: await deleteComment({
                comment_id: req.params.comment_id
            })
        }).send(res)
    }

    updateComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update comment successfully',
            metadata: await updateComment({
                comment_id: req.params.comment_id,
                ...req.body
            })
        }).send(res)
    }

    getListComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list comment successfully',
            metadata: await getComment({
                comment_prouductId: req.params.product_id,
                limit: req.query.limit,
                page: req.query.page
            })
        }).send(res)
    }
    

    getReplyComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list reply comment successfully',
            metadata: await getReplyComment({
                comment_prouductId: req.params.comment_id,
                ...req.body,
                limit: req.query.limit,
                page: req.query.page
            })
        }).send(res)
    }   

}

module.exports = new CommentController()