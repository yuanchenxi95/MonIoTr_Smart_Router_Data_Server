const _ = require('lodash');

const httpDataMethods = require( '../../model/httpData/httpData.model');

function processDateDataArray({ dateDataArray, startMS, endMS, bucketSize }) {
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

async function getAggregateDataByTime(aggregateByTimeQuery) {
    let { networkId,
        selectionMode,
        macAddresses,
        bucketSize,
        bucketProps,
        startMS,
        endMS } = aggregateByTimeQuery;
    if (networkId !== '34') {
        // return [];
    }
    if (!_.includes(bucketProps, 'ACTIVITY_COUNT')) {
        return [];
    }

    startMS = Number(startMS);
    endMS = Number(endMS);

    // if macAddresses length is 0, replace the list with all devices
    if (macAddresses.length === 0) {
        macAddresses = await httpDataMethods.getDeviceList();
    }

    if (selectionMode === 'COMBINED') {
        let dateDataArray = await httpDataMethods.getAggregateDataByTime(startMS, endMS, macAddresses);
        let processedDataArray = processDateDataArray({
            dateDataArray,
            startMS,
            endMS,
            bucketSize,
        });
        return [{
            key: 'COMBINED',
            data: processedDataArray,
        }];
    } else if (selectionMode === 'Individual') {

    }
}

async function getDeviceList(DeviceListQuery) {
    let { forNetwork } = DeviceListQuery;
    if (forNetwork !== '34') {
        // return [];
    }
    let deviceList = await httpDataMethods.getDeviceList();
    deviceList = _.sortBy(deviceList);
    deviceList = _.map(deviceList, (macAddress) => {
        return {
            macAddr: macAddress,
        };
    });
    return deviceList;
}

module.exports = {
    getAggregateDataByTime,
    getDeviceList,
};
