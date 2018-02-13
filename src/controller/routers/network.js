const Router = require('koa-router');
const Joi = require('joi');

const device = new Router();
const { getAggregateDataByTime } = require('../modules/network');

device.get('/:networkId/analyze/aggregateDataByTime', async (ctx, next) => {

    let logFileDataSchema = Joi.object().keys({
        forNetwork: Joi.string().required(),
        forDevice: Joi.string().required(),
        bucketSize: Joi.number.required(),
        bucketProps: Joi.array().required(),
        startMS: Joi.string().required(),
        endMS: Joi.string().required(),
    });
    const validationResult = Joi.validate(ctx.request.body, logFileDataSchema);

    if (validationResult.error !== null) {
        ctx.status = 400;
        ctx.message = validationResult.error.details[0].message;
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

    ctx.type = 'application/json';

});

module.exports = device;
