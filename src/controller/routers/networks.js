const Router = require('koa-router');
const Joi = require('joi');

const device = new Router();
const { getAggregateDataByTime, getDeviceList } = require('../modules/networks');

device.post('/:networkId/analyze/aggregateDataByTime', async (ctx, next) => {
    let aggregateDataByTimeSchema = Joi.object().keys({
        selectionMode: Joi.string().required(),
        macAddresses: Joi.array().required(),
        bucketSize: Joi.number().required(),
        bucketProps: Joi.array().required(),
        startMS: Joi.string().required(),
        endMS: Joi.string().required(),
    });
    const validationResult = Joi.validate(ctx.request.body, aggregateDataByTimeSchema);

    if (validationResult.error !== null) {
        ctx.status = 400;
        ctx.message = 'Post Body Error: ' + validationResult.error.details[0].message;
        await next();
        return;
    }

    let paramsSchema = Joi.object().keys({
        networkId: Joi.string().required(),
    });

    const paramValidationResult = Joi.validate(ctx.params, paramsSchema);

    if (paramValidationResult.error !== null) {
        ctx.status = 400;
        ctx.message = paramValidationResult.error.details[0].message;
        await next();
        return;
    }
    let aggregateByTimeQuery = Object.assign({}, ctx.request.body, ctx.params);

    ctx.body = await getAggregateDataByTime(aggregateByTimeQuery);
    ctx.type = 'application/json';
    await(next);
});

device.get('/:networkId/devices', async (ctx, next) => {

    let paramsSchema = Joi.object().keys({
        networkId: Joi.string().required(),
    });

    const paramValidationResult = Joi.validate(ctx.params, paramsSchema);

    if (paramValidationResult.error !== null) {
        ctx.status = 400;
        ctx.message = paramValidationResult.error.details[0].message;
        await next();
        return;
    }

    let deviceList = await getDeviceList(ctx.params);

    ctx.body = {
        devices: deviceList,
    };
    ctx.type = 'application/json';
    await(next);
});

module.exports = device;
