async function initDB() {
    const mongoose = require('mongoose');
    const { errorLogger, defaultLogger } = require('./tools/logger');

    const mongoDB = process.env.MONGO_DB_ADDRESS;
    mongoose.connect(mongoDB);
    mongoose.Promise = global.Promise;
    const connection = mongoose.connection;
    connection.on('open', function() {
        defaultLogger.info('MongoDB connected');
    });
    connection.on('error', (e) => {
        errorLogger.error('MongoDB connection error:');
    });
}

module.exports = {
    initDB,
};

