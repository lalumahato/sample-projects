'use strict';
const User = require('../models/user.model');
const { matchPassword } = require('../helpers/password.helper');
const logger = require('../config/winston');

/**
 * Login user 
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let message = 'Inavlid email and password';
        // match email
        let user = await User.findOne({ email }).select('+password');
        if (!user) {
            logger.error('Login faiiled due to invalid credentials');
            return res.status(401).json({ status: 'failed', data: { message } });
        }

        // match password
        let isMatched = await matchPassword(password, user.password);
        if (!isMatched) {
            logger.error('Login faiiled due to invalid credentials');
            return res.status(401).json({ status: 'failed', data: { message } });
        }
        user.password = undefined;

        // generate token
        let token = user.generateToken();
        logger.info(`Login success - Email: ${email}`);

        // send response
        return res.json({ status: 'success', data: user, token });
    } catch (ex) {
        res.status(400).json(ex);
    }
}

/**
 * Register new user
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // save user details
        let user = await User.create({
            name,
            email,
            phone,
            password
        });

        user.password = undefined;
        logger.info(`Registered new user with email: ${email}`);

        // send response
        return res.status(201).json({ status: 'success', data: user });
    } catch (ex) {
        res.status(400).json(ex);
    }
}

module.exports = {
    registerUser,
    loginUser
}
