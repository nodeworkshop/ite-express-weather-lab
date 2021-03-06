/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express'),
    adaro = require('adaro'),
    request = require('request');

// create a new express server
var app = express();

app.engine('dust', adaro.dust());
app.set('view engine', 'dust');

app.set('views', __dirname + '/public/views');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


app.get('/home',function(req, res) {
    req.model = {};
    req.model.name = 'ITE';
    
    res.render('index',req.model);
});

app.get('/weather', function(req, res){
   request('http://api.openweathermap.org/data/2.5/weather?q=Singapore', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('response.body:' + body); // Weather Data for Singapore
        
        //Note that we should parse the stringified response to JSON
        var result = JSON.parse(body);
        
        console.log('result: ' + result);
        
        //Populate the view model used to display
        req.model = {};
        req.model.temp = Math.floor(result.main.temp/10.0),
        req.model.max_temp = Math.floor(result.main.temp_max/10.0),
        req.model.min_temp = Math.floor(result.main.temp_min/10.0),
        req.model.humidity = result.main.humidity,
        req.model.country = result.name,
        req.model.coord = result.coord,
        req.model.wind = result.wind,
        req.model.weather = result.weather;
        
        
        console.log('req.model: %j',req.model);
        
        res.render('weather',req.model);
      }
    });
});

// start server on the specified port and binding host
var server = app.listen(6001, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

