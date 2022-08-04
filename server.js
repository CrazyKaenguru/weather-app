const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

// Configure dotenv package

require("dotenv").config();

const apiKey = `${process.env.API_KEY}`;

// Setup your express app and body-parser configurations
// Setup your javascript template view engine
// we will serve your static pages from the public directory, it will act as your root directory
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("index", { weather: null, error: null });
});

app.get("/forecast",function(req,res){

});
app.post("/weather", function (req, res) {
  console.log(req.body)
  let city = req.body.city;
 
  let geourl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${req.body.lat}&lon=${req.body.lon}&appid=${apiKey}`;
  request(geourl, function (err, response, geobody) {
    if (city == undefined) {

      city = JSON.parse(geobody)[0].name;
    }
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    request(url, function (err, response, body) {
      if (err) {
        console.log("the error is"+err)
        res.render("index", {
          weather: null,
          error: "Error, please try again",
        });
      } else {
        let forecasturl=`http://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=4&appid=ff45b3813adda031c90088df092030e9`
        request(forecasturl, function (err, response, forecastbody) {
          let forecast=JSON.parse(forecastbody)
          //console.log(forecast.list[0].dt_txt)
        
       console.log(forecast)
        let weather = JSON.parse(body);
         
        if (weather.main == undefined) {
          console.log("the error is"+err)
          res.render("index", {
            weather: null,
            error: "Error, please try again",
          });
        } else {
          // we shall use the data got to set up your output
          let place = `${weather.name}, ${weather.sys.country}`,
            /* you shall calculate the current timezone using the data fetched*/
            weatherTimezone = `${new Date(
              weather.dt * 1000 - weather.timezone * 1000
            )}`;
          let weatherTemp = `${weather.main.temp}`,
            weatherPressure = `${weather.main.pressure}`,
            time_1=(forecast.list[0].dt_txt).split(" ").pop(),
            time_2=(forecast.list[1].dt_txt).split(" ").pop(),
            time_3=(forecast.list[2].dt_txt).split(" ").pop(),
            time_4=(forecast.list[3].dt_txt).split(" ").pop(),
            time_1_weather_description=forecast.list[0].weather[0].description,
            time_2_weather_description=forecast.list[1].weather[0].description,
            time_3_weather_description=forecast.list[2].weather[0].description,
            time_4_weather_description=forecast.list[3].weather[0].description,
            time_1_weather_icon=forecast.list[0].weather[0].icon,
            time_2_weather_icon=forecast.list[1].weather[0].icon,
            time_3_weather_icon=forecast.list[1].weather[0].icon,
            time_4_weather_icon=forecast.list[1].weather[0].icon,
           // time_3_weather_icon=forecast.list[2].weather[0].description,
           // time_4_weather_icon=forecast.list[3].weather[0].description,
            
            /* you will fetch the weather icon and its size using the icon data*/
            weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            weatherDescription = `${weather.weather[0].description}`,
            humidity = `${weather.main.humidity}`,
            clouds = `${weather.clouds.all}`,
            visibility = `${weather.visibility}`,
            main = `${weather.weather[0].main}`,
            weatherFahrenheit;
          weatherFahrenheit = (weatherTemp * 9) / 5 + 32;
          
          // you shall also round off the value of the degrees fahrenheit calculated into two decimal places
          function roundToTwo(num) {
            return +(Math.round(num + "e+2") + "e-2");
          }
          weatherFahrenheit = roundToTwo(weatherFahrenheit);
          res.render("index", {
            weather: weather,
            place: place,
            temp: weatherTemp,
            pressure: weatherPressure,
            icon: weatherIcon,
            description: weatherDescription,
            timezone: weatherTimezone,
            humidity: humidity,
            fahrenheit: weatherFahrenheit,
            clouds: clouds,
            visibility: visibility,
            main: main,
            time_1:time_1,
            time_2:time_2,
            time_3:time_3,
            time_4:time_4,
            time_1_weather_description:time_1_weather_description,
            time_2_weather_description:time_2_weather_description,
            time_3_weather_description:time_3_weather_description,
            time_4_weather_description:time_4_weather_description,
            time_1_weather_icon:time_1_weather_icon,
            time_2_weather_icon:time_2_weather_icon,
            time_3_weather_icon:time_3_weather_icon,
            time_4_weather_icon:time_4_weather_icon,
            error: null,
          });
          
        }
      });
      }
    });
    
  });
});

app.listen(process.env.PORT||5000 , function () {
  console.log("Weather app listening on port 5000!");
});
