const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')

const app = express()
require('dotenv').config()

// Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

// DB Connection
require('./dbs/init.mongodb')
require('./helpers/check.connect')

// Routes
app.use('/', require('./routers/index'))

// Error handler
app.use((req, res, next) => {
    const status = 404
    const error = new Error('Not Found!!')
    error.status = status
    next(error)
})

app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    return res.status(status).send({
        status: "Error",
        code: status,
        message: error.message || 'Internal Server Error',
        stack: error.stack
    })
})

module.exports = app
