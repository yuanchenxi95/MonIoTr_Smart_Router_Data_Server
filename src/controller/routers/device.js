const Router = require('koa-router');
const Joi = require('joi');

const device = new Router();
const { GetAggregateDeviceData, updateDeviceList } = require('../modules/device');

device.get('/:deviceId/aggregateSimple', async (ctx, next) => {
    let { deviceId } = ctx.params;
    let deviceData = await GetAggregateDeviceData(deviceId);
    ctx.body = {
        data: deviceData,
    };
    ctx.type = 'application/json';
    await(next);
});

device.post('/updateDeviceList', async (ctx, next) => {
    let deviceListDataSchema = Joi.array().items(
        Joi.object().keys({
            alias: Joi.string(),
            mac_address: Joi.string(),
        })
    );
    const validationResult = Joi.validate(ctx.request.body, deviceListDataSchema);

    if (validationResult.error !== null) {
        ctx.status = 400;
        ctx.message = 'Post Body Error: ' + validationResult.error.details[0].message;
        await next();
        return;
    }

    const deviceList = ctx.request.bdoy;

    await updateDeviceList(deviceList);
    ctx.status = 200;
    await next();

});

module.exports = device;
