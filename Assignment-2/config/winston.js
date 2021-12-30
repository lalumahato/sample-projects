'use strict';
const winston = require('winston');
require('winston-daily-rotate-file');

/** logger levels */
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
}

/** create logger file on daily basis */
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/log-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

/** create logger */
const logger = winston.createLogger({
    level: 'info',
    levels,
    transports: [
        transport
    ],
    exitOnError: false
});


/**
 * If we're not in production then log to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger;
