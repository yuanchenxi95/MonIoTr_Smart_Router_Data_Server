const Router = require('koa-router');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const appRoot = require('app-root-path');
const Joi = require('joi');

const adapter = new FileSync(appRoot.resolve('./db.json'));
const db = low(adapter);

const networkData = new Router();

networkData.get('/all', async function(ctx, next) {
    ctx.body = db.get('todayData');
    ctx.type = 'application/javascript';
    await next();
});

const todayDataSchema = Joi.object().keys({
    id: Joi.string().required(),
    data: Joi.array().required(),
});

networkData.post('/todayData',
    async function(ctx, next) {
        const validationResult = Joi.validate(ctx.request.body, todayDataSchema);

        if (validationResult.error !== null) {
            ctx.status = 400;
            await next();
            return;
        }

        db.get('todayData')
            .set(ctx.request.body.id, ctx.request.body.data)
            .write();
        ctx.status = 200;
        await next();
    }
);

module.exports = networkData;
