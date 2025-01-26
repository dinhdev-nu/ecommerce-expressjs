'use strict'

const router = require('express').Router()
const { asyncHandler } = require('../../helpers/catch.error')
const { authentication } = require('../../auths/authUtils')
const commentController = require('../../controllers/comment.controller')

router.use(asyncHandler(authentication))

router.post('/create', asyncHandler(commentController.createComment))
router.delete('/delete/:comment_id', asyncHandler(commentController.deleteComment))
router.put('/update/:comment_id', asyncHandler(commentController.updateComment))
router.get('/list/:product_id', asyncHandler(commentController.getListComment))
router.get('/reply/:comment_id', asyncHandler(commentController.getReplyComment))


module.exports = router