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
app.get('/', (req, res, next) => {
    res.status(200).json('Hello World')
})

// Error handler


module.exports = app
