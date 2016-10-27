var config = {
    host: "<IP of your node box",
    port: "port",
    plexip: "plex server IP",
    plexusername: "<plex username>",
    plexport: "<plexport>",
    plexpassword: "<plex password>",
    plexservermachineid: "<special machine id of plex server",
    plextvclientmachineid: "<special machine id of the device you want to play to",

    sony : {
    	ip: "<bravia TV IP. needs to be static",	
    	port : '80',
    },

    plexOptions: {
	    product: "Plex for iOS",
	    version: "4.0.6",
	    device: "iPhone",
	    deviceName: "iphone",
	    identifier: "Node JS",
	},

	cp: {
		ip : '<IP of couchpotato',
		port : '5050',
		rootpath : '/api/<apikey for Couchpotato>/',
	},

	sonarr: {
		ip : '<sonarr IP',
		port : '<sonarr port: Usually 8989>',
		apikey : '<api key for sonarr>'
	}
};

module.exports = config;