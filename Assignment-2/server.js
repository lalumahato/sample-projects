'use strict';
require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerDocument = require('./swagger.json');
const logger = require('./config/winston');

/** initial app and port */
const app = express();
const PORT = process.env.PORT || 3000;

/** use cors */
app.use(cors());

/** use body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** apis logger */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/** Swaggger UI */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/** default route */
app.get('/', (req, res, next) => {
    res.send({
        status: 200,
        message: 'Welcome to the app index page.'
    });
});
app.use('/api', routes);

/** Listening server on port: 3000 */
let server = app.listen(PORT, () => {
    connectDB();
    console.log(chalk.blue(`Server listening on port:${PORT}`));
    logger.info(`Server listening on port:${PORT}`);
});

module.exports = server;
