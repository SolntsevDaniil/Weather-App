'use strict';
class WeatherApp {
    constructor(temp, loc, icon, humidity, wind, direction, pressure) {
        this.APPID = '6c000acb4c2726dc146102c3dfb3b1e3';
        this.xhr = new XMLHttpRequest();
        this.temp = temp;
        this.loc = loc;
        this.icon = icon;
        this.humidity = humidity;
        this.wind = wind;
        this.direction = direction;
        this.pressure = pressure;
    };

    update(weather) {
        this.temp.innerHTML = weather.temp;
        this.loc.innerHTML = weather.loc;
        this.icon.innerHTML = 'img/' + weather.icon + '.png';
        this.humidity.innerHTML = weather.humidity;
        this.wind.innerHTML = weather.wind;
        this.direction.innerHTML = weather.direction;
        this.pressure.innerHTML = weather.pressure;
    };

    updateByZip(zip) {
        let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + zip + '&APPID=' + this.APPID + '&units=metric';
        this.sendRequest(url);
    };

    sendRequest(url) {
        this.xhr.open('GET', url, true);
        this.xhr.onreadystatechange = () => {
            if(this.xhr.readyState == 4 && this.xhr.status == 200) {
                let data = JSON.parse(this.xhr.responseText);
                let weather = {};
                // weather.icon = data.weather.id;
                weather.humidity = data.main.humidity;
                weather.wind = data.wind.speed + ' meters/sec';
                weather.direction = this.degreesToDirection(data.wind.deg);
                weather.loc = data.name;
                weather.temp = data.main.temp;
                weather.pressure = data.main.pressure;
                this.update(weather);
            }
        };
        this.xhr.send();
    };

    degreesToDirection(degrees) {
        let range = 360/16,
            low = 360 - range / 2,
            high = (low + range) % 360,
            i = 60,
            angles = ['N', 'NNE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW',, 'NNW'];
        for(i in angles) {
            if(degrees >= low && degrees < high) {
                return angles[i];

                low = (low + range) % 360;
                high = (high + range) % 360;
            }
        }
        return 'N';
    };
};

const temp = document.querySelector('.temp'),
      loc = document.querySelector('.loc'),
      icon = document.querySelector('.icon'),
      humidity = document.querySelector('.humidity'),
      wind = document.querySelector('.wind'),
      direction = document.querySelector('.direction'),
      pressure = document.querySelector('.pressure'),
      weatherapp = new WeatherApp(temp, loc, icon, humidity, wind, direction, pressure);

weatherapp.updateByZip(109202);