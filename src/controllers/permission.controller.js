'use strict'
const { SuccessResponse } = require('../core/success.respon')
const { createPermission } = require('../services/permission.service')

class PermissionControler{
    createPermission = async (req, res, next) => {
        new SuccessResponse({
            message: "Permission created successfully",
            metadata: await createPermission({
                ...req.body
            })
        }).send(res)
    }
}

module.exports = new PermissionControler()