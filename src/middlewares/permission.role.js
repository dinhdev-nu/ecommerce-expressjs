'use strict'

const permissionModel = require("../models/permission.model")
const { getPermission } = require("../services/permission.service")
const { ForbiddenError } = require('../core/error.respon')
const userModel  = require('../models/user.model')
const {asyncHandler } = require('../helpers/catch.error')
const { permission } = require("process")

const authorize = async (roles)=> {
    return asyncHandler(async ( req, res, next ) => {
        const user_id = req.user.userId
        const findRole = await userModel.findOne({ _id: user_id }).lean()
        if(!roles.includes(findRole.roles)) {
            throw new ForbiddenError('You do not have permission to access this resource')
        }
        if(!permission) {
            throw new ForbiddenError('You do not have permission to access this resource')
        }
        next()  
    })
    
}

// const authorize2 = async (permissions)=> {
//     return asyncHandler(async ( req, res, next ) => {
//         const user_id = req.user.userId
//         const findRole = await userModel.findOne({ _id: user_id }).lean()
//         const permission = await permissionModel.find({
//             role_name: findRole.roles 
//         }).lean()
//         if(!permission) {
//             throw new ForbiddenError('You do not have permission to access this resource')
//         }
//         permissions.forEach(perm => {
//             if(!permission.includes(perm)) {
//                 throw new ForbiddenError('You do not have permission to access this resource')
//             }
//         })
//         next()  
//     })
    
// }

module.exports = {
    authorize
    // authorize2
}