//section:query selector variables go here 👇
let citySelectionButton = document.getElementById("button-wrapper");
let cityInput = document.getElementById("city-search-input-text");
let collapseBtn = document.getElementById("collapse-btn");
// let citySelected = document.getElementById('citySelected').textContent;
let clearLocalStorageButton = document.getElementById(
  "clear-local-storage-btn"
);
let customSearchHistory = document.getElementById("custom-search-history");
let historyContainer = document.getElementById("history-container");

//section:global variables go here 👇

//section:event listeners go here 👇
cityInput.addEventListener("input", populateAutoComplete);
citySelectionButton.addEventListener("click", handleCityInput);
collapseBtn.addEventListener("click", renderCollapseText);
clearLocalStorageButton.addEventListener("click", clearLocalStorage);
historyContainer.addEventListener("click", deleteCity);

//section:functions and event handlers go here 👇
window.onload = function () {
  cityInput.focus();
  // let defaultSearchCity = "boulder, co";
  handleCityInput(event, "boulder, co", "Boulder, CO");

  // getCityStateBasedOnZip(42.5068, -75.7623)
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
  // let buttonText = event.target.textContent;
  let buttonText = event.target;

  if (defaultSearchCity) {
    citySelected = defaultSearchCity;
    cityRendered = defaultDisplayCity;
  } else if (
    event.target.matches("button") &&
    buttonText.textContent.trim() === "Search" &&
    cityInput.value
  ) {
    citySelected = cityInput.value.trim().toLowerCase();
    cityRendered = cityInput.value.trim();
    cityInput.value = "";
    cityInput.focus();
  } else if (
    event.target.matches("button") &&
    buttonText.textContent.trim() !== "Search" &&
    !cityInput.value
  ) {
    // citySelected = buttonText.textContent.substr(0, 45).trim().toLowerCase();
    // cityRendered = buttonText.textContent.substr(0, 45).trim();

    citySelected = buttonText.getAttribute("data-city").trim().toLowerCase();
    cityRendered = buttonText.getAttribute("data-city");
  }
  console.log(citySelected, cityRendered);

  return { citySelected, cityRendered };
}

