/**
 * Simple example, get all devices owned by user
 * and output some device information and location
 *
 * Author: Thomas Henley
 */
var iPhoneFinder = require('iphone-finder');

// Replace with valid iCloud email and password
var iCloudUser = 'my@icloud.com';
var iCloudPass = '#############';

// Find all devices the user owns
iPhoneFinder.findAllDevices(iCloudUser, iCloudPass, function(err, devices) {
    // Got here? Great! Lets see some device information
    devices.forEach(outputDevice);
});

// Output device type, name and location. Includes link to google maps with long/lat set
function outputDevice(device) {
    // Output device information
    console.log('Device Name: ' + device.name);
    console.log('Device Type: ' + device.modelDisplayName);

    // Output location (latitude and longitude)
    var lat = device.location.latitude;
    var lon = device.location.longitude;
    console.log('Lat/Long: ' + lat + ' / ' + lon);

    // Output a url that shows the device location on google maps
    console.log('View on Map: http://maps.google.com/maps?z=15&t=m&q=loc:' + lat + '+' + lon);
}
