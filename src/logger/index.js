const config = require('./config');
const log4js = require('log4js');

/**
 * configure log using log4js.
 */
function configureLog() {
    log4js.configure(config);
}

/**
 * get error logger
 * @return {Logger}
 */
const errorLogger = log4js.getLogger('error');

module.exports = {
    configureLog,
    errorLogger,
};
