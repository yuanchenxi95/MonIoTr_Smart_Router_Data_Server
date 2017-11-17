const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { responder } = require('./middlewares');
const user = require('./user');

/**
 * 这里进行区分
 * api 接口统一添加 api 前缀
 * 大家都可以访问的，什么都不加
 * 普通用户才能访问的，加 '/user' 前缀
 * 库管用户可以访问的，加 '/owner' 前缀
 * 超管用户可以访问的，加 '/admin' 前缀
 */
const router = new Router();
router.prefix('/api');
router.use(bodyParser());
router.use(responder);

router.get('/hello', async function(ctx, next) {
    ctx.body = 'Hello World';
    await next();
});

router.use('/user', user.routes());

router.use();

module.exports = router;
