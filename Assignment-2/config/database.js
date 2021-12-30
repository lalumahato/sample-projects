'use strict';
const mongoose = require('mongoose');
const chalk = require('chalk');
const logger = require('./winston');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: 1,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        logger.info('Database connected successfully.');
        console.log(chalk.blue(`Database connected to: ${conn.connection.host}`));
    } catch (e) {
        console.log(e);
        logger.error(`Database connection error: ${e.message}`);
        process.exit(-1);
    }
}

module.exports = connectDB;
