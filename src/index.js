module.exports.init = function() {
    const { configureEnv } = require('./dotenv');
    configureEnv();

    const logger = require('./logger');
    logger.configureLog();
    const server = require('./server');
    server.configureServer();
};
