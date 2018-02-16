// unhandled Exception exit Node.js
process.on('unhandledRejection', function(error) {
    throw new Error(error);
});

require('./src/index').startServer();
