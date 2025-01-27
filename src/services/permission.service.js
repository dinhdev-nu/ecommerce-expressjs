'use strict'

const permissionModel = require("../models/permission.model")


// Admin
const createPermission = async ({ role, permissions }) => { 
    const filter = { role_name: role }
    const update = {
        $addToSet: { permission: { $each: permissions }}
    } // each is add per element in array
    const options = { upsert: true , new: true }
    const permission = await permissionModel.findOneAndUpdate(filter, update, options)
    return permission
}

module.exports = {
    createPermission,
}