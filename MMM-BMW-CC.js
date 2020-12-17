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
        if (this.current) {
            var current = this.current;
            var now = document.createElement("div");
            now.classList.add("small", "bright", "now");
            now.innerHTML =
                this.config.ownTitle + " &nbsp &nbsp " +
                "<img class = image src=modules/MMM-BMW-CC/icons/" + current.weather_code.value + ".png>" +
                "  &nbsp " +
                Math.round(current.temp.value) + "°" +
                current.temp.units + " &nbsp &nbsp &nbsp &nbsp " +
                " Feels like " + Math.round(current.feels_like.value) +
                "°" +
                current.feels_like.units +
                " &nbsp &nbsp &nbsp &nbsp Wind @ " + Math.round(current.wind_speed.value) +
                current.wind_speed.units + " &nbsp &nbsp &nbsp &nbsp " +
                "Humidity @ " + Math.round(current.humidity.value) +
                current.humidity.units;

            wrapper.appendChild(now);
        }

        var Daily = document.createElement("div");
        Daily.classList.add("small", "bright", "daily");

        for (i = 0; i < forecast.length; i++) {
            var forecasts = forecast[i];

            var now = moment().format('YYYY-MM-DD');
            var aday = moment(forecasts.observation_time.value).format('ddd');
            var cday = moment(forecasts.observation_time.value).format('DD-MM-YYYY');
            var dday = forecasts.observation_time.value;
            var startdate = moment(current.observation_time.value).format("DD-MM-YYYY");
            var icon = "<img class = image src=modules/MMM-BMW-CC/icons/" + forecasts.weather_code.value + ".png>";
            var high = Math.round(forecasts.temp[1].max.value);
            var low = Math.round(forecasts.temp[0].min.value);
            var ftoday = "Today " + icon + " " + high + "/" + low + " &nbsp &nbsp &nbsp &nbsp &nbsp";
            var total = aday + " " + icon + " " + high + "/" + low + " &nbsp &nbsp &nbsp &nbsp &nbsp";
            var TotalDay = (startdate == cday) ? ftoday : total;
            Daily.innerHTML += TotalDay;
        }

        wrapper.appendChild(Daily);

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
        this.forecast = data
    },

    processCurrent: function(data) {
        this.current = data;
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
