const _ = require('lodash');

const { db } = require( '../modules/_db.js');

const { updateDeviceList } = require('../../model/deviceData/deviceData.model');

async function GetAggregateDeviceData(deviceId) {
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
    GetAggregateDeviceData,
    updateDeviceList,
};
