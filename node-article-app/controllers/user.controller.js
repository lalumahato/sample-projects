'use strict';
const httpStatus = require('http-status');
const UserServices = require('../services/user.service');
const { userSchemas } = require('../helpers/validationSchema');
const ErrorHelper = require('../helpers/error.helper');

class UserController {
    static async add(req, res) {
        try {
            await userSchemas.add.validateAsync(req.body);
            let result = await UserServices.add(req);

            return res.status(httpStatus.CREATED).json({ data: result });
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async list(req, res) {
        try {
            let result = await UserServices.list();

            return res.json({ data: result });
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            let result = await UserServices.getById(req.params.id, res);
            if (result.statusCode !== httpStatus.NOT_FOUND) {
                return res.send({ data: result });
            }
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            await userSchemas.update.validateAsync(req.body);
            let result = await UserServices.update(req, res);
            if (result.statusCode !== httpStatus.NOT_FOUND) {
                return res.send({ data: result });
            }
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            let result = await UserServices.delete(req.params.id, res);
            if (result.statusCode !== httpStatus.NOT_FOUND) {
                return res.send({ data: result });
            }
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}

module.exports = UserController;

