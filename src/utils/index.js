'use strict'

const _ = require('lodash')

const getInforData = (data, infor = [] ) => {
    return _.pick(data, infor)
}

module.exports = {
    getInforData
}