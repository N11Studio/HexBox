var five = require("johnny-five");
const {Board} = require("johnny-five");
const board = new Board({port: "/dev/cu.usbmodem1D11301"});

// create connection
var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};

var serverPort = 6060;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
// app.use('/resources',express.static(__dirname + '/marker'));
// app.get('/', function(req, res) {
// res.sendFile(__dirname + '/public');
// });
// ------------------------------------------------------------------//

// SENSORS

// Right and Left Sensors
let sensor_left
let sensor_right

// Front and Back Sensors
let sensor_front
let sensor_back

// Top and Bottom Sensors
let sensor_top
let sensor_bottom

// PINS:

let pinval_right
let pinval_front
let pinval_left
let pinval_top
let pinval_bottom
let pinval_back

board.on("ready", function () {

    var touchpin1 = new five.Pin(8);
    var touchpin2 = new five.Pin(3);
    var touchpin3 = new five.Pin(5);
    var touchpin4 = new five.Pin(6);
    var touchpin5 = new five.Pin(4);
    var touchpin6 = new five.Pin(7);

    var sensor1_right = new five.Pin("A3");
    var sensor2_front = new five.Pin("A1");
    var sensor3_left = new five.Pin("A2");
    var sensor4_top = new five.Pin("A10")
    var sensor5_bottom = new five.Pin("A9");
    var sensor6_back = new five.Pin("A0");

    board.loop(30, () => {

        // Delay
        setTimeout(function () {

            // READ TOUCH SENSOR INPUT:

            five.Pin.read(touchpin1, function (error, value1) {
                pinval_right = value1
            });

            five.Pin.read(touchpin2, function (error, value2) {
                pinval_front = value2
            });

            five.Pin.read(touchpin3, function (error, value3) {
                pinval_left = value3
            });

            five.Pin.read(touchpin4, function (error, value4) {
                pinval_top = value4
            });

            five.Pin.read(touchpin5, function (error, value5) {
                pinval_bottom = value5
            })

            five.Pin.read(touchpin6, function (error, value6) {
                pinval_back = value6
            });


            // DEFINE SENSOR PINS AND CALCULATE THE AVERAGE SENSOR VALUE
            // ADD IF STATEMENT FOR TOUCH SENSORS

            // SENSOR RIGHT:

            five.Pin.read(sensor1_right, function (error, rightsensor) {


                if (pinval_right !== 0) {
                    rightArray = Array.from({
                        length: 5
                    }, () => (rightsensor))
                    var total_right = 0;
                    for (var i = 0; i < rightArray.length; i++) {
                        total_right += rightArray[i];
                    }
                    var rightAvg = total_right / rightArray.length;
                    sensor_right = Math.round(rightAvg);

                }


            });

            // SENSOR FRONT

            five.Pin.read(sensor2_front, function (error, frontsensor) {

                if (pinval_front !== 0) {
                    frontArray = Array.from({
                        length: 5
                    }, () => (frontsensor))
                    var total_front = 0;
                    for (var i = 0; i < frontArray.length; i++) {
                        total_front += frontArray[i];
                    }
                    var frontAvg = total_front / frontArray.length;
                    sensor_front = Math.round(frontAvg);

                }

            });

            // SENSOR LEFT
            five.Pin.read(sensor3_left, function (error, leftsensor) {


                if (pinval_left !== 0) {
                    leftArray = Array.from({
                        length: 5
                    }, () => (leftsensor))
                    var total_left = 0;
                    for (var i = 0; i < leftArray.length; i++) {
                        total_left += leftArray[i];
                    }
                    var leftAvg = total_left / leftArray.length;
                    sensor_left = Math.round(leftAvg);

                }

            });

            // SENSOR TOP
            five.Pin.read(sensor4_top, function (error, topsensor) {


                if (pinval_top !== 0) {
                    topArray = Array.from({
                        length: 5
                    }, () => (topsensor))
                    var total_top = 0;
                    for (var i = 0; i < topArray.length; i++) {
                        total_top += topArray[i];
                    }
                    var topAvg = total_top / topArray.length;
                    sensor_top = Math.round(topAvg);

                }

            });

            // SENSOR BOTTOM

            five.Pin.read(sensor5_bottom, function (error, bottomsensor) {


                if (pinval_bottom !== 0) {
                    bottomArray = Array.from({
                        length: 5
                    }, () => (bottomsensor))
                    var total_bottom = 0;
                    for (var i = 0; i < bottomArray.length; i++) {
                        total_bottom += bottomArray[i];
                    }
                    var bottomAvg = total_bottom / bottomArray.length;
                    sensor_bottom = Math.round(bottomAvg);

                }

            });

            // SENSOR BACK

            five.Pin.read(sensor6_back, function (error, backsensor) {


                if (pinval_back !== 0) {
                    backArray = Array.from({
                        length: 5
                    }, () => (backsensor))
                    var total_back = 0;
                    for (var i = 0; i < backArray.length; i++) {
                        total_back += backArray[i];
                    }
                    var backAvg = total_back / backArray.length;
                    sensor_back = Math.round(backAvg);

                }

            });

        }, 10);


    });

});
// ----------//

// SEND VALUES FROM SERVER

io.on('connection', function (socket) {
    console.log('new connection');

    socket.emit('hello', "hello")

    socket.on('getTouch', data => {
        socket.emit('touch', {
            right: sensor_right,
            front: sensor_front,
            left: sensor_left,
            top: sensor_top,
            bottom: sensor_bottom,
            back: sensor_back,
            righttouch: pinval_right,
            lefttouch: pinval_left,
            fronttouch: pinval_front,
            backtouch: pinval_back,
            toptouch: pinval_top,
            bottomtouch: pinval_bottom
        });
    })
});


server.listen(serverPort, function () {
    console.log('server up and running at %s port', serverPort);
});
