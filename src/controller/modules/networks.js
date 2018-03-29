const _ = require('lodash');

const httpDataMethods = require( '../../model/httpData/httpData.model');
const deviceDataMethods = require('../../model/deviceData/deviceData.model');
const { getStartOfToday, getNow } = require('../util');
const { generateDomainKey } = require('../util/domain');

function processDateDataArray({ dateDataArray, numberStartMS, numberEndMS, bucketSize }) {
    let result = {};
    if (_.isNil(dateDataArray)) {
        throw Error('dateDataArray is undefined');
    }
    dateDataArray.forEach((httpData) => {
        let ts = httpData['time_stamp'];
        if (ts < numberEndMS && ts > numberStartMS) {
            let k = Math.floor((ts - numberEndMS) / bucketSize);

            k = k * bucketSize + numberEndMS;
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

    let numberStartMS = Number(startMS);
    let numberEndMS = Number(endMS);

    // if macAddresses length is 0, replace the list with all devices
    if (macAddresses.length === 0) {
        macAddresses = await httpDataMethods.getDeviceList();
    }
    let dateDataArray = await httpDataMethods.getAggregateDataByTime(numberStartMS, numberEndMS, macAddresses);

    if (selectionMode === 'COMBINED') {
        let processedDataArray = processDateDataArray({
            dateDataArray,
            numberStartMS,
            numberEndMS,
            bucketSize,
        });
        return [{
            key: 'COMBINED',
            data: processedDataArray,
        }];
    } else if (selectionMode === 'individual') {
        let resultObj = {};
        _.forEach(macAddresses, (macAddress) => {
            resultObj[macAddress] = [];
        });
        _.forEach(dateDataArray, (data) => {
            resultObj[data['mac_address']].push(data);
        });
        let resultArray = [];
        _.forEach(resultObj, (dataArray, macAddress) => {
            resultArray.push({
                key: macAddress,
                data: processDateDataArray({
                    dateDataArray: dataArray,
                    numberStartMS,
                    numberEndMS,
                    bucketSize,
                }),
            });
        });

        return resultArray;
    }
}

async function getDeviceList(DeviceListQuery) {
    let { forNetwork } = DeviceListQuery;
    if (forNetwork !== '34') {
        // return [];
    }
    let deviceMacList = await httpDataMethods.getDeviceList();
    let deviceMappingList = await deviceDataMethods.getAllDevices();

    // if the device's name is not in the database, return unidentified.
    deviceMacList = _.sortBy(deviceMacList);
    let deviceList = _.map(deviceMacList, (macAddress) => {
        let mapping = _.find(deviceMappingList, (obj) => {
            return obj.mac_address.toLowerCase() === macAddress.toLowerCase();
        });
        if (_.isNil(mapping)) {
            return {
                macAddress: macAddress,
            };
        } else {
            return {
                uuid: mapping._id,
                alias: mapping.alias,
                macAddress: mapping.mac_address,
            };
        }
    });
    return deviceList;
}

async function processTodaysIndividualData(dimensions, metrics) {
    let numberStartMS = getStartOfToday();
    let numberEndMS = getNow();
    if (_.indexOf(dimensions, 'macAddress') >= 0) {
        if (_.indexOf(metrics, 'hit') >= 0) {
            let macAddresses = await httpDataMethods.getDeviceList();
            let dataAggregateMap = {};
            let queryDataByTimePromiseList = _.map(macAddresses, (mac) => {
                let f = async function() {
                    dataAggregateMap[mac] =
                        await httpDataMethods.getAggregateDataByTime(numberStartMS, numberEndMS, [mac]);
                };

                return f();
            });

            await Promise.all(queryDataByTimePromiseList);
            let resultMap = {};
            _.forOwn(dataAggregateMap, function(value, key) {
                resultMap[key] = value.length;
            });
            return resultMap;
        }
    } else if (_.indexOf(dimensions, 'domain') >= 0) {
        if (_.indexOf(metrics, 'hit') >= 0) {
            let hostCountMap = await httpDataMethods.getHostCountMap(numberStartMS, numberEndMS);
            let resultMap = {};

            _.forEach(hostCountMap, (hostCount) => {
                let domainKey = generateDomainKey(hostCount['_id']);
                let value = resultMap[domainKey];

                if (!value) {
                    resultMap[domainKey] = 0;
                }
                resultMap[domainKey] += hostCount['count'];

                // resultMap[hostCount['_id']] = hostCount['count'];
            });
            return resultMap;
        }
    }
}

processTodaysIndividualData(['domain'], ['hit']);

function processResultMap(resultMap, dimensions, metrics) {
    let result = {
        report: {},
    };
    let report = result['report'];
    report['columns'] = {
        'dimensions': dimensions,
        'metrics': metrics,
    };
    report['data'] = {};
    report['data']['rows'] = [];
    let rows = report['data']['rows'];

    _.forOwn(resultMap, function(value, key) {
        rows.push({
            'dimensions': [key],
            'metrics': [value],
        });
    });

    return result;
}

module.exports = {
    getAggregateDataByTime,
    getDeviceList,
    processTodaysIndividualData,
    processResultMap,
};
