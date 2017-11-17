const dotenv = require('dotenv');
const { checkEnvVariables } = require('./util');

function configureEnv() {
    dotenv.config({ path: __dirname + '/../config/env/.env' });
    const envList = ['SSL_PASS_PHRASE', 'COOKIE_SECRET'];
    checkEnvVariables(envList);
}

module.exports = {
    configureEnv,
};
