const _ = require('lodash');

const httpDataMethods = require( '../../model/httpData/httpData.model');

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
    let dateDataArray = await httpDataMethods.getAggregateDataByTime(startMS, endMS);
    // if (_.isNil(dateData)) {
    //     return {};
    // }
    let result = {};

    dateDataArray.forEach((httpData) => {
        let ts = httpData['time_stamp'];
        if (ts < endMS && ts > startMS) {
            let k = Math.floor((ts - startMS) / bucketSize);

            k = k * bucketSize + startMS;
            if (_.isNil(result[k])) {
                result[k] = 0;
            }
            result[k] += 1;
        }
    });
    let processedResult = [];

    _.forOwn(result, (value, key) => {
        let newObj = {
            'ACTIVITY_COUNT': value,
            'timestamp': key,
        };
        processedResult.push(newObj);
    });

    _.sortBy(processedResult, (hd) => {
        return hd['timestamp'];
    });

    return processedResult;
}

module.exports = {
    getAggregateDataByTime,
};
