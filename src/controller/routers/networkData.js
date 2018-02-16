const Router = require('koa-router');

const Joi = require('joi');

const { storeLogFileData, getLogFileData } = require('../modules/networkData');

const { db } = require( '../modules/_db.js');


const networkData = new Router();

networkData.get('/all', async function(ctx, next) {
    ctx.body = db.get('todayData');
    ctx.type = 'application/json';
    await next();
});

networkData.get('/lastUpdate', async function(ctx, next) {
    ctx.body = db.get('todayDataLog');
    ctx.type = 'application/json';
    await next();
});

networkData.get('/live', async function(ctx, next) {
    ctx.body = await db.get('live').value();
    ctx.type = 'application/json';
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

        db.get('todayDataLog')
            .set('last_updated_time', Date.now())
            .write();

        db.get('todayData')
            .set(ctx.request.body.id, ctx.request.body.data)
            .write();
        ctx.status = 200;
        await next();
    }
);

networkData.get('/logFileData/:deviceId/:date/:requestType',
    async function(ctx, next) {
        let paramsShcema = Joi.object().keys({
            deviceId: Joi.string().required(),
            date: Joi.string().required(),
            requestType: Joi.string().required(),
        });

        const paramValidationResult = Joi.validate(ctx.params, paramsShcema);

        if (paramValidationResult.error !== null) {
            ctx.status = 400;
            ctx.message = paramValidationResult.error.details[0].message;
            await next();
            return;
        }

        let {
            deviceId,
            date,
            requestType,
        } = ctx.params;

        let logData = await getLogFileData({
            deviceId,
            date,
            requestType,
        });
        ctx.body = {
            data: logData,
        };
        ctx.status = 200;
    });

networkData.post('/logFileData/:deviceId/:date/:requestType',
    async function(ctx, next) {
        let logFileDataSchema = Joi.array().items(
            Joi.object().keys({
                src_ip: Joi.string().required(),
                dst_ip: Joi.string().required(),
                src_port: Joi.string().required(),
                dst_port: Joi.string().required(),
                host: Joi.string().required(),
                http_method: Joi.string().required(),
                time_stamp: Joi.string().required(),
            })
        );
        const validationResult = Joi.validate(ctx.request.body, logFileDataSchema);

        let paramsSchema = Joi.object().keys({
            deviceId: Joi.string().required(),
            date: Joi.string().required(),
            requestType: Joi.string().required(),
        });

        const paramValidationResult = Joi.validate(ctx.params, paramsSchema);

        if (validationResult.error !== null) {
            ctx.status = 400;
            ctx.message = validationResult.error.details[0].message;
            await next();
            return;
        }

        if (paramValidationResult.error !== null) {
            ctx.status = 400;
            ctx.message = paramValidationResult.error.details[0].message;
            await next();
            return;
        }

        let packetArray = ctx.request.body;
        let {
            deviceId,
        } = ctx.params;

        storeLogFileData({
            deviceId,
            packetArray,
        });
        ctx.status = 200;

        await next();
    });

module.exports = networkData;
