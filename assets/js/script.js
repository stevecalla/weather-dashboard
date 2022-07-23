//section:query selector variables go here 👇
let citySelectionButton = document.getElementById('button-wrapper');
let cityInput = document.getElementById('city-search-input-text');
// let citySelected = document.getElementById('citySelected').textContent;

//section:global variables go here 👇

//section:event listeners go here 👇
citySelectionButton.addEventListener('click', getWeatherData);


//section:functions and event handlers go here 👇
window.onload = function() {
  let defaultSearchCity = "boulder, co";
  getWeatherData(event, "boulder, co", "Boulder, CO");
};

function getWeatherData(event, defaultSearchCity, defaultDisplayCity) {
  let citySelected = "";
  let cityRendered = "";
  let buttonText = event.target.textContent;


  //GET CITY INPUT
  if (defaultSearchCity) {
    console.log('default');
    citySelected = defaultSearchCity;
    cityRendered = defaultDisplayCity;

    // getCurrentWeather(weather.lat, weather.lon, defaultDisplayCity);

  } else if (event.target.matches('button') && buttonText.trim() === 'Search' && cityInput.value) {
    console.log('button & valid input');
    console.log(event.target.matches('button'), buttonText.trim() === 'Search', cityInput.value)

    citySelected = cityInput.value.trim().toLowerCase();
    cityRendered = cityInput.value.trim();
    cityInput.value = '';
    cityInput.focus();

  } else if (event.target.matches('button') && buttonText.trim() !== 'Search' && !cityInput.value) {
    console.log('button & invalid input');

    citySelected = buttonText.trim().toLowerCase();
    cityRendered = buttonText.trim();
    // cityInput.focus();

  }

  console.log(defaultSearchCity, '|', defaultDisplayCity, '|', citySelected, '|', cityRendered, '|', cityInput.value, '|', buttonText)
  
  //GET WEATHER FROM API
  // if (defaultSearchCity) {
  //   getCurrentWeather(weather.lat, weather.lon, defaultDisplayCity);
  //   return;
  if (!citySelected) {
    alert('Input City, ZipCode or Select City');
    cityInput.focus();
    return;
  } else if (cityStateList.includes(cityRendered)) {
    getGeoCoordinates(citySelected, cityRendered);
  } else {
    getZipCodeInfo(citySelected);
  }

}

// RENDER WEATHER DATA
// function renderWeather(data, currentOrFuture) {
function renderCurrentWeather({current, daily}, cityRendered) {
  // console.log(current, daily, cityRendered);

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
  cityName.textContent = `${cityRendered} (${dateTime})`;
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
function getGeoCoordinates(cityState, cityRendered) {
  console.log(cityState, cityRendered)
  let geoCoordinatesURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityState},us&limit=1&appid=f0bed1b0eff80d425a392e66c50eb063`;

  // console.log(!cityState);
    fetch(geoCoordinatesURL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let latitude = data[0].lat;
        let longitude = data[0].lon;
        getCurrentWeather(latitude, longitude, cityRendered);
        // return {latitude, longitude};
      })
      }

function getCurrentWeather(latitude, longitude, cityRendered) {
  // let currentWeather;
  // console.log(cityRendered)
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly, minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;
  fetch(currentWeatherURL)
  .then(response => response.json())
  // .then(data => renderCurrentWeather(data, cityRendered));
  .then(data => {
    // console.log(cityRendered);
    renderCurrentWeather(data, cityRendered);
  })
}

function getZipCodeInfo(zipCode) {
  let zipCodeURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=f0bed1b0eff80d425a392e66c50eb063`;

  // console.log(zipCode)
    fetch(zipCodeURL)
      .then(response => response.json())
      .then(data => {
        let latitude = data.lat;
        let longitude = data.lon;
        let cityRendered = data.name;
        getCurrentWeather(latitude, longitude, cityRendered);
        // return {latitude, longitude};
      })
      // .then(data => console.log(data, data.lat, data.lon));

}

// CREATE LIST OF CITY/STATES
// let nameState = citiesUSOnly.map(({name, state}) => (`${name}, ${state}`),[]);
// console.log(nameState);
