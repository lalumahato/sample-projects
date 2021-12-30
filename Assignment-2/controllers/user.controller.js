'use strict';
const User = require('../models/user.model');
const logger = require('../config/winston');

/**
 * delete user details
 */
const deleteUser = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const userId = req.params.userId;
        let message = 'User deleted successfully.';

        // delete user
        let user = await User.findByIdAndDelete(userId);
        logger.info(`User '${user.email}' details deleted by '${loggedInUser.email}'`)


        // send response
        return res.json({ status: 'success', data: { message } });
    } catch (ex) {
        res.status(400).json(ex.message);
    }
}

/**
 * update user details
 */
const updateUser = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const userId = req.params.userId;

        // save updated details
        let user = await User.findByIdAndUpdate(userId, {
            name: req.body.name,
            phone: req.body.phone
        }, { new: true });
        logger.info(`User '${user.email}' details updated by '${loggedInUser.email}'`)

        // send response
        return res.json({ status: 'success', data: user });
    } catch (ex) {
        res.status(400).json(ex.message);
    }
}

/**
 * list all users list
 */
const listUsers = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        // find users
        let users = await User.find({});
        logger.info(`List all users by ${loggedInUser.email}`);


        // send response
        return res.json({ status: 'success', data: users });
    } catch (ex) {
        res.status(400).json(ex.message);
    }
}

/**
 * find user by userId
 */
const findUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // find user
        let user = await User.findById(userId);
        logger.info(`User details viewed by ${user.email}`);

        // send response
        return res.json({ status: 'success', data: user });
    } catch (ex) {
        res.status(400).json(ex.message);
    }
}

/**
 * User by userId
 */
const userById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // find user
        let user = await User.findById(userId);
        if (!user) {
            logger.error(`User '${userId}' not found`);
            let message = `User not found with userId: ${userId}`;
            return res.status(400).json({ status: 'failed', data: { message } });
        }
        next();
    } catch (ex) {
        res.status(400).json(ex.message);
    }
}

module.exports = {
    listUsers,
    findUser,
    userById,
    updateUser,
    deleteUser
}
