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
  // console.log(event.target);
  let input = getCityInput(event, defaultSearchCity, defaultDisplayCity);
  getWeatherData(event, input.citySelected, input.cityRendered);
  // renderSearchHistory(input.cityRendered);
}

function getCityInput(event, defaultSearchCity, defaultDisplayCity) {
  let citySelected = "";
  let cityRendered = "";
  let buttonText = event.target.textContent;

  if (defaultSearchCity) {
    citySelected = defaultSearchCity;
    cityRendered = defaultDisplayCity;
  } else if (
    event.target.matches("button") &&
    buttonText.trim() === "Search" &&
    cityInput.value
  ) {
    citySelected = cityInput.value.trim().toLowerCase();
    cityRendered = cityInput.value.trim();
    cityInput.value = "";
    cityInput.focus();
  } else if (
    event.target.matches("button") &&
    buttonText.trim() !== "Search" &&
    !cityInput.value
  ) {
    citySelected = buttonText.substr(0, 45).trim().toLowerCase();
    cityRendered = buttonText.substr(0, 45).trim();
  }
  return { citySelected, cityRendered };
}

function getWeatherData(event, citySelected, cityRendered) {
  //GET WEATHER FROM API
  // console.log(event.target, citySelected, cityRendered);
  // console.log(!citySelected);

  if (!citySelected && event.target.textContent === "Search") {
    alert("Input City, ZipCode or Select City"); //todo:change to model
    cityInput.focus();
    return;
  } else if (cityStateList.includes(cityRendered)) {
    // fetchLatitudeLongitude(citySelected, cityRendered);
    renderSpinnerDuringAPICall();
  } else if (citySelected) {
    let zipCode = citySelected;
    // fetchLatitudeLongitude(zipCode, "", "zipCode");
    renderSpinnerDuringAPICall();
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

  fetch(urlLatitudeLongitude, {
    // cache: "reload"
    cache: "default",
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      !data[0] ? (latitude = data.lat) : (latitude = data[0].lat);
      !data[0] ? (longitude = data.lon) : (longitude = data[0].lon);
      cityRendered = cityRendered || data.name;
      // fetchWeatherData(latitude, longitude, cityRendered);
    });
}

function fetchWeatherData(latitude, longitude, cityRendered) {
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;

  fetch(currentWeatherURL, {
    // cache: "reload"
    cache: "default",
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      renderWeather(data, cityRendered);
    });
}

// RENDER WEATHER DATA
function renderWeather({ daily }, cityRendered) {
  renderCurrentWeather(daily, cityRendered);
  renderForecastWeather(daily, cityRendered);
}

function renderCurrentWeather(daily, cityRendered) {
  let currentWeather = document.getElementById("current-weather");
  currentWeather.textContent = "";

  //create element
  let cardTitle = document.createElement("h3");
  let icon = document.createElement("img");
  let temp = document.createElement("p");
  let windSpeed = document.createElement("p");
  let humidity = document.createElement("p");
  let uvIndexElement = document.createElement("p");
  let uvIndexSpan = document.createElement("span");

  //declear dateTime
  let dateTime = moment.unix(daily[0].dt).format("dddd, M/D/YYYY");
  // console.log(daily[0].weather[0].description)

  //add classes
  let cardTextClasses = ("card-text", "mb-2");
  cardTitle.classList.add("card-title", "mb-1");
  icon.setAttribute("data-toggle", "tooltip");
  icon.setAttribute("data-placement", "top");
  icon.setAttribute("title", `${daily[0].weather[0].description}`);
  temp.classList.add(cardTextClasses);
  windSpeed.classList.add(cardTextClasses);
  humidity.classList.add(cardTextClasses);
  uvIndexElement.classList.add(cardTextClasses);
  uvIndexSpan.classList.add("uv-index-background", "p-1", "px-2");

  //add content
  cardTitle.textContent = `${cityRendered} (${dateTime})`;
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${daily[0].weather[0].icon}.png`
  );
  temp.textContent = `Temp: ${Math.round(daily[0].temp.day)}℉`;
  windSpeed.textContent = `Wind: ${Math.round(daily[0].wind_speed)} MPH`;
  humidity.textContent = `Humidity: ${daily[0].humidity}%`;
  uvIndexElement.textContent = `UV Index: `;
  uvIndexSpan.textContent = `${daily[0].uvi}`;

  //add styling
  renderUVIndexStying(daily[0].uvi, uvIndexSpan);

  //append element
  currentWeather.append(cardTitle, temp, windSpeed, humidity, uvIndexElement);
  cardTitle.append(icon);
  uvIndexElement.append(uvIndexSpan);
}

function renderForecastWeather(daily) {
  let forecastWeather = document.getElementById("forecast-weather");
  forecastWeather.textContent = "";

  for (let i = 1; i < 6; i++) {
    //create element
    let cardBody = document.createElement("div");
    let cardTitle = document.createElement("h6", "bold"); //date
    let icon = document.createElement("img");
    let temp = document.createElement("p");
    let windSpeed = document.createElement("p");
    let humidity = document.createElement("p");
    let uvIndex = document.createElement("p");

    //create dateTime
    let dateTime = moment.unix(daily[i].dt).format("dddd, M/D");
    // console.log(dateTime)

    //add classes
    cardBody.classList.add(
      "card-body",
      "col-12",
      "col-md-5",
      "col-lg-2",
      "mb-3",
      "p-3",
      "text-white",
      "custom-weather-card"
    );
    cardTitle.classList.add("card-title", "m-0", "font-weight-bold");
    icon.setAttribute(
      "data-toggle",
      "tooltip",
      "data-placement",
      "top",
      "title",
      "Tooltip on top"
    );
    icon.setAttribute("data-placement", "top");
    icon.setAttribute("title", `${daily[i].weather[0].description}`);
    temp.classList.add("card-text");
    windSpeed.classList.add("card-text");
    humidity.classList.add("card-text");

    //add content
    cardTitle.textContent = `${dateTime}`;
    icon.setAttribute(
      "src",
      `https://openweathermap.org/img/w/${daily[i].weather[0].icon}.png`
    );
    temp.textContent = `Temp: ${Math.round(daily[i].temp.day)}℉`;
    windSpeed.textContent = `Wind: ${Math.round(daily[i].wind_speed)} MPH`;
    humidity.textContent = `Humidity: ${daily[i].humidity}%`;

    //append element
    forecastWeather.append(cardBody);
    cardBody.append(cardTitle, icon, temp, windSpeed, humidity, uvIndex);
  }
}

