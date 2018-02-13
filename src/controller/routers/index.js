const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { responder } = require('./middlewares');

const router = new Router();
router.prefix('/api');
router.use(bodyParser());
router.use(responder);

// router.get('/hello', async function(ctx, next) {
//     ctx.body = 'Hello World';
//     await next();
// });

const user = require('./user');
const networkData = require('./networkData');
const device = require('./device');
const network = require('./network');

router.use('/user', user.routes());
router.use('/networkData', networkData.routes());
router.use('/device', device.routes());
router.use('/network', network.routes());

router.use();

module.exports = router;
