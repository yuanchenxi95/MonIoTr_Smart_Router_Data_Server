const Koa = require('koa');
const https = require('https');
const http = require('http');
const fs = require('fs');
const compress = require('koa-compress');
const session = require('koa-session');
const { router } = require('./controller');

/**
 * Configure server
 */
function configureServer() {
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
        key: fs.readFileSync(__dirname + '/config/ssl/key.pem'),
        cert: fs.readFileSync(__dirname + '/config/ssl/cert.pem'),
        passphrase: sslPassPhrase,
    };

    app.use(router.routes());

    https.createServer(options, app.callback()).listen(443);
    http.createServer(app.callback()).listen(80);
}

module.exports = {
    configureServer,
};

