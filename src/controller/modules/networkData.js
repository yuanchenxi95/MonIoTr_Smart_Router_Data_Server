const { db } = require( '../modules/_db.js');
const httpDataMethods = require( '../../model/httpData/httpData.model');

async function storeLogFileData({ deviceId, packetArray }) {
    packetArray.forEach(async (hd) => {
        hd['mac_address'] = deviceId;
        await httpDataMethods.findOneAndUpdate(hd);
    });
}

async function getLogFileData({ deviceId, date, requestType }) {
    let logFileQuery = db.get('logFileData');
    let dateData = await logFileQuery.get(date).value();
    if (dateData === undefined) {
        return [];
    }
    if (dateData[deviceId] === undefined) {
        return [];
    }
    if (dateData[deviceId][requestType] === undefined) {
        return [];
    }
    return dateData[deviceId][requestType];
}

module.exports = {
    storeLogFileData,
    getLogFileData,
};
