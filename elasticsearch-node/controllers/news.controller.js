'use strict';
require('array.prototype.flatmap').shim();
const fs = require('fs');
const client = require('../config/elasticsearch');
const news = require('../models/news.json');

module.exports = {
    create: async (req, res) => {
        try {
            const title = req.body.title;
            /** validate existing index */
            let { body: indices } = await client.cat.indices({ format: 'json' });

            let index = indices.filter(i => i.index === title)[0];
            if (index) {
                return res.status(400).json({ message: 'Index already created.' });
            }

            /**create new index */
            await client.indices.create({
                index: title,
                body: {
                    mappings: {
                        properties: news
                    }
                }
            }, { ignore: [400] });

            // send response
            return res.json({ message: 'Index created successfully.' });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    list: async (req, res) => {
        try {
            let from = parseInt(req.query.from) || 1;
            let size = parseInt(req.query.size) || 5;
            let { body } = await client.search({
                index: 'news_data',
                from: from,
                size: size,
                sort: {
                    id: {
                        order: 'desc'
                    }
                },
                body: {
                    query: {
                        match_all: {}
                    }
                }
            });
            let data = body.hits.hits;

            // send response
            return res.json({ data });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    searchText: async (req, res) => {
        try {
            let text = req.query.text;
            let data = await client.search({
                index: 'news_data',
                body: {
                    query: {
                        multi_match: {
                            query: text,
                            fields: [
                                "headline",
                                "short_description",
                                "authors"
                            ]
                        }
                    }
                }
            });

            // send response
            return res.json({ data: data.body.hits });
        } catch (err) {
            console.log(err.body);
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    newBetweenDates: async (req, res) => {
        try {
            let startDate = req.query.startDate || new Date().toISOString().slice(0, 10);
            let endDate = req.query.endStart || new Date().toISOString().slice(0, 10);
            let { body } = await client.search({
                index: 'news_data',
                body: {
                    query: {
                        range: {
                            date: {
                                gte: startDate,
                                lte: endDate
                            }
                        }
                    }

                }
            });

            // send response
            return res.json({ data: body });
        } catch (err) {
            console.log(err);
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    matchText: async (req, res) => {
        try {
            let text = req.query.text;
            let { body } = await client.search({
                index: 'news_data',
                body: {
                    query: {
                        match_phrase: {
                            headline: {
                                query: text
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: body });
        } catch (err) {
            console.log(err);
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    }
}
