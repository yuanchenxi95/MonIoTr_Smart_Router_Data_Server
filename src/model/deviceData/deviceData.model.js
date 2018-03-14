const mongoose = require('mongoose');

const { DeviceData } = require('./deviceData.schema');

const HttpDataModel = mongoose.model('DeviceData', DeviceData);


async function findOneAndUpdate(deviceData) {
    return HttpDataModel.findOneAndUpdate(deviceData, deviceData, {
        upsert: true,
    });
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
};
