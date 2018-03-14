const mongoose = require('mongoose');

const { DeviceData } = require('./deviceData.schema');

const HttpDataModel = mongoose.model('DeviceData', DeviceData);


async function findOneAndUpdate(deviceData) {
    return HttpDataModel.findOneAndUpdate(deviceData, deviceData, {
        upsert: true,
    });
}

async function getAllDevices() {
    return await HttpDataModel.find({});
}

module.exports = {
    findOneAndUpdate,
    getAllDevices,
};
