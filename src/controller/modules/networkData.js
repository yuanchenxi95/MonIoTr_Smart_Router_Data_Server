const _ = require('lodash');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const appRoot = require('app-root-path');
const adapter = new FileSync(appRoot.resolve('./db.json'));
const db = low(adapter);

async function storeLogFileData({ deviceId, date, requestType, packetArray }) {
    let logFileQuery = db.get('logFileData');
    let deviceData = await logFileQuery.get(deviceId).value();
    if (deviceData === undefined) {
        deviceData = {};
    }
    if (deviceData[date] === undefined) {
        deviceData[date] = {};
    }
    if (deviceData[date][requestType] === undefined) {
        deviceData[date][requestType] = [];
    }
    deviceData[date][requestType] = deviceData[date][requestType].concat(packetArray);

    logFileQuery.set(deviceId, deviceData)
        .write();
}

module.exports = {
    storeLogFileData,
};
