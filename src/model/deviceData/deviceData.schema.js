const mongoose = require('mongoose');

const DeviceData = mongoose.Schema({
    alias: String,
    mac_address: String,
}, { timestamps: {} });

module.exports = {
    DeviceData,
};
