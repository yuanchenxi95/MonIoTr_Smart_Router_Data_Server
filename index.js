// unhandled Exception exit Node.js
process.on('unhandledRejection', function(error) {
    throw error;
});

require('./src/index').startServer();
