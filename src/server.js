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
    const http = require('http');
    const compress = require('koa-compress');
    const session = require('koa-session');
    const cors = require('koa-cors');

    const { router } = require('./controller');

    const cookieSecret = process.env.COOKIE_SECRET;
    const app = new Koa();
    app.keys = [cookieSecret];

    app.use(compress());
    app.use(session({ key: cookieSecret }, app));
    app.use(cors());

    app.use(router.routes());

    let port = process.env.PORT || 3000;

    http.createServer(app.callback()).listen(port, defaultLogger.info('listen to port 3000'));
}

module.exports = {
    configureServer,
    configureDatabase,
};

