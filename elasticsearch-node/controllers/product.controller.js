'use strict';
require('array.prototype.flatmap').shim();
const fs = require('fs');
const client = require('../config/elasticsearch');
const product = require('../models/product.json');

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
                        properties: product
                    }
                }
            }, { ignore: [400] });

            // send response
            return res.json({ message: 'Index created successfully.' });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    add: async (req, res) => {
        try {
            const products = await fs.readFileSync('./data/csvjson.json');
            const dataset = JSON.parse(products);

            const body = dataset.flatMap(doc => [{ index: { _index: 'ecommerce_data' } }, doc]);

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

            const { body: count } = await client.count({ index: 'ecommerce_data' });
            // send response
            return res.json({ message: `${count.count} indexing successful.` });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    list: async (req, res) => {
        try {
            let from = parseInt(req.query.from) || 1;
            let size = parseInt(req.query.size) || 5;
            let { body } = await client.search({
                index: 'ecommerce_data',
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
    transactionsByMonth: async (req, res) => {
        try {
            let data = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        transactions_by_month: {
                            date_histogram: {
                                field: "InvoiceDate",
                                calendar_interval: "1M",
                                order: {
                                    _key: "asc"
                                }
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: data.body.aggregations });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    listDailyRevenue: async (req, res) => {
        try {
            let data = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        transactions_per_day: {
                            date_histogram: {
                                field: "InvoiceDate",
                                calendar_interval: "day"
                            },
                            aggs: {
                                daily_revenue: {
                                    sum: {
                                        script: {
                                            source: "doc['UnitPrice'].value * doc['Quantity'].value"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: data.body.aggregations });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    invoiceStats: async (req, res) => {
        try {
            let { body } = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        all_stats_unit_price: {
                            stats: {
                                field: "UnitPrice"
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: body.aggregations });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    uniqueCustomers: async (req, res) => {
        try {
            let { body } = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        number_unique_customers: {
                            cardinality: {
                                field: "CustomerID"
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: body.aggregations });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    invoiceHistogram: async (req, res) => {
        try {
            let { body } = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        transactions_per_price_interval: {
                            histogram: {
                                field: "UnitPrice",
                                interval: 10
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: body.aggregations });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    dailyRevenue: async (req, res) => {
        try {
            let { body } = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        transactions_per_day: {
                            date_histogram: {
                                field: "InvoiceDate",
                                calendar_interval: "day"
                            },
                            aggs: {
                                daily_revenue: {
                                    sum: {
                                        script: {
                                            source: "doc['UnitPrice'].value * doc['Quantity'].value"
                                        }
                                    }
                                },
                                number_of_unique_customers_per_day: {
                                    cardinality: {
                                        field: "CustomerID"
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: body.aggregations });
        } catch (err) {
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    },
    test: async (req, res) => {
        try {
            let data = await client.search({
                index: 'ecommerce_data',
                size: 0,
                body: {
                    aggs: {
                        transactions_by_month: {
                            date_histogram: {
                                field: "InvoiceDate",
                                calendar_interval: "1M",
                                order: {
                                    _key: "asc"
                                }
                            }
                        }
                    }
                }
            });

            // send response
            return res.json({ data: data.body.aggregations });
        } catch (err) {
            console.log(err.body);
            return res.status(err.statusCode).json({ error: err.body.result });
        }
    }
}