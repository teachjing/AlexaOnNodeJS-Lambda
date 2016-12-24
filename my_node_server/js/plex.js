var express = require('express');
var dice = require('clj-fuzzy').metrics.dice;
var http = require('http');
var qs = require('querystring');
var router = express.Router();
var plexAPI = require('plex-api');
var request = require('request');
var config = require('./config');

var plex = new plexAPI({
    hostname: config.plexip,
    username: config.plexusername,
    port: config.plexport,
    password: config.plexpassword,
    options: config.plexOptions
});

var matchConfidence;

router.post('/playlatestepisode', function(req, res) {
	var spokenShowName = req.headers.showname; //receives the name spoken by the user

	if (spokenShowName == undefined) {  
        res.send("I had a problem finding that show.");
    }
    console.log("List of shows router initiated. And show requested is " + spokenShowName);

    //Grabs full list of all shows to match against.
    plex.query('/library/sections/2/all').then(function(listOfTVShows) {

        //runs script to find the closest matching show name to what was spoken.
        var bestShowMatch = getShowFromSpokenName(spokenShowName, listOfTVShows.MediaContainer);
        var show = bestShowMatch.bestMatch;
        matchConfidence = bestShowMatch.confidence;

        //best match is returned
        return getAllEpisodesOfShow(show).then(function (allEpisodes) {
            console.log(allEpisodes.MediaContainer.size + " episodes.");
            var episode = allEpisodes.MediaContainer.Metadata[allEpisodes.MediaContainer.size - 1];

            //ratingKey is passed to playMedia function which sends request to play to player.
            playMedia(episode.ratingKey);
            res.send("Now loading " + episode.grandparentTitle + " titled " + episode.title);
        });
    });

});

//search for movies
router.post('/searchmovie', function(req, res) {
	var moviename = req.headers.moviename; 
	console.log(moviename + " received from Alexa");

	if (moviename == undefined) {
		res.send("I had a problem finding that movie.");
		return;
	}

	console.log("searchmovie function called for movie " + moviename);

	//pulls full movie list to search against
	getMovieList(moviename, function ResponseCallback(movielist) {
		console.log(movielist.size + " items.");

		//finds best matching movie based on spoken name by user. 
		findBestMovie(moviename, movielist, function MatchCallback(bestMatch) {
        	console.log(bestMatch.title);

        	//ratingKey is passed to playMedia function to play movie. 
        	playMedia(bestMatch.ratingKey);
        	res.send("Playing Movie titled " + bestMatch.title);
    	});
	});

});

//Search and list the most recently added movies/shows based on what was said. 
router.post('/recentlyadded', function(req, res) {
		var mediatype = req.headers.mediatype;


		plex.query('/library/recentlyAdded').then(function(result) {
		    var items = [];
		    var results = result.MediaContainer;
		    var current = 0; var maxcount = 10; //max count. change to make it list more shows.
		    console.log(results.size + " items found.");

		    //checks to see if movies or shows are requested and will extract all media of that type and push it to items
		    for(var i = 0; i < results.size && current < maxcount; i++) {
		        if(mediatype == "movies" && results.Metadata[i].type == "movie"){
                    items.push(" " + results.Metadata[i].title);
                    current++;
		        }
		        else if(mediatype == "episodes" && results.Metadata[i].type =="season") {
                    var episode = results.Metadata[i];
                    items.push("" + episode.parentTitle);
                    current++;
		        }
		    }

		    if(items.length > 0) {
		      //generated response based on user input.
		      res.send("Here are " + items.length + " of your recently added " + mediatype + ". " + items);
		    } else {
		      res.send("You do not have any recently added " + mediatype);
		    }


		}).catch(function(err) {
		    console.log("ERROR from Plex API on Query /library/recentlAdded");
		    console.log(err);
		    res.send("I'm sorry, Plex and I don't seem to be getting along right now");
        });

    return false;
});

function getMovieList(moviename, callback) {
    console.log("Getting list of movies..looking for " + moviename);
	plex.query('/library/sections/1/all').then(function (movielist) {
		callback(movielist.MediaContainer);
	});
}

function getShowFromSpokenName(spokenShowName, listOfShows) {
	console.log("getShowFromSpokenName function called for " + spokenShowName);
    return findBestMatch(spokenShowName, listOfShows, function (show) {
        return show.title;
    });
}

function getAllEpisodesOfShow(show) {
	console.log(" getAllEpisodesOfShow function called for show - " + show.title);
    return plex.query('/library/metadata/' + show.ratingKey + '/allLeaves');
}

//function to find best matching show from name, list of shows.
function findBestMatch(phrase, items, mapfunc) {
	console.log("findBestMatch function called");
	console.log("Searching for '" + phrase + "' in " + items.size + " total items");
    var MINIMUM = 0.2;

    var bestmatch = {index: -1, score: -1};
	var possibilities = items.Metadata;
    //scans every name from list of items.
    for(i=0; i<items.size; i++) {
        var possible = possibilities[i];
        if (mapfunc) {
            possible = mapfunc(possibilities[i]);
        }

        var score = dice(phrase, possible);

        //console.log(score + ': ' + possible);

        if(score >= MINIMUM && score > bestmatch.score) {
            bestmatch.index = i;
            bestmatch.score = score;
        }
    }

    if(bestmatch.index === -1) {
        return false;
    } else {
        return {
            bestMatch: items.Metadata[bestmatch.index],
            confidence: bestmatch.score
        };
    }
}

//function to find best matching show from name, list of shows.
function findBestMovie(phrase, items, callback) {
	console.log("findBestMatch function called");
	console.log("Searching for '" + phrase + "' in " + items.size + " total items");
    var MINIMUM = 0.2;

    var bestmatch = {index: -1, score: -1};
    var movies = items.Metadata;

    //scans every name from list of items.
    for(var i = 0; i < items.size; i++) {
        var movie = movies[i];

        var score = dice(phrase, movie.title);

        //console.log(score + ': ' + item);

        if(score >= MINIMUM && score > bestmatch.score) {
            bestmatch.index = i;
            bestmatch.score = score;
        }
    }

    if(bestmatch.index === -1) {
        return false;
    } else {
    	console.log("located "+ movies[bestmatch.index].title);
    	callback(movies[bestmatch.index]);
    }
}

function playMedia(ratingKey) {
	var parameterstring = qs.stringify({
	 	'X-Plex-Target-Client-Identifier': config.plextvclientmachineid, 
	 	'key': '/library/metadata/'+ratingKey,
	 	'machineIdentifier': config.plexservermachineid,
	 	'address' : plex.hostname,
	 	'port' : plex.port,
	});

    var playerurl = "http://sonybravia.lan:32500/player/playback/playMedia?"+parameterstring;
	http.get(playerurl, function(response){
		console.log("MediaURL sent to player. "+ playerurl);
	});
}

module.exports = router;
