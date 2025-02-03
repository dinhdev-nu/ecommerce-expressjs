'use strict'

const { BadRequestError } = require('../core/error.respon')

const handleRoleUser = async (req, res, next) => {
    const url = req.originalUrl
    console.log(url)
    let modelRef, roles
    if( url.includes('admin') ){ 
        roles = 'admin'
        modelRef = require('../models/customer.model')
    } else if ( url.includes('shop') ){
        roles = 'shop'
        modelRef = require('../models/shop.model')
    } else {
        roles = 'customer'
        modelRef = require('../models/customer.model')
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