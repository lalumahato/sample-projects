'use strict';
const Joi = require('joi');

const userSchemas = {
    add: Joi.object().keys({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(8).required()
    }),
    update: Joi.object().keys({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(8).required()
    })
};

const articleSchemas = {
    add: Joi.object().keys({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(10).required(),
        user_id: Joi.number().integer().required()
    }),
    update: Joi.object().keys({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(10).allow(''),
        user_id: Joi.number().integer().allow('')
    })
};


module.exports = {
    userSchemas,
    articleSchemas
};
