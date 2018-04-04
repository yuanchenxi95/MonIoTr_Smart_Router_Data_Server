const Router = require('koa-router');
const Joi = require('joi');
const Enum = require('higher-order-enum');

const {
    N_SECONDS_AGO_REGEX,
    processTodaysIndividualData,
    processResultMap,
    processNSecondsAgoData,
} = require('../modules/networks');

const analyze = new Router();

analyze.post('/core', async (ctx, next) => {
    let bodySchema = Joi.object().keys({
        dimensions: Joi.array().items(Joi.string()),
        metrics: Joi.array().items(Joi.string()),
        reducer: Joi.string().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
    });

    const bodyValidationResult = Joi.validate(ctx.request.body, bodySchema);

    if (bodyValidationResult.error !== null) {
        ctx.status = 400;
        ctx.message = bodyValidationResult.error.details[0].message;
        await next();
        return;
    }

    let { body } = ctx.request;
    const startTimeEnum = Enum('today');
    const endTimeEnum = Enum('now');
    const reducerEnum = Enum('individual');

    const today = startTimeEnum('today');
    const now = endTimeEnum('now');
    const individual = reducerEnum('individual');
    if (individual === reducerEnum(body.reducer)) {
        if (today === startTimeEnum(body.startTime)) {
            if (now === endTimeEnum(body.endTime)) {
                let resultMap = await processTodaysIndividualData(body.dimensions, body.metrics);
                ctx.body = processResultMap(resultMap, body.dimensions, body.metrics);
                ctx.status = 200;
                await next();
                return;
            }
        }
        if (N_SECONDS_AGO_REGEX.test(body.startTime)) {
            if (now === endTimeEnum(body.endTime)) {
                let resultMap = await processNSecondsAgoData(body.startTime, body.dimensions, body.metrics);
                ctx.status = 200;
                ctx.body = processResultMap(resultMap, body.dimensions, body.metrics);
                await next();
                return;
            }
        }
    }
    ctx.status = 404;
    await next();
});

module.exports = analyze;

