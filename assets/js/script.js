//section:query selector variables go here 👇
let citySelectionButton = document.getElementById("button-wrapper");
let cityInput = document.getElementById("city-search-input-text");
// let citySelected = document.getElementById('citySelected').textContent;

//section:global variables go here 👇

//section:event listeners go here 👇
citySelectionButton.addEventListener("click", handleCityInput);

//section:functions and event handlers go here 👇
window.onload = function () {
  cityInput.focus();
  let defaultSearchCity = "boulder, co";
  handleCityInput(event, "boulder, co", "Boulder, CO");
};

function handleCityInput(event, defaultSearchCity, defaultDisplayCity) {
  let input = getCityInput(event, defaultSearchCity, defaultDisplayCity);
  getWeatherData(input.citySelected, input.cityRendered);
}

function getCityInput(event, defaultSearchCity, defaultDisplayCity) {
  let citySelected = "";
  let cityRendered = "";
  let buttonText = event.target.textContent;

  if (defaultSearchCity) {
    console.log("default");
    citySelected = defaultSearchCity;
    cityRendered = defaultDisplayCity;
  } else if (
    event.target.matches("button") &&
    buttonText.trim() === "Search" &&
    cityInput.value
  ) {
    console.log("button & valid input");
    console.log(
      event.target.matches("button"),
      buttonText.trim() === "Search",
      cityInput.value
    );

    citySelected = cityInput.value.trim().toLowerCase();
    cityRendered = cityInput.value.trim();
    cityInput.value = "";
    cityInput.focus();
  } else if (
    event.target.matches("button") &&
    buttonText.trim() !== "Search" &&
    !cityInput.value
  ) {
    console.log("button & invalid input");

    citySelected = buttonText.trim().toLowerCase();
    cityRendered = buttonText.trim();
    // cityInput.focus();
  }

  console.log(
    defaultSearchCity,
    "|",
    defaultDisplayCity,
    "|",
    citySelected,
    "|",
    cityRendered,
    "|",
    cityInput.value,
    "|",
    buttonText
  );

  return { citySelected, cityRendered };
}

function getWeatherData(citySelected, cityRendered) {
  //GET WEATHER FROM API
  if (!citySelected) {
    alert("Input City, ZipCode or Select City"); //todo:change to model
    cityInput.focus();
    return;
  } else if (cityStateList.includes(cityRendered)) {
    fetchLatitudeLongitude(citySelected, cityRendered);
  } else {
    let zipCode = citySelected;
    fetchLatitudeLongitude(zipCode, "", "zipCode");
  }
}

// API CALLS TO OPEN WEATHER
function fetchLatitudeLongitude(
  cityStateSelectedOrZipCode,
  cityRendered,
  urlSelector
) {
  let urlLatitudeLongitude = "";
  let latitude = "";
  let longitude = "";

  urlSelector === "zipCode"
    ? (urlLatitudeLongitude = `http://api.openweathermap.org/geo/1.0/zip?zip=${cityStateSelectedOrZipCode}&appid=f0bed1b0eff80d425a392e66c50eb063`)
    : (urlLatitudeLongitude = `http://api.openweathermap.org/geo/1.0/direct?q=${cityStateSelectedOrZipCode},us&limit=1&appid=f0bed1b0eff80d425a392e66c50eb063`);

  fetch(urlLatitudeLongitude)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      !data[0] ? (latitude = data.lat) : (latitude = data[0].lat);
      !data[0] ? (longitude = data.lon) : (longitude = data[0].lon);
      cityRendered = cityRendered || data.name;
      fetchWeatherData(latitude, longitude, cityRendered);
    });
}

function fetchWeatherData(latitude, longitude, cityRendered) {
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;

  fetch(currentWeatherURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderWeather(data, cityRendered);
    });
}

// RENDER WEATHER DATA
// function renderWeather(data, currentOrFuture) {
function renderWeather({ current, daily }, cityRendered) {
  // console.log(current, daily, cityRendered);

  // combineCurrentDaily
  let combined = [];
  combined.push(current);
  for (let i = 0; i < 5; i++) {
    combined.push(daily[i])
  }

  renderCurrentWeather(combined, cityRendered);
  renderForecastWeather(combined,cityRendered);
}

function renderCurrentWeather(combined, cityRendered) {
  let currentWeather = document.getElementById("current-weather");
  currentWeather.textContent = "";

  //create element
  let cityName = document.createElement("h3");
  let icon = document.createElement("img");
  let temp = document.createElement("p");
  let windSpeed = document.createElement("p");
  let humidity = document.createElement("p");
  let uvIndex = document.createElement("p");

  //create dateTime
  let dateTime = moment.unix(combined[0].dt).format("dddd, M/D/YYYY");

  //add class
  let cardTextClasses = ("card-text", "mb-2")
  cityName.classList.add("card-title", "mb-1");
  temp.classList.add(cardTextClasses);
  windSpeed.classList.add(cardTextClasses);
  humidity.classList.add(cardTextClasses);
  uvIndex.classList.add(cardTextClasses);

  //add content
  cityName.textContent = `${cityRendered} (${dateTime})`;
  icon.setAttribute(
  "src",
  `https://openweathermap.org/img/w/${combined[0].weather[0].icon}.png`
  );
  temp.textContent = `Temp: ${Math.round(combined[0].temp)}℉`;
  windSpeed.textContent = `Wind: ${Math.round(combined[0].wind_speed)} MPH`;
  humidity.textContent = `Humidity: ${combined[0].humidity}%`;
  uvIndex.textContent = `UV Index: ${combined[0].uvi}`;

  //append element
  currentWeather.append(cityName, temp, windSpeed, humidity, uvIndex);
  cityName.append(icon);
}

function renderForecastWeather(combined, cityRendered) {
  let forecastWeather = document.getElementById("forecast-weather");
  forecastWeather.textContent = "";

  for (let i = 1; i < 6; i++) {
    //create element
    let cardBody = document.createElement('div');
    let cardTitle = document.createElement("h6", "bold"); //date
    let icon = document.createElement("img");
    let temp = document.createElement("p");
    let windSpeed = document.createElement("p");
    let humidity = document.createElement("p");
    let uvIndex = document.createElement("p");
  
    //create dateTime
    let dateTime = moment.unix(combined[i].dt).format("dddd, M/D");
    // console.log(dateTime)
  
    //add class
    cardBody.classList.add("card-body", "col-12", "col-md-5", "col-lg-2", "mb-3", "p-3", "text-white", "custom-weather-card");
    cardTitle.classList.add("card-title", "m-0", "font-weight-bold");
    temp.classList.add("card-text");
    windSpeed.classList.add("card-text");
    humidity.classList.add("card-text");
    // uvIndex.classList.add("card-text");
  
    //add content
    cardTitle.textContent = `${dateTime}`;
    icon.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${combined[i].weather[0].icon}.png`
    );
    temp.textContent = `Temp: ${Math.round(combined[i].temp.day)}℉`;
    windSpeed.textContent = `Wind: ${Math.round(combined[i].wind_speed)} MPH`;
    humidity.textContent = `Humidity: ${combined[i].humidity}%`;
    // uvIndex.textContent = `UV Index: ${combined[i].uvi}`;
  
    //append element
    forecastWeather.append(cardBody);
    cardBody.append(cardTitle, icon, temp, windSpeed, humidity, uvIndex);
  }
}

