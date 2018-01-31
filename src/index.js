module.exports.init = async function() {
    const dotenv = require('./tools/dotenv');
    dotenv.configureEnv();

    const logger = require('./tools/logger');
    logger.configureLog();

    const server = require('./server');
    // await server.configureDatabase();
    server.configureServer();
};
