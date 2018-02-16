const dotenv = require('dotenv');
const appRoot = require('app-root-path');

const { checkEnvVariables } = require('./util');

function configureEnv() {
    dotenv.config({ path: appRoot.resolve('./config/env/.env') });
    const envList = [
        'COOKIE_SECRET',
        'MONGO_DB_ADDRESS',
    ];
    checkEnvVariables(envList);
}

module.exports = {
    configureEnv,
};
