const mongoose = require('mongoose');
const _ = require('lodash');

const { DeviceData } = require('./deviceData.schema');

const HttpDataModel = mongoose.model('DeviceData', DeviceData);


async function findOneAndUpdate(deviceData) {
    return HttpDataModel.findOneAndUpdate(deviceData, deviceData, {
        upsert: true,
    });
}

async function updateDeviceList(deviceList) {
    let updateDevicePromiseList = _.map(deviceList, (d) => {
        return findOneAndUpdate(d);
    });
    return Promise.all(updateDevicePromiseList);
}

//
// const _ = require('lodash');
// _.forEach(a, (obj) => {
//     findOneAndUpdate(obj);
// });

async function getAllDevices() {
    return await HttpDataModel.find({});
}

module.exports = {
    findOneAndUpdate,
    getAllDevices,
    updateDeviceList,
};
