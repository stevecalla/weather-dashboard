//section:query selector variables go here 👇
let citySelectionButton = document.getElementById('button-wrapper');
let cityInputSearchText = document.getElementById('city-search-input-text');
// let citySelected = document.getElementById('citySelected').textContent;

//section:global variables go here 👇

//section:event listeners go here 👇
citySelectionButton.addEventListener('click', getWeatherData);


//section:functions and event handlers go here 👇
window.onload = function() {
  let defaultLocation = "boulder, co";
  getWeatherData(event, "boulder, co", "Boulder, CO");
};

function getWeatherData(event, defaultLocation, displayLocation) {
  //get city selected
  if (defaultLocation) {
    getCurrentWeather(weather.lat, weather.lon, displayLocation)
  } else if (event.target.matches('button')) {
     let selectedCity = getcitySelected(event) || defaultLocation;
     console.log(selectedCity, selectedCity.displayCity)

    //fetch lat/lon
    getGeoCoordinates(selectedCity.citySelected, selectedCity.displayCity);

    //  getZipCodeInfo('80301');
   }
}

// GET CITY INPUT
function getcitySelected(event) {
  let displayCity = event.target.textContent.trim();
  let citySelected = event.target.textContent.trim().toLowerCase();
  citySelected === 'search' ? (
    citySelected = cityInputSearchText.value.trim().toLowerCase(),
    displayCity = cityInputSearchText.value.trim()) 
    : 
    citySelected;
  return {citySelected, displayCity};
}

// RENDER WEATHER DATA
// function renderWeather(data, currentOrFuture) {
function renderCurrentWeather({current, daily}, displayCity) {
  console.log(current, daily, displayCity);

  let currentWeather = document.getElementById('current-weather');
  currentWeather.textContent = "";

  //create element
  let cityName = document.createElement('h5');
  let icon = document.createElement('img');
  let temp = document.createElement('p');
  let windSpeed = document.createElement('p');
  let humidity = document.createElement('p');
  let uvIndex = document.createElement('p');
  
  //add class
  cityName.classList.add('card-title');
  temp.classList.add('card-text');
  windSpeed.classList.add('card-text');
  humidity.classList.add('card-text');
  uvIndex.classList.add('card-text');
  
  //add content
  let dateTime = moment.unix(current.dt).format('YYYY-MM-DD');
  cityName.textContent = `${displayCity} (${dateTime})`;
  temp.textContent = `TEMP: ${Math.round(current.temp)}℉`;
  windSpeed.textContent = `WIND SPEED: ${Math.round(current.wind_speed)} MPH`;
  humidity.textContent = `HUMIDITY: ${current.humidity}`;
  uvIndex.textContent = `UV INDEX: ${current.uvi}`;
  icon.setAttribute('src', `https://openweathermap.org/img/w/${current.weather[0].icon}.png`);

  //append element
  currentWeather.append(cityName, temp, windSpeed, humidity, uvIndex);
  cityName.append(icon);

}

// WEATHER API CALLS TO OPENWEATHER
function getGeoCoordinates(cityState, displayCity) {
  console.log(displayCity)
  let geoCoordinatesURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityState},us&limit=1&appid=f0bed1b0eff80d425a392e66c50eb063`;

  fetch(geoCoordinatesURL)
    .then(response => response.json())
    .then(data => {
      let latitude = data[0].lat;
      let longitude = data[0].lon;
      getCurrentWeather(latitude, longitude, displayCity);
      // return {latitude, longitude};
    })
  }

function getCurrentWeather(latitude, longitude, displayCity) {
  // let currentWeather;
  console.log(displayCity)
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly, minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;
  fetch(currentWeatherURL)
  .then(response => response.json())
  // .then(data => renderCurrentWeather(data, displayCity));
  .then(data => {
    console.log(displayCity);
    renderCurrentWeather(data, displayCity);
  })
}

function getZipCodeInfo(zipCode) {
  // let zipCodeURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=f0bed1b0eff80d425a392e66c50eb063`;

  // fetch(zipCodeURL)
  //   .then(response => response.json())
  //   .then(data => console.log(data, data.lat, data.lon));
}

// CREATE LIST OF CITY/STATES
// let nameState = citiesUSOnly.map(({name, state}) => (`${name}, ${state}`),[]);
// console.log(nameState);
