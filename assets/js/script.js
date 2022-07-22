//section:query selector variables go here 👇

//section:global variables go here 👇

//section:event listeners go here 👇

//section:functions and event handlers go here 👇
console.log('hello')




function getCurrentWeather(cityName) {
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},co,us&APPID=f0bed1b0eff80d425a392e66c50eb063&units=imperial`;
  fetch(currentWeatherURL)
  .then(response => response.json())
  .then(data => console.log(data));
}

function getForecastWeather(cityName) {
  let forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},co,us&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial`;
  fetch(forecastWeatherURL)
  .then(response => response.json())
  .then(data => console.log(data));
}



