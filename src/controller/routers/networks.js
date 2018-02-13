const Router = require('koa-router');
const Joi = require('joi');

const device = new Router();
const { getAggregateDataByTime } = require('../modules/networks');

device.post('/:networkId/analyze/aggregateDataByTime', async (ctx, next) => {
    let aggregateDataByTimeSchema = Joi.object().keys({
        forNetwork: Joi.number().required(),
        forDevice: Joi.string().required(),
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

    let aggregateDataByTime = await getAggregateDataByTime(ctx.request.body);
    ctx.body = {
        data: aggregateDataByTime,
    };
    ctx.type = 'application/json';
    await(next);
});

module.exports = device;
