'use strict';
const httpStatus = require('http-status');

class AppError extends Error {
    constructor(message, status, code) {
        super();

        this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
        this.code = code || 'error';
        this.message = message || 'Internal server error';

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
