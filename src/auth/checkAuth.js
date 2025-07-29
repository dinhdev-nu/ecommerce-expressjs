'use strict';

const apikeyModel = require('../models/apikey.model');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const checkAuthen = async(req, res, next) => {
    try {

        const apikey = req.headers[HEADER.API_KEY]?.toString()

        if(!apikey){
            return res.status(401).json({
                message: 'Forbidden'
            })
        }

        const foundApiKey = await apikeyModel.findOne({apikey}).lean()

        if(!foundApiKey){
            return res.status(401).json({
                message: 'Forbidden'
            })
        }

        req.apikey = foundApiKey
        return next()

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


const checkPermission = (permission) => {
    return (req, res, next) => {
        try {
            const keyPermission = req.apikey.permissions 

            if(!permission || !keyPermission){
                return res.status(403).json({
                    message: 'Permission denied!!'
                })
            }
            if(keyPermission.includes(permission)){
                return next()
            }   
            return res.status(403).json({
                message: 'Permission denied!!'
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}


module.exports = {
    checkAuthen,
    checkPermission
}
