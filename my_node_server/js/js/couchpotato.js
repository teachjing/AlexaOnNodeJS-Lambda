var http = require('http');
var bodyParser = require('body-parser');

module.exports = {

    addmovie : function(options, ResponseCallback) {
      console.log("Adding Movie to couchpotato: " + options.movieid);

        var url = "http://"+options.ip+":"+options.port+options.rootpath+options.path;
        console.log(url);

        var body = "";
        http.get(url, function(response){    
            response.setEncoding('utf8');
            console.log("HTTP Request sent to couchpotato");
            response.on("data", function (chunk) {
                body += chunk;
            });

            response.on("end", function () {
                responseobject = JSON.parse(body);
                ResponseCallback(responseobject);
            })
        });
    },

    callapi : function(options, ResponseCallback) {
        url = "http://"+options.ip+":"+options.port+options.rootpath+options.path;
        
        console.log("callapi requested for "+url);
        var body = "";

        http.get(url, function(response){
            response.setEncoding('utf8');
            console.log("HTTP Request sent to couchpotato");

            response.on("data", function (chunk) {
                body += chunk;
            });

            response.on("end", function () {
                responseobject = JSON.parse(body);
                console.log(responseobject);
                var message = [];
                for(i = 0; i < responseobject.movies.length; i++) {
                //("("+(i+1)+") - "+responseobject.movies[i].original_title + ", " + responseobject.movies[i].year)
                message.push({
                    "id":i+1,
                    "title":responseobject.movies[i].original_title,
                    "year":responseobject.movies[i].year,
                    "imdb":responseobject.movies[i].imdb,
                    "thumb":responseobject.movies[i].images.poster[0],
                    });
                };
                ResponseCallback(message);
            })
            
            //response.on("data", function (chunk) {
            //    console.log(chunk);
            //    ResponseCallback(chunk);
            //});
        });
    }
}