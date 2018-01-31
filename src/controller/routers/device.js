const Router = require('koa-router');

const device = new Router();
const { GetAggregateDeviceData } = require('../modules/device');

device.get('/:deviceId/aggregateSimple', async (ctx, next) => {
    let { deviceId } = ctx.params;
    let deviceData = await GetAggregateDeviceData(deviceId);
    ctx.body = {
        data: deviceData,
    };
    ctx.type = 'application/json';

});

module.exports = device;
