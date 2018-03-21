const mongoose = require('mongoose');

const HttpData = mongoose.Schema({
    src_ip: String,
    dst_ip: String,
    src_port: String,
    dst_port: String,
    host: { type: String },
    http_method: String,
    time_stamp: { type: Number, index: true, required: true },
    mac_address: { type: String, index: true, required: true },
}, { timestamps: {} });

module.exports = {
    HttpData,
};
