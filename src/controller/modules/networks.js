const _ = require('lodash');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const appRoot = require('app-root-path');
const adapter = new FileSync(appRoot.resolve('./db.json'));
const db = low(adapter);
const moment = require('moment');

// let samplePost = {
//     'forNetwork': '34',
//     'forDevice': 'ALL_COMBINED',
//     'bucketSize': 60,
//     'bucketProps': [
//         'ACTIVITY_COUNT', 'THIRD_PARTY_COUNT', 'NON_THIRD_PARTY_COUNT'
//     ],
//     'startMS': '1518480000',
//     'endMS': '1518534800',
// };

// console.log(JSON.stringify(samplePost));


async function getAggregateDataByTime(aggregateByTimeQuery) {
    let { forNetwork,
        forDevice,
        bucketSize,
        bucketProps,
        startMS,
        endMS } = aggregateByTimeQuery;
    if (forNetwork !== '34') {
        // return [];
    }
    if (forDevice !== 'ALL_COMBINED') {
        return [];
    }
    if (!_.includes(bucketProps, 'ACTIVITY_COUNT')) {
        return [];
    }

    startMS = Number(startMS);
    endMS = Number(endMS);

    let startDate = moment.unix(startMS).format('YYYY-MM-DD');
    let logFileQuery = db.get('logFileData');
    let dateData = await logFileQuery.get(startDate).value();
    if (_.isNil(dateData)) {
        return {};
    }
    let result = {};

    _.forOwn(dateData, function(deviceData) {
        if (! _.isNil(deviceData['http'])) {
            _.forEach(deviceData['http'], (httpData) => {
                let ts = Number(httpData['time_stamp']);
                if (ts < endMS && ts > startMS) {
                    let k = Math.floor((ts - startMS) / bucketSize);

                    k = k * bucketSize + startMS;
                    if (_.isNil(result[k])) {
                        result[k] = 0;
                    }
                    result[k] += 1;
                }
            });
        }
    } );

    let processedResult = [];

    _.forOwn(result, (value, key) => {
        let newObj = {
            'ACTIVITY_COUNT': value,
            'timestampMS': key,
        };
        processedResult.push(newObj);
    });

    return processedResult;
}

module.exports = {
    getAggregateDataByTime,
};
