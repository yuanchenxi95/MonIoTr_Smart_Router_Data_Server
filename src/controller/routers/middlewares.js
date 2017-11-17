const { errorLogger } = require('../../logger');

/**
 * the responder middleware
 * @param {any} ctx
 * @param {function} next
 */
async function responder(ctx, next) {
    try {
        await next();
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
