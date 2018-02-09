const dotenv = require('dotenv');
const appRoot = require('app-root-path');

const { checkEnvVariables } = require('./util');

function configureEnv() {
    dotenv.config({ path: appRoot.resolve('./config/env/.env') });
    const envList = [
        'MYSQL_DATABASE_NAME',
        'MYSQL_HOST',
        'MYSQL_USERNAME',
        'MYSQL_PASSWORD',
        'COOKIE_SECRET',
    ];
    checkEnvVariables(envList);
}

module.exports = {
    configureEnv,
};
