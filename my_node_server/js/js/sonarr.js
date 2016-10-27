var http = require('http');
var bodyParser = require('body-parser');
var config = require('../config');
var request = require('request');

var options = {
    host: config.sonarr.ip,
    port: config.sonarr.port,
    headers: {
        'X-Api-Key' : config.sonarr.apikey,
        'Accept': 'application/json',
    },
}

module.exports = {

    search : function(title, ResponseCallback) {

        request({
            url: 'http://' + options.host + ':' + options.port + encodeURI('/api/series/lookup?term=' + title), //URL to hit
            //qs: {from: 'blog example', time: +new Date()}, //Query string data
            method: 'GET', 
            headers: { 
                'X-Api-Key' : config.sonarr.apikey,
                'Accept': 'application/json',
            }
            //json: {
            //    field1: 'data',
            //    field2: 'data'
            //}
            //body : 'data';
        }, function(error, response, body){
            if(error) {
                console.log(error);
                ResponseCallback('error');
            } 

            else {
                bodyparsed = JSON.parse(body);
                list = [];
                console.log(list[0]);
                var limit = bodyparsed.length;

                //setting limit to how much is returned.
                if (bodyparsed.length > 8) {
                    limit = 8;
                }

                for(i = 0; i < limit; i++) {
                    list.push({ 'title' : bodyparsed[i].title, 
                                'year' : bodyparsed[i].year, 
                                'network' : bodyparsed[i].network,
                                'airtime' : bodyparsed[i].airTime, 
                                'tvdbId' : bodyparsed[i].tvdbId,
                                'titleSlug' : bodyparsed[i].titleSlug,
                                'seasons' : bodyparsed[i].seasons,
                                'tvRageId' : bodyparsed[i].tvRageId,
                                'images' : bodyparsed[i].images,
                                });
                };

                ResponseCallback(list);
                console.log(response.statusCode, list);
            }
        });
    },

    search2 : function(title, ResponseCallback) {
        options.path = encodeURI('/api/series/lookup?term='+title);
        options.method = 'GET';
        console.log(options.path);

        console.log("Searching Sonarr for show: " + title);
        console.log(options);
        var body = "";

        var req = http.request(options, function(res){    
            res.setEncoding('utf8');
            console.log("HTTP Request sent to couchpotato");

            res.on("data", function (chunk) {
                body += chunk;
            });

            res.on('timeout', function() {
                console.log('timeout');
                req.abort();
            })

            res.on("end", function () {
                console.log(body);
                responseobject = JSON.parse(body);
                ResponseCallback(responseobject);
            })
        });

        req.on('error', function (e) {
            console.log(e);
        });

        req.setTimeout(5000);
        req.end();

    },

    listshows : function(show, ResponseCallback) {
        options.path = '/api/series';
        options.method = 'GET';
 
        console.log("Searching Sonarr current shows for tvdbId: " + show.tvdbId);
        console.log(options);
        var body = "";

        var x = http.request(options, function(response){    
            response.setEncoding('utf8');
            response.on("data", function (chunk) {
                body += chunk;
            });

            response.on("end", function () {
                responseobject = JSON.parse(body);

                //find show in the list of shows.
                var arrayFound = responseobject.filter(function(item) {
                    return item.tvdbId == show.tvdbId;
                });

                if (arrayFound.length > 0) {
                    console.log('Show exist');
                    ResponseCallback('exist');
                }
                else {
                    console.log('Show can be added');
                    ResponseCallback('ok');
                }
            })
        });

        x.end();
    },

    //adds show to Sonarr. will require tvdbId, title, qualityProfileId, titleSlug and rootFolderpath to add show
    addshow : function(show, ResponseCallback) {

        console.log()

        request({
            url: 'http://' + options.host + ':' + options.port + encodeURI('/api/series'), //URL to hit
            qs: {tvdbId: 'blog example', time: +new Date()}, //Query string data
            method: 'POST', 
            headers: { 
                'X-Api-Key' : config.sonarr.apikey,
                'Content-Type': 'application/json',
            },
            json: {
                    tvdbId :show.tvdbId,
                    titleSlug : show.titleSlug,
                    title : show.title,
                    qualityProfileId : "3",
                    RootFolderPath : "/mediaserver/Shows/TV Shows/",
                    addOptions:
                        {
                          "ignoreEpisodesWithFiles": true,
                          "ignoreEpisodesWithoutFiles": true
                        },
                    seasons : show.seasons,
                    images : show.images,
                },
            //body : 'data';
        }, function(error, response, body){
            if(error) {
                console.log(error);
                ResponseCallback('error');
            } 

            else {

                ResponseCallback('show added');
                console.log(response.statusCode, body);
            }
        });
    },

}