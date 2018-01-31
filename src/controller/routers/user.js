const Router = require('koa-router');

const user = new Router();

user.get('/testUser', async function(ctx, next) {
    ctx.body = 'This is test user';
    await next();
});

module.exports = user;