function getWeatherData(event, citySelected, cityRendered) {
  //GET WEATHER FROM API
  // console.log(event);
  // console.log(event.target.textContent, event.target.textContent.trim().toLowerCase() === 'clear history')

  if (!citySelected && event.target.textContent.trim() === "Search") {
    console.log("alert");
    validationModal("City/Zip is Blank", "Please select from list.");
    cityInput.focus();
    return;
  } else if (cityStateList.includes(cityRendered)) {
    // console.log('2')
    fetchLatitudeLongitude(citySelected, cityRendered);
    renderSpinnerDuringAPICall();
  } else if (
    event.target.textContent.toLowerCase() === "hide history" ||
    event.target.textContent.toLowerCase() === "show history" ||
    event.target.textContent.trim().toLowerCase() === "clear history" ||
    event.target.matches("a")
  ) {
    return;
    // } else if (!isNaN(citySelected)) {
  } else if (
    zipCodeList.includes(cityRendered) ||
    zipCodeList.includes(event.target.getAttribute("data-zip"))
  ) {
    console.log("3");
    // console.log('zip = ', citySelected, typeof citySelected, isNaN(citySelected))
    let zipCode = "";
    !isNaN(citySelected)
      ? (zipCode = citySelected)
      : (zipCode = event.target.getAttribute("data-zip"));
    fetchLatitudeLongitude(zipCode, "", "zipCode");
    renderSpinnerDuringAPICall();
  } else {
    console.log("else");
    validationModal("City/Zip Not Found", `Please selct from list.`);
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

  //  fetch(urlLatitudeLongitude)
  //   .then((response) => {
  //     if (response.ok) {
  //       response.json().then((data) => {
  //         console.log(data);
  //         !data[0] ? (latitude = data.lat) : (latitude = data[0].lat);
  //         !data[0] ? (longitude = data.lon) : (longitude = data[0].lon);
  //         cityRendered = cityRendered || data.name;
  //         // cityRendered = cityRendered || getCityStateBasedOnZip(latitude, longitude);
  //         // console.log(cityRendered);
  //         fetchWeatherData(latitude, longitude, cityStateSelectedOrZipCode, cityRendered);
  //       })
  //     } else {
  //       // alert('Error: ' + response.statusText);
  //     validationModal("Error: City/Zip Not Found", `Try Again: ${response.statusText}`);
  //     }
  //   })
  //   .catch((error) => {
  //     // alert(error);
  //     // console.error('Error:', error);
  //     validationModal("Error: City/Zip Not Found", `Try Again: ${response.statusText}`);
  //   });

  fetchWeatherData("", "", cityStateSelectedOrZipCode, "Boulder, CO"); //todo:mock data
}

function fetchWeatherData(
  latitude,
  longitude,
  cityStateSelectedOrZipCode,
  cityRendered
) {
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;

  // fetch(currentWeatherURL)
  //   .then((response) => {
  //     if (response.ok) {
  //       response.json().then((data) => {
  //         // console.log(data);

  //         renderWeather(data, cityRendered);

  //         renderSearchHistory(cityStateSelectedOrZipCode, cityRendered); //todo:working?

  //       })
  //     } else {
  //       // alert('Error: ' + response.statusText);
  //     validationModal("Error: City/Zip Not Found", `Try Again: ${response.statusText}`);
  //     }
  //   })
  //   .catch((error) => {
  //     // alert(error);
  //     console.error('Error:', error);
  //     validationModal("Error: City/Zip Not Found", `Try Again: ${response.statusText}`);
  //   });

  renderSearchHistory(cityStateSelectedOrZipCode, cityRendered); //todo:working? //todo:remove
  renderWeather(currentWeather[0], cityRendered); //todo:mock data
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
    icon.setAttribute("data-toggle", "tooltip");
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
function renderSearchHistory(citySelected, citySearched) {
  //create array with history
  console.log("history");
  console.log(citySelected, citySearched);

  let searchHistory =
    JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

  // console.log(searchHistory);

  let cityList = [];
  for (let i = 0; i < searchHistory.length; i++) {
    if (!cityList.includes(searchHistory[i].cityName)) {
      cityList.push(searchHistory[i].cityName);
    }
  }
  console.log(cityList);

  //if array includes does not include city and is not black
  // if (!searchHistory.includes(citySearched) && citySearched !== "") {
  // if (cityStateList.includes(citySearched) && !searchHistory.includes(citySearched)) {
  // if (!searchHistory.includes(citySearched) && citySearched !== "") {
  if (!cityList.includes(citySearched) && citySearched !== "") {
    // searchHistory.push(citySearched);
    searchHistory.push({ cityName: citySearched, zipOrCity: citySelected }); //todo
  }

  //sort array
  searchHistory = sortByCity(searchHistory); //todo
  // console.log("sorted = ", searchHistory);

  customSearchHistory.textContent = "";

  searchHistory.forEach((element) => {
    let searchHistoryButton = document.createElement("button");
    let deleteAnchorElement = document.createElement("a");

    // add textcontent
    searchHistoryButton.textContent = `${element.cityName.trim()}`; //todo
    searchHistoryButton.setAttribute("data-city", `${element.cityName.trim()}`); //todo
    searchHistoryButton.setAttribute("data-zip", `${element.zipOrCity.trim()}`); //todo
    deleteAnchorElement.innerHTML = "&times;";

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
    deleteAnchorElement.classList.add("close");

    // append
    customSearchHistory.append(searchHistoryButton);
    searchHistoryButton.append(deleteAnchorElement);
  });

  //save to storage
  // if (searchHistory) {
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  // }
}

//LOCAL STORAGE
function getLocalStorage() {
  return JSON.parse(localStorage.getItem("weatherSearchHistory"));
}

function setLocalStorage(searchHistory) {
  // searchHistory = ["Boulder, CO", "Boulder, CO", "Boulder, CO", "Boulder, CO"];
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
}

function clearLocalStorage() {
  localStorage.removeItem("weatherSearchHistory");
  // let customSearchHistory = document.getElementById("custom-search-history");
  customSearchHistory.textContent = "";
}

//UTILITY FUNCTIONS
function sortByCity(searchHistory) {
  // console.log(searchHistory);
  let sortedSearchHistory = searchHistory.sort(function (a, b) {
    // console.log(a, b);
    const nameA = a.cityName.toUpperCase(); //ignore upper and lowercase
    const nameB = b.cityName.toUpperCase(); //ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    //names must be equal
    return 0;
  });
  // console.log(sortedSearchHistory)
  return sortedSearchHistory;
}

function renderCollapseText() {
  collapseBtn.textContent.trim() === "Show History"
    ? (collapseBtn.textContent = "Hide History")
    : (collapseBtn.textContent = "Show History");
}

function renderSpinnerDuringAPICall() {
  document.getElementById("spinner").classList.remove("hide");
  document.getElementById("spinner").classList.add("show");

  let spinnerTimer = setTimeout(() => {
    // console.log("hello");
    document.getElementById("spinner").classList.add("hide");
    document.getElementById("spinner").classList.remove("show");
    clearTimeout(spinnerTimer);
  }, 2000);
}

function validationModal(title, body) {
  $("#no-input-model").modal("show");
  $("#no-input-title").text(title);
  $("#no-input-body").text(body);
}

// getCityStateBasedOnZip('32.153221', '-94.799377')

function getCityStateBasedOnZip(latitude, longitude) {
  console.log(parseFloat(latitude), parseFloat(longitude));
  console.log("hello");
  let cityState = "";
  for (let i = 0; i < cityListUSOnly.length; i++) {
    if (
      cityListUSOnly[i].coord.lat === parseFloat(latitude) &&
      cityListUSOnly[i].coord.lon === parseFloat(longitude)
    ) {
      console.log("yes");
      // console.log(`${cityListUSOnly[i].name}, ${cityListUSOnly[i].state}`);
      cityState = `${cityListUSOnly[i].name}, ${cityListUSOnly[i].state}`;
      console.log(cityState);
      return cityState;
      // break;
    }
  }
}

function populateAutoComplete() {
  var autoCompleteList = cityStateList.concat(zipCodeList);
  $("#city-search-input-text").autocomplete({
    minLength: 2,
    source: autoCompleteList,
  });
}

function deleteCity(event) {
  if (event.target.matches("a span") || event.target.matches("a")) {
    let searchHistory = getLocalStorage();

    let cityList = [];
    for (let i = 0; i < searchHistory.length; i++) {
      if (!cityList.includes(searchHistory[i].cityName)) {
        cityList.push(searchHistory[i].cityName);
      }
    }
    console.log(cityList);

    // console.log(event, event.target, event.target.parentNode, event.target.parentNode.getAttribute('data-city').trim().toLowerCase())

    let index = cityList.indexOf(
      event.target.parentNode.getAttribute("data-city")
    ); //todo: needs to remove the data-city

    console.log(
      index,
      event.target.parentNode,
      event.target.parentNode.getAttribute("data-city")
    );

    event.target.parentNode.remove();
    searchHistory.splice(index, 1);

    setLocalStorage(searchHistory);

    // console.log(event.target, event.target.parentNode)
    // console.log('yes');
    // let searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    // let searchHistory = ["Boulder, CO", "Boulder, CO", "Boulder, CO", "Boulder, CO"];
    // console.log(searchHistory);
    // console.log(index);
    // console.log(searchHistory);
    // localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory))
  }
}
