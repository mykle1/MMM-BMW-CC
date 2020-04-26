/* Magic Mirror
 * Module: MMM-BMW-CC
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMW-CC", {

    // Module config defaults.
    defaults: {
        apiKey: "", // Get FREE API key from ClimaCell.com
        tempUnits: "", // us or si
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

        var current = this.current;
        var now = document.createElement("div");
        now.classList.add("small", "bright", "now");
        now.innerHTML =

            this.config.ownTitle + " &nbsp &nbsp " +

            "<img class = image src=./modules/MMM-BMW-CC/icons/" + current[0].weather_code.value + ".png>" +
            "  &nbsp " +

            Math.round(current[0].temp.value) + "°" +

            current[0].temp.units + " &nbsp &nbsp &nbsp &nbsp " +

            " Feels like " + Math.round(current[0].feels_like.value) +
            "°" +
            current[0].feels_like.units +

            " &nbsp &nbsp &nbsp &nbsp Wind @ " + Math.round(current[0].wind_speed.value) +

            current[0].wind_speed.units + " &nbsp &nbsp &nbsp &nbsp " +

            "Humidity @ " + Math.round(current[0].humidity.value) +

            current[0].humidity.units;

        wrapper.appendChild(now);


        // console.log(moment(forecast[0].observation_time.value).format('ddd'));
        // https://devhints.io/moment

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
        if (forecast[0].weather_code.value == "rain" && this.config.playSounds == "yes") {
            var sound = new Audio()
            sound.src = 'modules/MMM-BMW-CC/sounds/rain.mp3'
            sound.play()
        } else if (forecast[0].weather_code.value == "thunder" && this.config.playSounds == "yes") {
            var sound = new Audio();
            sound.src = 'modules/MMM-BMW-CC/sounds/thunder.mp3';
            sound.play();
        } else if (forecast[0].weather_code.value == "wind" && this.config.playSounds == "yes") {
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
        // console.log(this.current);
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
        if (notification === "CURRENT_RESULT") {
            this.processCurrent(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
