'use strict'

class SuccessResponse {
    constructor({
        message,
        metadata,
    }){
        this.message = message
        this.metadata = metadata
    }
    send(res){
        return res.status(200).json(this)
    }
}

module.exports = {
    SuccessResponse
}