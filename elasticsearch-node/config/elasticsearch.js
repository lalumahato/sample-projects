'use strict';
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'http://localhost:9200',
    log: 'trace',
    requestTimeout: 30000,
    pingTimeout: 30000
});

module.exports = client;
