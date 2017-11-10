var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  
  socket.on('message', function (msg) {
    console.log('Received Message: ', msg);
    console.log('Is it a question?: ', isQuestion(msg));
    console.log('Is it refer time', askingTime(msg) );
    console.log('Is it refer temp', askingTemp(msg) );
      
    if (!isQuestion(msg)) {
        io.emit('message', msg);
    } else if (askingTime(msg)) {
        io.emit('message', new Date);
    } 
    else if (askingTemp(msg)) {
        getWeather(function(weather) {
         io.emit('message', 'Tempature now is: ' + weather)
      })
    } 
  });
});

server.listen(8080, function() {
  console.log('Chat server running');
});

function isQuestion(msg) {
  return msg.match(/\?$/)
}

function askingTime(msg) {
  return msg.match(/time/i)
}

function askingTemp(msg) {
  return msg.match(/temperature/i)
}


function getWeather(callback) {
  var request = require('request');
  request.get("https://www.metaweather.com/api/location/4118/", function (error, response) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(response.body);
      callback(data.consolidated_weather[0].weather_state_name);
    }
  })
}


