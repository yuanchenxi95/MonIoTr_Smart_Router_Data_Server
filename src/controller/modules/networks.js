const _ = require('lodash');
const { db } = require( '../modules/_db.js');

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

    // shouldn't use standard eastern time
    let startDate = moment.unix(startMS).tz('America/New_York').format('YYYY-MM-DD');
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
            'timestamp': key,
        };
        processedResult.push(newObj);
    });

    return processedResult;
}

module.exports = {
    getAggregateDataByTime,
};
