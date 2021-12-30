'use strict';
const httpStatus = require('http-status');
const User = require('../models').User;
const Article = require('../models').Article;

let self = module.exports = {
    add: async (req) => {
        let article = await Article.create({
            user_id: parseInt(req.body.user_id),
            title: req.body.title,
            description: req.body.description,
        });
        return article;
    },
    list: async () => {
        let article = await Article.findAll({
            include: [{
                model: User,
                as: 'users',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        return article;
    },
    getById: async (id, res) => {
        let article = await Article.findByPk(id, {
            include: [{
                model: User,
                as: 'users'
            }]
        });

        if (!article) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: 'Article Not Found'
            });
        }
        return article;
    },
    update: async (req, res) => {
        let article = await self.getById(req.params.id, res);
        if (article.statusCode !== httpStatus.NOT_FOUND) {
            await article.update({
                title: req.body.title,
                description: req.body.description || article.description,
                user_id: parseInt(req.body.user_id) || article.user_id,
                updatedAt: new Date()
            });
            return article;
        } else {
            return article;
        }
    },
    delete: async (id, res) => {
        let article = await self.getById(id, res);
        if (article.statusCode !== httpStatus.NOT_FOUND) {
            await article.destroy();
            return {};
        } else {
            return article;
        }
    }
}