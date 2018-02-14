const _ = require('lodash');

const { db } = require( '../modules/_db.js');


async function storeLogFileData({ deviceId, date, requestType, packetArray }) {
    let logFileQuery = db.get('logFileData');
    let dateData = await logFileQuery.get(date).value();
    if (dateData === undefined) {
        dateData = {};
    }
    if (dateData[deviceId] === undefined) {
        dateData[deviceId] = {};
    }
    if (dateData[deviceId][requestType] === undefined) {
        dateData[deviceId][requestType] = [];
    }
    dateData[deviceId][requestType] = dateData[deviceId][requestType].concat(packetArray);

    let liveQuery = db.get('live');
    liveQuery.set('data', packetArray)
        .write();

    let todayDataLogQuery = db.get('todayDataLog');
    todayDataLogQuery.set('today', date)
        .write();

    logFileQuery.set(date, dateData)
        .write();
}

async function getLogFileData({ deviceId, date, requestType }) {
    let logFileQuery = db.get('logFileData');
    let dateData = await logFileQuery.get(date).value();
    if (dateData === undefined) {
        return [];
    }
    if (dateData[deviceId] === undefined) {
        return [];
    }
    if (dateData[deviceId][requestType] === undefined) {
        return [];
    }
    return dateData[deviceId][requestType];
}

module.exports = {
    storeLogFileData,
    getLogFileData,
};
