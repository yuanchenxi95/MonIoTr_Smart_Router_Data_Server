const mongoose = require('mongoose');

const HttpData = mongoose.Schema({
    src_ip: String,
    dst_ip: String,
    src_port: String,
    dst_port: String,
    host: { type: String },
    http_method: String,
    time_stamp: { type: Number, required: true },
    mac_address: { type: String, required: true },
}, { timestamps: {} });

HttpData.index({
    time_stamp: -1,
    mac_address: 1,
});

module.exports = {
    HttpData,
};
