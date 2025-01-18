'use strict'

const { BadRequestError } = require('../core/error.respon')

const handleRoleUser = async (req, res, next) => {
    const url = req.originalUrl
    let modelRef, roles
    if( url.includes('admin') ){ 
        roles = 'admin'
        modelRef = require('../models/customer.model')
    } else if( url.includes('customer') || url === '/v1/api/access/signup' ){
        roles = 'customer'
        modelRef = require('../models/customer.model')
    } else if ( url.includes('shop') ){
        roles = 'shop'
        modelRef = require('../models/shop.model')
    } else {
        throw new BadRequestError("Invalid roles")
    }
    req.roles = roles
    req.modelRef = modelRef
    next()
}

const block = async roles => {
    if(roles === 'admin')
        throw new BadRequestError('Something went wrong!')
    return roles
}


module.exports = {
    handleRoleUser,
    block
}