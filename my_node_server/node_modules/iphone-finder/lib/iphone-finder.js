/**
 * Simple library to locate iOS devices (iPhone, iPod and iPad)
 *
 * Author: Thomas Henley
 */
var Buffer = require('buffer').Buffer;
var https  = require('https');

module.exports.findAllDevices = function(username, password, callback) {
    // Send a request to the find my iphone service for the partition host to use
    getPartitionHost(username, password, function(err, partitionHost) {
        // Now get the devices owned by the user
        getDeviceDetails(partitionHost, username, password, callback);
    });
};

function getPartitionHost(username, password, callback) {
    postRequest('fmipmobile.icloud.com', username, password, function(err, response) {
        // Return the partition host if available
        return callback(null, response.headers['x-apple-mme-host']);
    });
};

function getDeviceDetails(partitionHost, username, password, callback) {
    postRequest(partitionHost, username, password, function(err, response) {
        var allDevices = JSON.parse(response.body).content;
        return callback(null, allDevices);
    });
}

function postRequest(host, username, password, callback) {
    var apiRequest = https.request({
        host: host,
        path: '/fmipservice/device/' + username + '/initClient',
        headers: {
            Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
        },
        method: 'POST'
    }, function(response) {
        var result = {headers: response.headers, body: ''};
        response.on('data', function(chunk) {result.body = result.body + chunk; });
        response.on('end', function() { return callback(null, result); });
    });
    apiRequest.end();
};
