const appRoot = require('app-root-path');
const { defaultLogger } = require(appRoot.resolve('./src/tools/logger'));
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE_NAME,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
        // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
        operatorsAliases: false,
    });

sequelize.authenticate()
    .then(
        () => {
            defaultLogger.info('Connection has been established successfully.');
        }
    )
    .catch(
        (err) => {
            defaultLogger.error('Unable to connect to the database:', err);
            throw err;
        }
    );


module.exports = {
    sequelize,
    Sequelize,
};
