const mongoose = require('mongoose');

const { HttpData } = require('./httpData.schema');

const HttpDataModel = mongoose.model('HttpData', HttpData);


// function getMongooseModel() {
//     return Job;
// }

async function findOneAndUpdate(httpData) {
    return HttpDataModel.findOneAndUpdate(httpData, httpData, {
        upsert: true,
    });
}

// function findJobById(jobId) {
//     return Job.findOne({_id: jobId});
// }
//
// function findJobsByJobName(jobName) {
//     return Job.find({name: jobName});
// }
//
// function findJobsByPriceRange(min, max) {
//     return Job.find({price: {$lte:10, $gte:100}});
// }
//
// function updateJob(jobId, job) {
//     delete job._id;
//
//     return Job.findOneAndUpdate({_id: jobId}, job);
// }
//
// function deleteJob(jobId) {
//     return Job.remove({_id: jobId});
// }
//
// function searchJob(jobName) {
//     var searchTerm = jobName;
//     return Job.find({"name":new RegExp(searchTerm, 'i')});
// }
//
// function findJobsByEmployeeId(employeeId) {
//     return Job.find({_employeeUser: employeeId});
// }
//
// function findJobsByEmployerId(employerId) {
//     return Job.find({_employerUser: employerId});
// }
//
// function findJobsByRequestedUserId(reqUserId) {
//     return Job.find({_requestedUsers: reqUserId});
// }

module.exports = {
    findOneAndUpdate,
};