'use strict';
require('dotenv').config();
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerDocument = require('./helpers/swagger.json');

/** Initialize app and port number */
const app = express();
const port = process.env.PORT || 3000;

/**Set body parser and express json */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Swagger Ui */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**APIs logger */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'));
}

/**Default route */
app.get('/', (req, res) => {
    res.send({ message: 'Hello Article' });
});
app.use('/api/v1', routes);

/** Listening server */
let server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

module.exports = server;
