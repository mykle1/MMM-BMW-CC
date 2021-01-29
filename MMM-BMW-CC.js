/* Magic Mirror
 * Module: MMM-BMW-CC
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMW-CC", {

    // Module config defaults.
    defaults: {
        apiKey: "", // Get FREE API key from ClimaCell.com
        tempUnits: "imperial",
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
        updateInterval: 30 * 60 * 1000,

        // icon mapping
        weatherCode: {
            "0": "unknown",
            "1000": "clear",
            "1001": "cloudy",
            "1100": "mostlyclear",
            "1101": "partly_cloudy",
            "1102": "mostly_cloudy",
            "2000": "fog",
            "2100": "fog",
            "3000": "wind",
            "3001": "wind",
            "3002": "wind",
            "4000": "drizzle",
            "4001": "rain",
            "4200": "rain",
            "4201": "rain",
            "5000": "snow",
            "5001": "flurries",
            "5100": "snow",
            "5101": "snow_heavy",
            "6000": "sleet",
            "6001": "sleet",
            "6200": "sleet",
            "6201": "sleet",
            "7000": "sleet",
            "7101": "sleet",
            "7102": "sleet",
            "8000": "tstorms"
        },
    },

    // Gets correct css file from config.js
    getStyles: function() {
        if (this.config.css != "") {
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
            wrapper.innerHTML = "Climacell API v4 . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        // current conditions
        if (this.current) {
            var current = this.current.timelines[0].intervals[0].values;

            var now = document.createElement("div");
            now.classList.add("small", "bright", "now");
            now.innerHTML =
                this.config.ownTitle + " &nbsp" +
                "<img class = image src=modules/MMM-BMW-CC/icons/" + this.config.weatherCode[current.weatherCode] + ".png>" +
                "&nbsp" +
                Math.round(current.temperature) + "°" +
                " &nbsp &nbsp &nbsp &nbsp " +
                " Feels like " + Math.round(current.temperatureApparent) +
                "°" +
                " &nbsp &nbsp &nbsp &nbsp Wind @ " + Math.round(current.windSpeed) +
                " &nbsp &nbsp &nbsp &nbsp " +
                "Humidity @ " + Math.round(current.humidity) +
                "%";

            wrapper.appendChild(now);
        }

        // Daily forecast for 7 days
        var Daily = document.createElement("div");
        Daily.classList.add("small", "bright", "daily");
        Daily.innerHTML =

            // Day 1 / Today
            moment(forecast.timelines[0].intervals[0].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[0].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[0].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[0].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp" +

            // Day 2
            moment(forecast.timelines[0].intervals[1].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[1].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[1].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[1].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp" +

            // Day 3
            moment(forecast.timelines[0].intervals[2].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[2].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[2].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[2].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp" +

            // Day 4
            moment(forecast.timelines[0].intervals[3].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[3].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[3].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[3].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp" +

            // Day 5
            moment(forecast.timelines[0].intervals[4].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[4].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[4].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[4].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp" +

            // Day 6
            moment(forecast.timelines[0].intervals[5].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[5].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[5].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[5].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp" +

            // Day 7
            moment(forecast.timelines[0].intervals[6].startTime).format('ddd') + " " +
            "<img class = image src=modules/MMM-BMW-CC/icons/" +
            this.config.weatherCode[forecast.timelines[0].intervals[6].values.weatherCode] + ".png>" + " " +
            Math.round(forecast.timelines[0].intervals[6].values.temperatureMax) + "/" +
            Math.round(forecast.timelines[0].intervals[6].values.temperatureMin) +
            " &nbsp &nbsp &nbsp &nbsp &nbsp";

        wrapper.appendChild(Daily);

        // Considering doing away with this option. TBD
        // Sound for rain, wind, thunder, etc.
        //  if (forecast[0].weather_code.value == "rain" && this.config.playSounds == "yes") {
        //      var sound = new Audio()
        //      sound.src = 'modules/MMM-BMW-CC/sounds/rain.mp3'
        //      sound.play()
        //  } else if (forecast[0].weather_code.value == "thunder" && this.config.playSounds == "yes") {
        //      var sound = new Audio();
        //      sound.src = 'modules/MMM-BMW-CC/sounds/thunder.mp3';
        //      sound.play();
        //  } else if (forecast[0].weather_code.value == "wind" && this.config.playSounds == "yes") {
        //      var sound = new Audio();
        //      sound.src = 'modules/MMM-BMW-CC/sounds/wind.mp3';
        //      sound.play();
        //  }

        return wrapper;
    },

    processWeather: function(data) {
        this.forecast = data;
        //    console.log(this.forecast);
    },

    processCurrent: function(data) {
        this.current = data;
        this.loaded = true;
        // console.log(this.current);
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
        if (notification === "CURRENT_RESULT") {
            this.processCurrent(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
