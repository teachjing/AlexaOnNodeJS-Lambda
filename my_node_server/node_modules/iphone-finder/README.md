# iphone-finder

Simple library to locate iOS devices (iPhone, iPod and iPad)

## Installation

First install [node.js](http://nodejs.org/). Then:

    $ npm install iphone-finder

## Usage

    var iPhoneFinder = require('iphone-finder');
    
    // Replace with valid iCloud email and password
    var iCloudUser = 'my@icloud.com';
    var iCloudPass = '#############';
    
    // Find all devices the user owns
    iPhoneFinder.findAllDevices(iCloudUser, iCloudPass, function(err, devices) {
        // Got here? Great! Lets see some device information
        devices.forEach(function(device) {
            // Output device information
            console.log('Device Name: ' + device.name);
            console.log('Device Type: ' + device.modelDisplayName);
        
            // Output location (latitude and longitude)
            var lat = device.location.latitude;
            var lon = device.location.longitude;
            console.log('Lat/Long: ' + lat + ' / ' + lon);
        
            // Output a url that shows the device location on google maps
            console.log('View on Map: http://maps.google.com/maps?z=15&t=m&q=loc:' + lat + '+' + lon);
        });
    });
