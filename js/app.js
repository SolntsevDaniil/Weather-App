'use strict';
class WeatherApp {
    // Constructor init
    constructor(temp, loc, humidity, wind, pressure, description, timestamp) {
        this.APPID = '6c000acb4c2726dc146102c3dfb3b1e3';
        this.xhr = new XMLHttpRequest();
        this.lon = undefined;
        this.lat = undefined;
        this.temp = temp;
        this.loc = loc;
        this.humidity = humidity;
        this.wind = wind;
        this.pressure = pressure;
        this.description = description;
        this.timestamp = timestamp;
    };

    timeConverter(UNIX_time) {
        let theDate = new Date(UNIX_time * 1000); 
        return theDate.toLocaleString(); 
    };

    // Updating data method
    update(weather) {
        this.temp.innerHTML = weather.temp;
        this.loc.innerHTML = weather.loc;
        this.humidity.innerHTML = weather.humidity;
        this.wind.innerHTML = weather.wind;
        this.pressure.innerHTML = weather.pressure;
        this.description.innerHTML = weather.description;
        this.timestamp.innerHTML = weather.timestamp;
    };

    // Make a URL and send it
    updateByLocation(lat, lon) {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${this.APPID}&units=metric`;
        this.sendRequest(url);
    };

    // Get posotion so as to know the weather
    getCurrentPosition() {
        // If navigator is available carry out the method
        if(navigator.geolocation) {
            // Position
            navigator.geolocation.getCurrentPosition((position) => {
                this.lon = position.coords.longitude;
                this.lat = position.coords.latitude;

                this.updateByLocation(this.lat, this.lon);
            
            // If user declined the geolocation show the error
            }, function(error) {
                if(error.code == error.PERMISSION_DENIED) { alert('Can not get current position. Please, enable the Geolocation'); }
            });
        // If navigator is unavailable show the error
        } else { alert('Can not get current position, something went wrong'); };
    };

    // Getting the data from API and handling it
    sendRequest(url) {
        this.xhr.open('GET', url, true);
        this.xhr.onreadystatechange = () => {
            if(this.xhr.readyState == 4 && this.xhr.status == 200) {
                let data = JSON.parse(this.xhr.responseText),
                    weather = {},
                    pressure = data.main.pressure * 0.750062;

                weather.humidity = '<span class="bold">' + data.main.humidity + '</span>%';
                weather.wind = '<span class="bold">' +  data.wind.speed + '</span> meters/sec';
                weather.loc = data.name;
                weather.temp = data.main.temp + '°C';
                weather.pressure = '<span class="bold">' + pressure.toFixed(2) + '</span> mm';
                weather.description = data.weather[0].description;
                weather.timestamp = this.timeConverter(data.dt);

                // Update the data
                this.update(weather);
            }
        };
        this.xhr.send();
    };
};

const temp = document.querySelector('.weather__temp'),
      loc = document.querySelector('.header__title'),
      humidity = document.querySelector('.weather__humidity'),
      wind = document.querySelector('.weather__wind'),
      pressure = document.querySelector('.weather__pressure'),
      description = document.querySelector('.weather__description'),
      timestamp = document.querySelector('.weather__time'),
      weatherapp = new WeatherApp(temp, loc, humidity, wind, pressure, description, timestamp);

weatherapp.getCurrentPosition();