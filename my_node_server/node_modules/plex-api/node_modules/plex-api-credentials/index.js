'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var request = require('request');
var headers = require('plex-api-headers');

var rxAuthToken = /authenticationToken="([^"]+)"/;

function CredentialsAuthenticator(username, password) {
    EventEmitter.call(this);

    this.username = username;
    this.password = password;
}
util.inherits(CredentialsAuthenticator, EventEmitter);

CredentialsAuthenticator.prototype.authenticate = function authenticate(plexApi, callback) {
    if (typeof plexApi !== 'object') {
        throw new TypeError('First argument should be the plex-api object to perform authentication for');
    }
    if (typeof callback !== 'function') {
        throw new TypeError('Second argument should be a callback function to be called when authentication has finished');
    }

    var self = this;
    var options = {
        url: 'https://plex.tv/users/sign_in.xml',
        headers: headers(plexApi, {
            Authorization: authHeaderVal(this.username, this.password)
        })
    };

    request.post(options, function(err, res, xmlBody) {
        if (err) {
            return callback(new Error('Error while requesting https://plex.tv for authentication: ' + String(err)));
        }
        if (res.statusCode !== 201) {
            return callback(new Error('Invalid status code in authentication response from Plex.tv, expected 201 but got ' + res.statusCode));
        }

        var token = extractAuthToken(xmlBody);
        if (!token) {
            return callback(new Error('Couldnt not find authentication token in response from Plex.tv :('));
        }

        self.emit('token', token);
        callback(null, token);
    });
};

function extractAuthToken(xmlBody) {
    return xmlBody.match(rxAuthToken)[1];
}

function authHeaderVal(username, password) {
    var authString = username + ':' + password;
    var buffer = new Buffer(authString.toString(), 'binary');
    return 'Basic ' + buffer.toString('base64');
}

module.exports = function(options) {
    if (typeof (options) !== 'object') {
        throw new TypeError('An options object containing .username and .password is required');
    }
    if (typeof (options.username) !== 'string') {
        throw new TypeError('Options object requires a .username property as a string');
    }
    if (typeof (options.password) !== 'string') {
        throw new TypeError('Options object requires a .password property as a string');
    }
    return new CredentialsAuthenticator(options.username, options.password);
};
