const Joi = require('joi');
const _ = require('lodash');

function extractHostname(url) {
    let hostname;
    // find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf('://') > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    // find & remove port number
    hostname = hostname.split(':')[0];
    // find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}


function extractRootDomain(url) {
    let domain = extractHostname(url);
    let splitArr = domain.split('.');
    let arrLen = splitArr.length;

    // extracting the root domain here
    // if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        // check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
            // this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function validateIpAddress(ipaddress) {
    const ipSchema = Joi.string().ip({
        version: [
            'ipv4',
            'ipv6',
        ],
    });

    const joiResult = Joi.validate(ipaddress, ipSchema);

    return _.isNil(joiResult.error);
}

function generateDomainKey(host) {
    if (validateIpAddress(host)) {
        return host;
    } else {
        return extractRootDomain(host);
    }
}

module.exports = {
    extractRootDomain,
    extractHostname,
    validateIpAddress,
    generateDomainKey,
};

