var telnet = require('telnet-client');
var channels = require('./tivo/channel-list'); //loads the channels file in the same directory.
var sonybravia = require('./sonybravia');
var request = require('request');
var express = require('express');
var router = express.Router();

router.post('/changechannel',function(req,res){
    var channelname=req.headers.channelname;
    console.log("User requested channel change to " + channelname);

    var channel = channels[channelname];
    console.log(channelname + " on " + channel + " channel function called by user");

    //code script created from the channel.
    var code = 'SETCH ' + channel + ' \r';
    console.log(code);

    //Launches the script with code script to TV IRCODE Function.
    sendtotivo(code, function ResponseCallback(err, codeResponse) {

        if (err) {
            speechOutput = "I had trouble processing this request. Please try again.";
            res.send(speechOutput);
        } else {
            // Turns the TV to HDMI 4
            speechOutput = "Channel has been changed to " + channelname + " on " + channel;
            res.send(speechOutput);
        }
        
    });

});

router.post('/changechannel',function(req,res){
    var channelname=req.headers.channelname;
    console.log("User requested channel change to " + channelname);

    var channel = channels[channelname];
    console.log(channelname + " on " + channel + " channel function called by user");

    //code script created from the channel.
    var code = 'SETCH ' + channel + ' \r';
    console.log(code);

    //Launches the script with code script to TV IRCODE Function.
    sendtotivo(code, function ResponseCallback(err, codeResponse) {

        if (err) {
            speechOutput = "I had trouble processing this request. Please try again.";
            res.send(speechOutput);
        } else {
            // Turns the TV to HDMI 4
            speechOutput = "Channel has been changed to " + channelname + " on " + channel;
            res.send(speechOutput);
        }
        
    });

});

router.post('/power',function(req,res){
    var code ="";
    var powerintent = req.headers.powerintent; 
    // Turns the Tivo Active/Standby
    
    //sets the users power intent variable      
    switch (powerintent) {
        case "on": code = 'IRCODE LIVETV \r'; break;
        case "off": code = 'IRCODE STANDBY \r'; break;
    }

    sendtotivo(code, function ResponseCallback(err, codeResponse) {
        if (err) {
            console.log(err);
            res.send("err");
        } else {
            console.log("tivo turned " + powerintent);
            res.send("tivo turned " + powerintent);
        }
    });  
});

router.post('/cc',function(req,res){
    var cc=req.headers.cc;
    console.log("User request Closed Caption " + cc);
    var code = "";

    switch(cc) {
        case "on" : code = "IRCODE CC_ON \r"; break;
        case "off": code = "IRCODE CC_OFF \r"; break;
    }

    //Launches the script with code script to TV IRCODE Function.
    if(code) {
        sendtotivo(code, function ResponseCallback(err, codeResponse) {
            res.send("Closed caption has been turned " + cc);
        });
    }

    //if code matches nothing.
    if(code == "") {
        res.send("Im sorry, I dont understand anything except to turn closed captioning on or off");
    }

});

function sendtotivo(code, ResponseCallback) {
    console.log(code + " is being sent to the TiVo.");
    var connection = new telnet();
    var params = {
        host: 'tivo.lan',
        port: '31339',
        shellPrompt: 'CH_STATUS',
        timeout: 1000};

    connection.on('connect', function(prompt) {
        console.log("connection established");
        connection.exec(code);
        console.log(prompt);
    });

    connection.on('timeout', function() {

    console.log('socket closing');
        connection.end();
        connection.destroy();
        //connection.end();
    });

    connection.on('close', function() {
        console.log('connection closed');
        ResponseCallback(null, "Complete");
    });

    connection.connect(params);
}

module.exports = router;

/*
        //sets the users power intent variable
        
        switch (powerintent) {
            case "on": powerintent = 'active'; break;
            case "off": powerintent = 'standby'; break;
        }
        console.log("User has requested that the TV turn " + powerintent);

        //retrieves the Sony Bravia power status
        var powerstatus = "";
        sony.PowerStatus(function ResponseCallback(err, codeResponse) {

            if (err) {
                response.tell("I cannot do that right now. Please try again");
            } else {
                powerstatus = codeResponse;
                console.log(codeResponse + " status has been retreived from function.");
            
                //if powerintent already matches the power status. does nothing. otherwise turns power on/off
                if (powerintent == powerstatus) {
                    response.tell("The TV is already " + powerintent);
                } else {
                    console.log("TV has been turned " + powerintent)
                    sony.IRcodeRequest("AAAAAQAAAAEAAAAVAw==", function ResponseCallback(err, codeResponse) {            
                    response.tell("I have switched the TV " + powerintent);
                    });
                }
            }          
        });    
        */
