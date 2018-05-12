'use strict';
class WeatherApp {
    // Constructo init
    constructor(temp, loc, icon, humidity, wind, direction, pressure, description) {
        this.APPID = '6c000acb4c2726dc146102c3dfb3b1e3';
        this.xhr = new XMLHttpRequest();
        this.lon = undefined;
        this.lat = undefined;
        this.temp = temp;
        this.loc = loc;
        this.icon = icon;
        this.humidity = humidity;
        this.wind = wind;
        this.direction = direction;
        this.pressure = pressure;
        this.description = description;
    };

    // Updating data method
    update(weather) {
        this.temp.innerHTML = weather.temp;
        this.loc.innerHTML = weather.loc;
        this.icon.innerHTML = 'img/' + weather.icon + '.png';
        this.humidity.innerHTML = weather.humidity;
        this.wind.innerHTML = weather.wind;
        this.direction.innerHTML = weather.direction;
        this.pressure.innerHTML = weather.pressure;
        this.description.innerHTML = weather.description;
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

    // Make a URL and send it
    updateByLocation(lat, lon) {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${this.APPID}&units=metric`;
        this.sendRequest(url);
    };

    // Getting the data from API and handling it
    sendRequest(url) {
        this.xhr.open('GET', url, true);
        this.xhr.onreadystatechange = () => {
            if(this.xhr.readyState == 4 && this.xhr.status == 200) {
                let data = JSON.parse(this.xhr.responseText);
                let weather = {};
                weather.humidity = data.main.humidity;
                weather.wind = data.wind.speed + ' meters/sec';
                weather.direction = data.wind.deg + ' degrees';
                weather.loc = data.name;
                weather.temp = data.main.temp;
                weather.pressure = data.main.pressure;
                weather.description = data.weather[0].description;

                // Update the data
                this.update(weather);
            }
        };
        this.xhr.send();
    };
};

const temp = document.querySelector('.temp'),
      loc = document.querySelector('.loc'),
      icon = document.querySelector('.icon'),
      humidity = document.querySelector('.humidity'),
      wind = document.querySelector('.wind'),
      direction = document.querySelector('.direction'),
      pressure = document.querySelector('.pressure'),
      description = document.querySelector('.description'),
      weatherapp = new WeatherApp(temp, loc, icon, humidity, wind, direction, pressure, description);

weatherapp.getCurrentPosition();