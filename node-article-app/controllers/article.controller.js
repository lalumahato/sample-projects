'use strict';
const httpStatus = require('http-status');
const ArticleServices = require('../services/article.service');
const { articleSchemas } = require('../helpers/validationSchema');
const ErrorHelper = require('../helpers/error.helper');

class ArticleController {
    static async add(req, res) {
        try {
            await articleSchemas.add.validateAsync(req.body);
            let result = await ArticleServices.add(req);

            return res.status(httpStatus.CREATED).json({ data: result });
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    static async list(req, res) {
        try {
            let result = await ArticleServices.list();

            return res.json({ data: result });
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            let result = await ArticleServices.getById(req.params.id, res);
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
            await articleSchemas.update.validateAsync(req.body);
            let result = await ArticleServices.update(req, res);
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
            let result = await ArticleServices.delete(req.params.id, res);
            if (result.statusCode !== httpStatus.NOT_FOUND) {
                return res.send({ data: result });
            }
        } catch (err) {
            const error = ErrorHelper.error(err);
            return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}

module.exports = ArticleController;
