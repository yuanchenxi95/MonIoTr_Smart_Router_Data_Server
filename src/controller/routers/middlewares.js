const appRoot = require('app-root-path');
const { errorLogger, infoLogger } = require(appRoot.resolve('./src/tools/logger'));

/**
 * the responder middleware
 * @param {any} ctx
 * @param {function} next
 */
async function responder(ctx, next) {
    try {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        infoLogger.info(`${ctx.method} ${ctx.url} - ${ms}`);
    } catch (e) {
        ctx.status = e.status || 500;
        ctx.body = e.message || 'Server Error';
        if (e.name !== 'Invariant Violation') {
            errorLogger.error(e);
        }
    }
}

module.exports = {
    responder,
};
