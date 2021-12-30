'use strict';
require('array.prototype.flatmap').shim();
const fs = require('fs');
const client = require('../config/elasticsearch');

module.exports = {
    add: async (req, res) => {
        try {
            await client.index({
                index: 'products',
                body: {
                    sku: req.body.sku,
                    name: req.body.name,
                    type: req.body.type,
                    price: req.body.price,
                    upc: req.body.upc,
                    category: req.body.category,
                    shipping: req.body.shipping,
                    description: req.body.description,
                    manufacturer: req.body.manufacturer,
                    model: req.body.model,
                    url: req.body.url,
                    image: req.body.image
                }
            });

            // send response
            return res.json({ message: 'Indexing successful.' });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    list: async (req, res) => {
        try {
            let from = parseInt(req.query.from) || 1;
            let size = parseInt(req.query.size) || 5;
            let { body } = await client.search({
                index: 'products',
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
    update: async (req, res) => {
        try {
            await client.update({
                index: 'products',
                id: req.params.id,
                body: {
                    doc: req.body
                }
            });

            // send response
            return res.json({ message: 'Updated indexing' });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    delete: async (req, res) => {
        try {
            await client.delete({
                index: 'products',
                id: req.params.id
            });

            // send response
            return res.json({ message: 'Deleted indexing' });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    bulkAdd: async (req, res) => {
        try {
            const products = await fs.readFileSync('./data/data.json');
            const dataset = JSON.parse(products);

            const body = dataset.flatMap(doc => [{ index: { _index: 'products' } }, doc]);

            const { body: bulkResponse } = await client.bulk({ refresh: true, body })
            if (bulkResponse.errors) {
                const erroredDocuments = [];
                bulkResponse.items.forEach((action, i) => {
                    const operation = Object.keys(action)[0];
                    if (action[operation].error) {
                        erroredDocuments.push({
                            status: action[operation].status,
                            error: action[operation].error,
                            operation: body[i * 2],
                            document: body[i * 2 + 1]
                        })
                    }
                });
                console.log(erroredDocuments);
            }

            const { body: count } = await client.count({ index: 'products' });
            // send response
            return res.json({ message: `${count.count} indexing successful.` });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    search: async (req, res) => {
        try {
            let query = {
                index: 'products'
            }

            if (req.query.product) query.q = `*${req.query.product}*`;

            let { body } = await client.search(query);

            // send response
            return res.json({ data: body });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    }
}
