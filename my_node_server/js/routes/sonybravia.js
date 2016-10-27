var bodyParser = require('body-parser');
var express = require('express');
var sonybravia = require('../js/sonybravia');

var router = express.Router();
router.use(bodyParser.json());

router.post('/power',function(req,res){
    var power = req.headers.power; 
    console.log("User request TV Power " + power);
    var powerintent = '';

    //sets the users power intent variable      
    switch (power) {
        case "on": powerintent = 'active'; break;
        case "off": powerintent = 'standby'; break;
    }
    console.log("User has requested that the TV turn " + powerintent);

    //retrieves the Sony Bravia power status
    var powerstatus = "";

    sonybravia.PowerStatus(function ResponseCallback(err, codeResponse) {

        if (err) {
            res.send("I cannot do that right now. Please try again");
        } else {

            console.log(codeResponse + " status has been retreived from function.");
        
            //if powerintent already matches the power status. does nothing. otherwise turns power on/off
            if (powerintent == codeResponse) {
                res.send("The TV is already " + power);
            } else {
                console.log("TV has been turned " + power)

                sonybravia.IRcodeRequest("AAAAAQAAAAEAAAAVAw==", function ResponseCallback(err, codeResponse) {            
                res.send("I have switched the TV " + req.headers.powerintent);
                });
            }
        }        
    });   
});

router.post('/videoinput',function(req,res){
    var inputnumber = req.headers.inputnumber; 
    console.log("User request TV Input change to " + inputnumber);

    //calls the VideoInputChange function to
    sonybravia.VideoInputChange(inputnumber, function ResponseCallback(speechoutput) {
        console.log(speechoutput);
        res.send(speechoutput);
    });
});

router.post('/setvolume',function(req,res){
    var newvolume = req.headers.newvolume; 
    console.log("User request to change volume to " + newvolume);

    //builds message
    var options = {
      url: "/sony/audio",
      jsonmsg: {"method":"setAudioVolume","params":[{"target":"speaker","volume": newvolume}],"id":10, "version":"1.0"},
    }

    //calls the VideoInputChange function to
    sonybravia.CallSonyAPI(options, function ResponseCallback(speechoutput) {
      console.log(speechoutput + 'received');
      console.log(speechoutput.length);

      try {
        if (speechoutput.result.length > 0) {
          message = "The volume has been changed to " + newvolume;
        }        
      } catch(e) {
          message = "The Display is turned off or I am having trouble setting the volume";
      }
      console.log(message);
      res.send(message);
    });
});

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function(req, res) {
  res.send('Sony API');
});

//Export Module
module.exports = router;

exports.CallSonyAPI = function (message, ResponseCallback) {
  console.log("Calling Sony API http://" + hostip + message.url);

  //Build JSON Body to talk to Bravia TV
  var jsonbody = message.jsonmsg;

  var post_options = {
    host: hostip,
    port: hostport,
    path: message.url,
    method: 'POST',
    headers: {
        'X-Auth-PSK': 'xbrsony123',
        'Content-Type': 'application/json'
      },
    body : message.jsonmsg,
  };

  ResponseCallback("allo", null);
};


