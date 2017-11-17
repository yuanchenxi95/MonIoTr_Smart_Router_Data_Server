const _ = require('lodash');

function checkEnvVariable(variable, type) {
    const envVar = process.env[variable];
    return !_.isNil(envVar) && typeof envVar === type;
}

function checkEnvVariables(envList) {
    envList.forEach((envVar) => {
        if (checkEnvVariable(envVar, 'string') === false) {
            throw new Error(`Missing ENV variable ${envVar}. Check ./src/config/env`);
        }
    });
}

module.exports = {
    checkEnvVariables,
};
