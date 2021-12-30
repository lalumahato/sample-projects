'use strict';
const httpStatus = require('http-status');
const AppError = require('./appError.helper');

class ErrorHelper {
    static error(error) {
        if (error.isJoi === true) {
            return new AppError(error.details[0].message, httpStatus.UNPROCESSABLE_ENTITY);
        } else {
            return new AppError(error.message);
        }
    }
}

module.exports = ErrorHelper;
