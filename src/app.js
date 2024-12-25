const compression = require('compression')
const helmet = require('helmet')
const express = require('express')
const morgan = require('morgan')

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

// DB Connection


// Routes
app.get('/', (req, res, next) => {
    res.status(200).json('Hello World')
})

// Error handler


module.exports = app
