//section:query selector variables go here 👇
let citySelectionButton = document.getElementById('button-wrapper');
let cityInputSearchText = document.getElementById('city-search-input-text');
// let citySelected = document.getElementById('citySelected').textContent;

//section:global variables go here 👇

//section:event listeners go here 👇
citySelectionButton.addEventListener('click', getWeatherData);
// cityInputSearchText.addEventListener('input', function() {
//   console.log(cityInputSearchText.value)
// })

//section:functions and event handlers go here 👇

function getWeatherData(event) {
  //get city selected
  if (event.target.matches('button')) {
    let selectedCity = getcitySelected(event);
    //fetch current weather
    let currentWeather = getCurrentWeather(selectedCity);
    //fetch forecast
    //render current weather
    // console.log(currentWeather);
    //render forecast
    //clear current weather & forecast on next request
  }
}

// GET CITY INPUT

function getcitySelected(event) {
  let citySelected = event.target.textContent.trim().toLowerCase();
  citySelected === 'search' ? citySelected = cityInputSearchText.value.trim().toLowerCase() : citySelected;

  citiesUSOnly.filter(element => {
    // console.log(citySelected, element.name, citySelected === element.name);
    if (citySelected === element.name.toLowerCase()) {console.log(citySelected, element.name.toLowerCase(), element.state, citySelected === element.name.toLowerCase());};
    // console.log(element.name, element.state, element.coord.lon, element.coord.lat)
  })

  return citySelected;
}

// RENDER WEATHER DATA
// function renderWeather(data, currentOrFuture) {
function renderWeather(data, currentOrFuture) {
  // console.log(data, currentOrFuture);
  // console.log(data.dt, data.name, data.weather[0].description, data.weather[0].icon, data.main.temp, data.main.humidity, data.wind.speed)

  let currentWeather = document.getElementById('current-weather');
  currentWeather.textContent = "";

  //create element
  let cityName = document.createElement('h5');
  let dateTime = moment.unix(data.dt).format('YYYY-MM-DD');
  let icon = document.createElement('img');
  let temp = document.createElement('p');
  let windSpeed = document.createElement('p');
  let humidity = document.createElement('p');
  let uvIndex = document.createElement('p');

  //add class
  cityName.classList.add('card-text');
  temp.classList.add('card-text');
  windSpeed.classList.add('card-text');
  humidity.classList.add('card-text');
  uvIndex.classList.add('card-text');

  //add content
  cityName.textContent = `${data.name} (${dateTime})`;
  temp.textContent = `TEMP: ${data.main.temp} ℉`;
  windSpeed.textContent = `WIND SPEED: ${data.wind.speed} MPH`;
  humidity.textContent = `HUMIDITY: ${data.main.humidity}`;
  uvIndex.textContent = `UV INDEX: TBD`;
  icon.setAttribute('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);

  //append element
  currentWeather.append(cityName, temp, windSpeed, humidity, uvIndex);
  cityName.append(icon);

}

// WEATHER API CALLS TO OPENWEATHER
function getCurrentWeather(cityName) {
  // console.log('api call = ', cityName)
  // let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},co,us&APPID=f0bed1b0eff80d425a392e66c50eb063&units=imperial`;
  // fetch(currentWeatherURL)
  // .then(response => response.json())
  // .then(data => renderWeather(data, 'current'));

  return renderWeather(currentWeather);
}

function getForecastWeather(cityName) {
  let forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},co,us&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial`;
  fetch(forecastWeatherURL)
  .then(response => response.json())
  .then(data => console.log(data));
}


// CREATE LIST OF CITY/STATES
// let nameState = citiesUSOnly.map(({name, state}) => (`${name}, ${state}`),[]);
// console.log(nameState);
