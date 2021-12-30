'use strict';
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * validate user token
 */
const protect = async (req, res, next) => {
    try {
        let token = '';
        let message = 'You are not authorize to access this route.';
        // check header for authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // check token
        if (!token) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: 'failed', data: { message } });
        }

        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            let user = await User.findById(decoded._id);
            req.user = decoded;
            next();
            // if (!user) {
            //     message = 'The user belonging to this token does not exist.';
            //     res.status(httpStatus.UNAUTHORIZED).json({ status: 'failed', data: { message } });
            // } else {
            //     req.user = user;
            //     next();
            // }
        } catch (e) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: 'failed', data: { message } });
        }
    } catch (e) {
        res.status(400).json(e);
    }
}

module.exports = {
    protect
}