function renderUVIndexStying(uvIndex, uvIndexSpan) {
  uvIndexSpan.style.color = "white";
  uvIndexSpan.setAttribute("data-toggle", "tooltip");
  uvIndexSpan.setAttribute("data-placement", "top");

  if ((uvIndex >= 0) & (uvIndex < 3)) {
    uvIndexSpan.style.backgroundColor = "green";
    uvIndexSpan.setAttribute("title", `Low Risk`);
  } else if ((uvIndex >= 3) & (uvIndex < 6)) {
    uvIndexSpan.style.backgroundColor = "yellow";
    uvIndexSpan.setAttribute("title", `Moderate Risk`);
  } else if ((uvIndex >= 6) & (uvIndex < 8)) {
    uvIndexSpan.style.backgroundColor = "orange";
    uvIndexSpan.setAttribute("title", `High Risk`);
  } else if ((uvIndex >= 8) & (uvIndex < 11)) {
    uvIndexSpan.style.backgroundColor = "red";
    uvIndexSpan.setAttribute("title", `Very High Risk`);
  } else {
    uvIndexSpan.style.backgroundColor = "purple";
    uvIndexSpan.setAttribute("title", `Extreme Risk`);
  }
}

//RENDER SEARCH HISTORY
function renderSearchHistory(citySearched) {
  //create array with history
  let searchHistory =
    JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

  //if array includes don't add again
  searchHistory.includes(citySearched)
    ? console.log("includes")
    : searchHistory.push(citySearched);
  console.log("not-sorted", searchHistory);

  //sort array
  searchHistory = sortByCity(searchHistory);
  console.log("sorted = ", searchHistory);

  let customSearchHistory = document.getElementById("custom-search-history");
  customSearchHistory.textContent = "";

  searchHistory.forEach((element) => {
    //create anchor
    // clear textcontent

    // create Element
    let searchHistoryButton = document.createElement("button");

    // add textcontent
    searchHistoryButton.textContent = `${element.trim()}`;

    // add classes
    searchHistoryButton.classList.add(
      "btn",
      "btn-secondary",
      "btn-lg",
      "w-100",
      "ml-0",
      "mb-3",
      "border-0",
      "custom-btn"
    );

    // append
    customSearchHistory.append(searchHistoryButton);
  });

  //save to storage
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
}

//UTILITY FUNCTIONS
function sortByCity(searchHistory) {
  console.log(searchHistory);
  let sortedSearchHistory = searchHistory.sort(function (a, b) {
    console.log(a, b);
    const nameA = a.toUpperCase(); //ignore upper and lowercase
    const nameB = b.toUpperCase(); //ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    //names must be equal
    return 0;
  });
  return sortedSearchHistory;
}

function renderCollapseText() {
  collapseBtn.textContent.trim() === "SHOW SEARCH HISTORY"
    ? (collapseBtn.textContent = "HIDE SEARCH HISTORY")
    : (collapseBtn.textContent = "SHOW SEARCH HISTORY");
}

function renderSpinnerDuringAPICall() {
  document.getElementById("spinner").classList.remove("hide");
  document.getElementById("spinner").classList.add("show");

  let spinnerTimer = setTimeout(() => {
    console.log("hello");
    document.getElementById("spinner").classList.add("hide");
    document.getElementById("spinner").classList.remove("show");
    clearTimeout(spinnerTimer);
  }, 2000);
}
