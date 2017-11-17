const dotenv = require('dotenv');
const util = require('../util');

function configureEnv() {
    dotenv.config({ path: __dirname + '/../config/env/.env' });
    checkEnvVariables();
}

function checkEnvVariables() {
    const envList = ['SSL_PASS_PHRASE', 'COOKIE_SECRET'];
    envList.forEach((envVar) => {
        if (util.checkEnvVariable(envVar, 'string') === false) {
            throw new Error(`Missing ENV variable ${envVar}. Check ./src/config/env`);
        }
    });
}


module.exports = {
    configureEnv,
};
