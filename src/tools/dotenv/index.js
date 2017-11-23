const dotenv = require('dotenv');
const appRoot = require('app-root-path');

const { checkEnvVariables } = require('./util');

function configureEnv() {
    dotenv.config({ path: appRoot.resolve('./config/env/.env') });
    const envList = ['SSL_PASS_PHRASE', 'COOKIE_SECRET'];
    checkEnvVariables(envList);
}

module.exports = {
    configureEnv,
};
