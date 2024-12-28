'use strict'

const {
    STATUS_ERROR,
    REASON_ERROR
} = require('../utils/httpError')



class ErrorRespon extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

class NotFoundError extends ErrorRespon {
    constructor(message = REASON_ERROR.NOT_FOUND, statusCode = STATUS_ERROR.NOT_FOUND) {
        super(message, statusCode)
    }
}
class BadRequestError extends ErrorRespon {
    constructor(message = REASON_ERROR.BAD_REQUEST, statusCode = STATUS_ERROR.BAD_REQUEST) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorRespon {
    constructor(message = REASON_ERROR.UNAUTHORIZED, statusCode = STATUS_ERROR.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class ConflictError extends ErrorRespon {
    constructor(message = REASON_ERROR.CONFLICT, statusCode = STATUS_ERROR.CONFLICT) {
        super(message, statusCode)
    }
}
class ForbiddenError extends ErrorRespon {
    constructor(message = REASON_ERROR.FORBIDDEN, statusCode = STATUS_ERROR.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ErrorRespon,
    NotFoundError,
    BadRequestError,
    ForbiddenError,
    ConflictError,
    AuthFailureError
}
