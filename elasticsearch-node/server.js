'use strict';
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');

/** initialize app and port */
const app = express();
const port = process.env.PORT || 3000;

/**protect route using helmet */
app.use(helmet());

/** set body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**set default route */
app.get('/', async (req, res) => {
    res.send({ status: 'success' });
});
app.use('/api/v1', routes);

/** listening server */
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
