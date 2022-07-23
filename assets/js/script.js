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
      console.log(data);
      !data[0] ? (latitude = data.lat) : (latitude = data[0].lat);
      !data[0] ? (longitude = data.lon) : (longitude = data[0].lon);
      cityRendered = cityRendered || data.name;
      fetchWeatherData(latitude, longitude, cityRendered);
    });
}

function fetchWeatherData(latitude, longitude, cityRendered) {
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly, minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;

  fetch(currentWeatherURL)
    .then((response) => response.json())
    .then((data) => {
      renderCurrentWeather(data, cityRendered);
    });
}

// RENDER WEATHER DATA
// function renderWeather(data, currentOrFuture) {
function renderCurrentWeather({ current, daily }, cityRendered) {
  // console.log(current, daily, cityRendered);

  let currentWeather = document.getElementById("current-weather");
  currentWeather.textContent = "";

  //create element
  let cityName = document.createElement("h5");
  let icon = document.createElement("img");
  let temp = document.createElement("p");
  let windSpeed = document.createElement("p");
  let humidity = document.createElement("p");
  let uvIndex = document.createElement("p");

  //add class
  cityName.classList.add("card-title");
  temp.classList.add("card-text");
  windSpeed.classList.add("card-text");
  humidity.classList.add("card-text");
  uvIndex.classList.add("card-text");

  //add content
  let dateTime = moment.unix(current.dt).format("YYYY-MM-DD");
  cityName.textContent = `${cityRendered} (${dateTime})`;
  temp.textContent = `TEMP: ${Math.round(current.temp)}℉`;
  windSpeed.textContent = `WIND SPEED: ${Math.round(current.wind_speed)} MPH`;
  humidity.textContent = `HUMIDITY: ${current.humidity}`;
  uvIndex.textContent = `UV INDEX: ${current.uvi}`;
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${current.weather[0].icon}.png`
  );

  //append element
  currentWeather.append(cityName, temp, windSpeed, humidity, uvIndex);
  cityName.append(icon);
}
