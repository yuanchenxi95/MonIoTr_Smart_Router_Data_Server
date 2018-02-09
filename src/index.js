const dotenv = require('./tools/dotenv');
dotenv.configureEnv();

const logger = require('./tools/logger');
logger.configureLog();

const { defaultLogger } = require('./tools/logger');

const { sequelize, Sequelize } = require('./_db');


const Koa = require('koa');
const http = require('http');
const compress = require('koa-compress');
const session = require('koa-session');
const cors = require('koa2-cors');

const { router } = require('./controller');

const cookieSecret = process.env.COOKIE_SECRET;
const app = new Koa();
app.keys = [cookieSecret];

app.use(compress());
app.use(session({ key: cookieSecret }, app));
app.use(cors());

app.use(router.routes());

let port = process.env.PORT || 3000;

http.createServer(app.callback()).listen(port, defaultLogger.info('listen to port 3000'));