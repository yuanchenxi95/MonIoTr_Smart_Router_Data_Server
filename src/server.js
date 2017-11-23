const appRoot = require('app-root-path');
const { defaultLogger } = require(appRoot.resolve('./src/tools/logger'));

/**
 * Configure Mongo Database
 */
async function configureDatabase() {
    const mongoose = require('mongoose');

    mongoose.Promise = global.Promise;
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/monitor';
    try {
        await mongoose.connect(mongoURI, { useMongoClient: true });
        defaultLogger.info(`successfully connect to mongodb: ${mongoURI}`);
    } catch (e) {
        throw e;
    }
}

/**
 * Configure server
 */
function configureServer() {
    const Koa = require('koa');
    const https = require('https');
    const http = require('http');
    const fs = require('fs');
    const compress = require('koa-compress');
    const session = require('koa-session');
    const appRoot = require('app-root-path');

    const { router } = require('./controller');

    const cookieSecret = process.env.COOKIE_SECRET;
    const sslPassPhrase = process.env.SSL_PASS_PHRASE;
    const app = new Koa();
    app.keys = [cookieSecret];

    app.use(compress());
    app.use(session({ key: cookieSecret }, app));

    // redirect http to https
    app.use(async (ctx, next) => {
        const { request, response } = ctx;
        if (!request.secure) {
            return response.redirect(['https://', request.get('Host'), request.url].join(''));
        }
        next();
    });

    const options = {
        key: fs.readFileSync(appRoot.resolve('./config/ssl/key.pem')),
        cert: fs.readFileSync(appRoot.resolve('./config/ssl/cert.pem')),
        passphrase: sslPassPhrase,
    };

    app.use(router.routes());

    https.createServer(options, app.callback()).listen(443, () => defaultLogger.info('listen to port 443'));
    http.createServer(app.callback()).listen(80, defaultLogger.info('listen to port 80'));
}

module.exports = {
    configureServer,
    configureDatabase,
};

