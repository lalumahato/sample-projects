'use strict';
const httpStatus = require('http-status');
const User = require('../models').User;
const Article = require('../models').Article;

let self = module.exports = {
    add: async (req) => {
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        });
        return user;
    },
    list: async () => {
        let users = await User.findAll({
            include: [{
                model: Article,
                as: 'articles',
                attributes: { exclude: ['updatedAt'] }
            }],
            order: [
                ['createdAt', 'DESC'],
                [{ model: Article, as: 'articles' }, 'createdAt', 'DESC'],
            ]
        });
        return users;
    },
    getById: async (id, res) => {
        let user = await User.findByPk(id, {
            include: [{
                model: Article,
                as: 'articles'
            }]
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: 'User Not Found'
            });
        }
        return user;
    },
    update: async (req, res) => {
        let user = await self.getById(req.params.id, res);
        if (user.statusCode !== httpStatus.NOT_FOUND) {
            await user.update({
                name: req.body.name,
                phone: req.body.phone,
                updatedAt: new Date()
            });
            return user;
        } else {
            return user;
        }
    },
    delete: async (id, res) => {
        let user = await self.getById(id, res);
        if (user.statusCode !== httpStatus.NOT_FOUND) {
            await user.destroy();
            return {};
        } else {
            return user;
        }
    }
}