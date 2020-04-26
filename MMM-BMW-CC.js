/* Magic Mirror
 * Module: MMM-BMW-CC
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMW-CC", {

    // Module config defaults.
    defaults: {
        apiKey: "", // Get FREE API key from darksky.net
        tempUnits: "C", // C  or F
        lat: "", // Latitude
        lon: "", // Longitude
        css: "1", // 1=default, 2=Clean, 3=Lord of the Rings, 4=handwriting, 5=Julee, 6=Englebert
        ownTitle: "Current Conditions", // Default = Current Conditions
        playSounds: "yes", // yes = weather sounds, no = no weather sounds
        useHeader: false, // true if you want a header
        header: "Your Header", // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,
    },

    // Gets correct css file from config.js
    getStyles: function() {
      if(this.config.css != ""){
        return ["modules/MMM-BMW-CC/css/MMM-BMW-CC" + this.config.css + ".css"];
      } else {
        return ["modules/MMM-BMW-CC/css/MMM-BMW-CC1.css"]; // default.css
      }
    },


    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);
        this.config.lang = this.config.lang || config.language;

        //  Set locale.
        this.current = [],
        this.forecast = [];
        this.scheduleUpdate();
    },

    getDom: function() {
        var forecast = this.forecast;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Climacell data . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        // var current = document.createElement("div");
        // current.classList.add("small", "bright", "current");
        //
        // // Check if element exists, courtesy of @CBD
        // var numbnuts = forecast.minutely;
////////////////////////////////// if (numbnuts) { // REALLY shorthand version of next line
        // if (typeof !numbnuts !== 'undefined') { // This checks if element exists courtesy of @CBD
        //
        //     if (this.config.tempUnits != "F") {
        //         if (this.config.ownTitle !== "") {
        //             current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
        //         } else {
        //             current.innerHTML = "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
        //         }
        //         wrapper.appendChild(current);
        //     } else {
        //         if (this.config.ownTitle !== "") {
        //             current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
        //         } else {
        //             current.innerHTML = "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
        //
        //         }
        //         wrapper.appendChild(current);
        //     }
        // } else {
        //
        //     if (this.config.tempUnits != "F") {
        //         current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.currently.icon + ".png>" + " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.currently.summary;
        //         wrapper.appendChild(current);
        //     } else {
        //         current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.currently.icon + ".png>" + " &nbsp &nbsp " + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.currently.summary;
        //         wrapper.appendChild(current);
        //     }
        //
        // }


        // var test = document.createElement("div");
        // test.classList.add("xsmall", "bright", "test");
        // test.innerHTML = "Testing" // forecast.hourly.summary; // + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.hourly.icon + ".png>";
        // wrapper.appendChild(test);

        var summary = document.createElement("div");
        summary.classList.add("xsmall", "bright", "summary");
        summary.innerHTML = forecast["0"].temp["0"].min.value; // + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast.hourly.icon + ".png>";
        wrapper.appendChild(summary);

        var test = document.createElement("div");
        test.classList.add("xsmall", "bright", "test");
        test.innerHTML = moment.utc(forecast["0"].feels_like[1].observation_time).local().format('ddd');
        wrapper.appendChild(test);

// console.log(moment(forecast[0].observation_time.value).format('ddd'));
//https://devhints.io/moment

        // daily names, high/low and icons
        var daily = document.createElement("div");
        daily.classList.add("small", "bright", "daily");
        daily.innerHTML =

        moment(forecast[0].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[0].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[0].temp[1].max.value) + "/" + Math.round(forecast[0].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


        moment(forecast[1].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[1].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[1].temp[1].max.value) + "/" + Math.round(forecast[1].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


        moment(forecast[2].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[2].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[2].temp[1].max.value) + "/" + Math.round(forecast[2].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


        moment(forecast[3].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[3].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[3].temp[1].max.value) + "/" + Math.round(forecast[3].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


      moment(forecast[4].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[4].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[4].temp[1].max.value) + "/" + Math.round(forecast[4].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


        moment(forecast[5].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[5].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[5].temp[1].max.value) + "/" + Math.round(forecast[5].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


        moment(forecast[6].observation_time.value).format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-CC/icons/" + forecast[6].weather_code.value + ".png>" + " &nbsp" + Math.round(forecast[6].temp[1].max.value) + "/" + Math.round(forecast[6].temp[0].min.value) + " &nbsp &nbsp  &nbsp &nbsp &nbsp";

        wrapper.appendChild(daily);



                // Sound for rain, wind, thunder, etc.
                if (forecast[0].weather_code.value == "rain" && this.config.playSounds == "yes"){
                      var sound = new Audio()
                      sound.src = 'modules/MMM-BMW-CC/sounds/rain.mp3'
                      sound.play()
        } else if (forecast[0].weather_code.value == "thunder" && this.config.playSounds == "yes"){
                      var sound = new Audio();
                      sound.src = 'modules/MMM-BMW-CC/sounds/thunder.mp3';
                      sound.play();
        } else if (forecast[0].weather_code.value == "wind" && this.config.playSounds == "yes"){
                      var sound = new Audio();
                      sound.src = 'modules/MMM-BMW-CC/sounds/wind.mp3';
                      sound.play();
                }

        return wrapper;
    },


    processWeather: function(data) {
        this.forecast = data;
    // console.log(this.forecast);
        this.loaded = true;
    },

    processCurrent: function(data) {
        this.current = data;
     console.log(this.current);
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getWeather(); 
        }, this.config.updateInterval);
        this.getWeather(this.config.initialLoadDelay);
    },

    getWeather: function() {
        this.sendSocketNotification('GET_WEATHER');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_RESULT") {
            this.processWeather(payload);
          }
        if (notification === "CURRENT_RESULT"){
          this.processCurrent(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
