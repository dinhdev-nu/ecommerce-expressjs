    'use strict'

    const commentModel = require("../models/comment.model")

    const createComment = async ({ user_id, product_id, content, left, right }) => {
        const foundComment = await commentModel.find({
            comment_prouductId: product_id,
        }).lean()
        if(!foundComment){
            const comment = commentModel.create({
                comment_userId: user_id,
                comment_prouductId: product_id,
                comment_content: content,
                comment_left: 1,
                comment_right: 2,
            })
        }
        const newLeft = right
        const newRight = right + 1

        await commentModel.updateMany({
            comment_prouductId: product_id,
            comment_left: { $gte: left },
            comment_right: { $gt: right }
        }, {
            $inc: { comment_right: 2 }
        }
        )
        await commentModel.updateMany({
            comment_prouductId: product_id,
            comment_left: { $gt: left },
            comment_right: { $gt:  right},
        }, {
            $inc: { comment_left: 2, comment_right: 2 }
        }
        )

        const comment = commentModel.create({
            comment_userId: user_id,
            comment_prouductId: product_id,
            comment_content: content,
            comment_left: newLeft,
            comment_right: newRight,
        })
        
        return comment
    }

const deleteComment = async ({ comment_id }) => {
    const comment = await commentModel.findOneAndDelete({
        _id: comment_id,
    }, {
        new: true,
    }).lean()
    const { comment_left, comment_right } = comment
    if( comment_right - comment_left === 1){
        
        await commentModel.updateMany({
            comment_prouductId: product_id,
            comment_left: { $gte: left },
            comment_right: { $gt: right }
        }, {
            $inc: { comment_right: -2 }
        }
        )
        await commentModel.updateMany({
            comment_prouductId: product_id,
            comment_left: { $gt: left },
            comment_right: { $gt:  right},
        }, {
            $inc: { comment_left: -2, comment_right: -2 }
        }
        )

        return comment
    }
    
    const fix = comment_right - comment_left - 1

    await commentModel.updateMany({
        comment_prouductId: product_id,
        comment_left: { $gte: left },
        comment_right: { $gt: right }
    }, {
        $inc: { comment_right:  fix}
    }
    )
    await commentModel.updateMany({
        comment_prouductId: product_id,
        comment_left: { $gt: left },
        comment_right: { $gt:  right},
    }, {
        $inc: { comment_left: fix, comment_right: fix }
    }
    )

    return comment
}

const updateComment = async ({ comment_id, content }) => {
    return await commentModel.findOneAndUpdate({
        _id: comment_id,
    }, {
        comment_content: content,
    }, {
        new: true,
    })
}

const getComment = async ({ comment_prouductId, limit = 5 , page = 1}) => {
    const skip = (+page - 1) * +limit 
    const comments = await commentModel.find({ comment_prouductId })
                                        .sort({ comment_left: 1 })
                                        .lean()
    const finalComments = comments.map((cm, i) => {
        return cm.comment_left + 1 !== comments[i + 1].comment_left
    })

    return finalComments.slice(skip, skip + limit)

    
}   

const getReplyComment = async ({ 
        comment_prouductId, comment_left, comment_right, limit = 5, page = 1
    }) => {
    
    const skip = (+page - 1) * +limit

    return await commentModel.find({
        comment_prouductId,
        comment_left: { $gt: comment_left },
        comment_right: { $lt: comment_right }
    })
    .limit(+limit)
    .skip(skip)
    .lean()
}

module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    getReplyComment
}

