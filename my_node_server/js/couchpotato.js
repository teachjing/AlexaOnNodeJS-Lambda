var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');
var qs = require('querystring');
var express = require('express');
var couchpotato = require('./js/couchpotato');

var config = require('./config');

var router = express.Router();
router.use(bodyParser.json());

//  
router.post('/search',function(req,res){
    var options = {
        ip : config.cp.ip,
        port : config.cp.port,
        rootpath : config.cp.rootpath,
        moviename : req.headers.moviename,
        path : 'search?q='+req.headers.moviename,
    };
    console.log("User requested to search for movie " + options.moviename);

    couchpotato.callapi(options, function ResponseCallback(list) {
        console.log("Sending list of movies to user"); 
        console.log(list);

        res.send(list); 
    });

});

router.post('/addmovie',function(req,res){
    var options = {
        ip : config.cp.ip,
        port : config.cp.port,
        rootpath : config.cp.rootpath,
        movieid : req.headers.movieid,
        path : 'movie.add?identifier='+req.headers.movieid,
    };

    console.log("User requested to add movie");
    var movieid = req.headers.movieid;

    couchpotato.addmovie(options, function ResponseCallback(list) {
        console.log("Movie added");
        res.send(list);
    })
});

//Export Module
module.exports = router;
