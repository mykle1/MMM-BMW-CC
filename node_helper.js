/* Magic Mirror
 * Module: MMM-BMW-CC
 *
 * By Mykle1
 *
 * MIT Licensed
 */
const NodeHelper = require('node_helper');
const request = require('request');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getWeather: function(url) {
        var options = {
            method: 'GET',
            url: 'https://api.climacell.co/v3/weather/forecast/daily',
            qs: {
                apikey: this.config.apiKey,
                fields: [
                    'temp',
                    'feels_like',
                    'precipitation',
                    'wind_speed',
                    'wind_direction',
                    'humidity',
                    'weather_code'
                ],
                unit_system: this.config.tempUnits,
                lat: this.config.lat,
                lon: this.config.lon
            }
        };

        var self = this;

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            var result = JSON.parse(body);
            // console.log(response.statusCode); // for checking
            self.getCurrent();
            self.sendSocketNotification('WEATHER_RESULT', result);
            // console.log(body);
        });

    },

    getCurrent: function(url) {
      var self = this;
      var options = {
  method: 'GET',
  url: 'https://api.climacell.co/v3/weather/nowcast',
  qs: {
    apikey: this.config.apiKey,
    fields: [
        'temp',
        'feels_like',
        'precipitation',
        'wind_speed',
        'wind_direction',
        'humidity',
        'weather_code'
    ],
    unit_system: this.config.tempUnits,
    lat: this.config.lat,
    lon: this.config.lon
  }
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  //var current = []; //this.current[0] instead of just this.current
  var result = JSON.parse(body);
  var items = result.slice(0, 11);
  //current.push(items);

   console.log(response.statusCode); // for checking
  self.sendSocketNotification('CURRENT_RESULT', items);
//  console.log(result);
});
},

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_WEATHER') {
            this.getWeather(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
