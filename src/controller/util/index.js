const moment = require('moment');

function getStartOfToday() {
    const now = moment();
    now.millisecond(0);
    now.second(0);
    now.minute(0);
    now.hour(0);

    return now.unix();
}

function getNow() {
    return moment().unix();
}

module.exports = {
    getStartOfToday,
    getNow,
};
