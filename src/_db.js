async function initDB() {
    const mongoose = require('mongoose');
    const { errorLogger, defaultLogger } = require('./tools/logger');

    const mongoDB = process.env.MONGO_DB_ADDRESS;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoDB)
        .then(
            () => {
                defaultLogger.info('MongoDB connected');
            },
            (err) => {
                errorLogger.error('MongoDB connection error:');
            }
        );
}

module.exports = {
    initDB,
};

