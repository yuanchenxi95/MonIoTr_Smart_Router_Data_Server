const _ = require('lodash');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const appRoot = require('app-root-path');
const adapter = new FileSync(appRoot.resolve('./db.json'));
const db = low(adapter);

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

    logFileQuery.set(data, dateData)
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
