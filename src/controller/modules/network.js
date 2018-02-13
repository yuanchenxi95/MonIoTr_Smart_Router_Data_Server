const _ = require('lodash');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const appRoot = require('app-root-path');
const adapter = new FileSync(appRoot.resolve('./db.json'));
const db = low(adapter);

async function getAggregateDataByTime(deviceId) {
    let deviceData = await db.get('todayData').value();

    if (deviceData === undefined ||
        deviceData[deviceId] === undefined) {
        return [];
    }
    deviceData = deviceData[deviceId];

    deviceData = _.sortBy(deviceData, (d) => d['time_stamp']);
    let aggregateData = {};
    deviceData.forEach((d) => {
        let timestamp = _.floor(d['time_stamp']);
        if (!(timestamp in aggregateData)) {
            aggregateData[timestamp] = 0;
        }
        aggregateData[timestamp] += 1;
    });

    return aggregateData;
}

module.exports = {
    getAggregateDataByTime,
};
