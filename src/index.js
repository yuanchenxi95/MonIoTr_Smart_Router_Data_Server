module.exports.init = function() {
    const dotenv = require('dotenv');
    dotenv.config({ path: __dirname + '/config/env/.env' });

    const logger = require('./logger');
    logger.configureLog();

    const server = require('./server');
    server.configureServer();
};
