const _ = require('lodash');

module.exports.checkEnvVariable = function(variable, type) {
    const envVar = process.env[variable];
    return !_.isNil(envVar) && typeof envVar === 'string';
};
