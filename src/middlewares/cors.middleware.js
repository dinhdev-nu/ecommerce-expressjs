'use strict'

const cors = require('cors')

const handleCors = cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-api-key', 'x-client-id', 'authorization' ]
})

const core = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-client-id, authorization')
    res.setHeader('Access-Control-Allow-Credentials', true)
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
}

module.exports = handleCors