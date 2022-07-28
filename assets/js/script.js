//section:query selector variables go here 👇
let cityInput = document.getElementById("city-search-input-text");
let citySelectionButton = document.getElementById("button-wrapper");
let collapseBtn = document.getElementById("collapse-btn");
let clearLocalStorageButton = document.getElementById("clear-local-storage-btn");
let customSearchHistory = document.getElementById("custom-search-history");
let historyContainer = document.getElementById("history-container");

//section:global variables go here 👇

//section:event listeners go here 👇
window.addEventListener('resize', mobileDefaultHideHistory);
cityInput.addEventListener("input", populateAutoComplete);
citySelectionButton.addEventListener("click", handleCityInput);
collapseBtn.addEventListener("click", renderCollapseText);
clearLocalStorageButton.addEventListener("click", clearLocalStorage);
historyContainer.addEventListener("click", deleteCity);

//section:functions and event handlers go here 👇
window.onload = function () {
  cityInput.focus();
  // handleCityInput(event, "boulder, co", "Boulder, CO");
  fetchLatitudeLongitude("boulder, co", "Boulder, CO"); //fetch default weather location
  mobileDefaultHideHistory(); //hides history in mobile view
};

// function handleCityInput(event, defaultSearchCity, defaultDisplayCity) {
function handleCityInput(event) {
  let input = "";
  let validInput = ""

  input = validateInput(event); //validate input

  if (input) { //if input is valid then get input either from input box or history search button
      validInput = getCityInput(event)
  } else {
      console.log('not valid input')
      return
  };

  if (validInput) { //if getCityInput is valid then start weather data fetch/api calls
      getWeatherData(event, validInput.citySelected, validInput.cityRendered)
  } else {
      return;
  }
}

function validateInput(event) {
  console.log(event)
  let handleClick = event.target;
  let buttonText = ["hide history", "show history", "clear history"]

  if (!handleClick.matches('button') || buttonText.includes(handleClick.textContent.toLowerCase())) {
    return false;
  } else if (!cityInput.value && event.target.textContent.trim() === "Search") {
    console.log("alert");
    validationModal("City/Zip is Blank", "Please enter city/zip & select from list.");
    cityInput.focus();
    return false;
  }
  return true;
}

// function getCityInput(event, defaultSearchCity, defaultDisplayCity) {
function getCityInput(event) {
  let citySelected = "";
  let cityRendered = "";
  let buttonText = event.target;

  if (buttonText.textContent.trim() === "Search") { //if search button is clicked get input contents
        citySelected = cityInput.value.trim().toLowerCase();
        cityRendered = cityInput.value.trim();
        cityInput.value = ""; //clear input value
        cityInput.focus();
  } else { //if history search city selected get button content
      citySelected = buttonText.getAttribute("data-city").trim().toLowerCase();
      cityRendered = buttonText.getAttribute("data-city");
  }

  // console.log(citySelected, cityRendered);
  return { citySelected, cityRendered };
}

function getWeatherData(event, citySelected, cityRendered) {
  //DETERMINE IF INPUT IS A CITY OR ZIP CODE

  if (cityStateList.includes(cityRendered)) { //IF IN THE CITY LIST FETCH LAT/LON FROM GEO DIRECT URL
    fetchLatitudeLongitude(citySelected, cityRendered);

  } else if (zipCodeList.includes(cityRendered) || zipCodeList.includes(event.target.getAttribute("data-zip"))) {

    let zipCode = "";
    isNaN(citySelected) ? zipCode = event.target.getAttribute("data-zip") : zipCode = citySelected; //if 
    fetchLatitudeLongitude(zipCode, "", "zipCode");

  } else {

    // console.log("else");
    validationModal("City/Zip Not Found", `Please enter city/zip & select from list.`);
  }
}

// API CALLS TO OPEN WEATHER
function fetchLatitudeLongitude(cityOrZip, cityRendered, urlSelector) {
  let urlLatitudeLongitude = "";
  let latitude = "";
  let longitude = "";

  urlSelector === "zipCode"
    ? (urlLatitudeLongitude = `http://api.openweathermap.org/geo/1.0/zip?zip=${cityOrZip}&appid=f0bed1b0eff80d425a392e66c50eb063`)
    : (urlLatitudeLongitude = `http://api.openweathermap.org/geo/1.0/direct?q=${cityOrZip},us&limit=1&appid=f0bed1b0eff80d425a392e66c50eb063`);

  //  fetch(urlLatitudeLongitude)
  //   .then((response) => {
  //     if (response.ok) {
  //       response.json().then((data) => {
  //         console.log(data);
  //         !data[0] ? (latitude = data.lat) : (latitude = data[0].lat); //use lat/lon from geo zip url or geo direct url
  //         !data[0] ? (longitude = data.lon) : (longitude = data[0].lon); //use lat/lon from geo zip url or geo direct url
  //         cityRendered = cityRendered || data.name;
  //         // cityRendered = cityRendered || getCityStateBasedOnZip(latitude, longitude);
  //         // console.log(cityRendered);
  //         fetchWeatherData(latitude, longitude, cityOrZip, cityRendered);
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

  fetchWeatherData("", "", cityOrZip, "Boulder, CO"); //todo:mock data
}

function fetchWeatherData(latitude, longitude, cityOrZip, cityRendered) {
  let currentWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial&units=imperial`;

  // fetch(currentWeatherURL)
  //   .then((response) => {
  //     if (response.ok) {
  //       response.json().then((data) => {
  //         // console.log(data);

  //         renderWeather(data, cityOrZip, cityRendered);

  //         // renderSearchHistory(cityOrZip, cityRendered); //todo:working?
  //         createSearchHistory(cityOrZip, cityRendered);

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


  // renderSearchHistory(cityOrZip, cityRendered); //todo:working? //todo:remove
  // createSearchHistory(cityOrZip, cityOrZip, cityRendered);

  renderWeather(currentWeather[0], cityOrZip, cityRendered); //todo:mock data
}

// RENDER WEATHER DATA
function renderWeather({ daily }, cityOrZip, cityRendered) {
  renderSpinnerDuringAPICall();

  let renderAPICall = setTimeout(() => {
    renderCurrentWeather(daily, cityRendered);
    renderForecastWeather(daily, cityRendered);
    removeSpinnerAfterAPICall(renderAPICall);
    createSearchHistory(cityOrZip, cityRendered);
  }, 500);

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
  let dateElement = document.createElement("p");

  //declear dateTime
  let dateTime = moment.unix(daily[0].dt).format("M/D/YYYY");
  // currentDateTime = moment.unix(daily[0].dt).format('dddd, M/D/YYYY h:mm:ss a z');
  currentDateTime = getCurrentDate();
  // console.log(currentDateTime, currentDateTime.dateShort)

  //add classes
  let cardTextClasses = ("card-text", "mb-2");
  cardTitle.classList.add("card-title", "mb-1", "custom-font-24px");
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
  icon.setAttribute("src",`https://openweathermap.org/img/w/${daily[0].weather[0].icon}.png`);
  temp.textContent = `Temp: ${Math.round(daily[0].temp.day)}℉`;
  windSpeed.textContent = `Wind: ${Math.round(daily[0].wind_speed)} MPH`;
  humidity.textContent = `Humidity: ${daily[0].humidity}%`;
  uvIndexElement.textContent = `UV Index: `;
  uvIndexSpan.textContent = `${daily[0].uvi}`;
  dateElement.textContent = `As of: ${currentDateTime.dateShort}`;

  //add styling
  renderUVIndexStying(daily[0].uvi, uvIndexSpan);

  //append element
  currentWeather.append(cardTitle, temp, windSpeed, humidity, uvIndexElement, dateElement);
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
function createSearchHistory(citySelected, citySearched) {
  let searchHistory = getLocalStorage() || []; //get local storage

  //create list of only the cityNames
  // let cityList = []; 
  // for (let i = 0; i < searchHistory.length; i++) {
  //   if (!cityList.includes(searchHistory[i].cityName)) {
  //     cityList.push(searchHistory[i].cityName);
  //   }
  // }

  let cityList = createCityList(searchHistory);

  //if current city is not included in history, push it to history
  if (!cityList.includes(citySearched) && citySearched !== "") {
    searchHistory.push({ cityName: citySearched, zipOrCity: citySelected }); //todo
  }

  //sort list
  searchHistory = sortByCity(searchHistory); //todo
  
  renderAndSaveSearchHistory(searchHistory)
}

function renderAndSaveSearchHistory(searchHistory) {
  //clear search history
  customSearchHistory.textContent = "";

  searchHistory.forEach((element) => {
    let searchHistoryButton = document.createElement("button");
    let deleteAnchorElement = document.createElement('a'); //anchor element uses Bootstrap styling

    // add textcontent
    searchHistoryButton.textContent = `${element.cityName.trim()}`; //todo
    searchHistoryButton.setAttribute("data-city", `${element.cityName.trim()}`); //todo
    searchHistoryButton.setAttribute("data-zip", `${element.zipOrCity.trim()}`); //todo
    deleteAnchorElement.textContent = "x";

    // add classes
    searchHistoryButton.classList.add("btn","btn-secondary", "btn-lg", "w-100", "ml-0", "mb-3", "border-0", "custom-btn");
    deleteAnchorElement.classList.add("close", "remove-city");

    // append
    customSearchHistory.append(searchHistoryButton);
    searchHistoryButton.append(deleteAnchorElement);
  });

  setLocalStorage(searchHistory);
}

// function renderSearchHistory(citySelected, citySearched) {
  // let searchHistory = getLocalStorage() || [];

  // let cityList = []; //create list of only the cityNames
  // for (let i = 0; i < searchHistory.length; i++) {
  //   if (!cityList.includes(searchHistory[i].cityName)) {
  //     cityList.push(searchHistory[i].cityName);
  //   }
  // }

  // if (!cityList.includes(citySearched) && citySearched !== "") { //if current city is not included in history, push it to history
  //   searchHistory.push({ cityName: citySearched, zipOrCity: citySelected }); //todo
  // }

  // //sort array
  // searchHistory = sortByCity(searchHistory); //todo
  // // console.log("sorted = ", searchHistory);

  // customSearchHistory.textContent = "";

  // searchHistory.forEach((element) => {
  //   let searchHistoryButton = document.createElement("button");
  //   let deleteAnchorElement = document.createElement("a");

  //   // add textcontent
  //   searchHistoryButton.textContent = `${element.cityName.trim()}`; //todo
  //   searchHistoryButton.setAttribute("data-city", `${element.cityName.trim()}`); //todo
  //   searchHistoryButton.setAttribute("data-zip", `${element.zipOrCity.trim()}`); //todo
  //   deleteAnchorElement.innerHTML = "&times;";

  //   // add classes
  //   searchHistoryButton.classList.add("btn","btn-secondary", "btn-lg", "w-100", "ml-0", "mb-3", "border-0", "custom-btn");
  //   deleteAnchorElement.classList.add("close");

  //   // append
  //   customSearchHistory.append(searchHistoryButton);
  //   searchHistoryButton.append(deleteAnchorElement);
  // });

  // //save to storage
  // // if (searchHistory) {
  // setLocalStorage(searchHistory);
  // // localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  // // }
// }

//LOCAL STORAGE
function getLocalStorage() {
  return JSON.parse(localStorage.getItem("weatherSearchHistory"));
}

function setLocalStorage(searchHistory) {
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
}

function clearLocalStorage() {
  localStorage.removeItem("weatherSearchHistory");
  customSearchHistory.textContent = "";
}

//UTILITY FUNCTIONS
function sortByCity(searchHistory) {
  // console.log(searchHistory);
  let sortedSearchHistory = searchHistory.sort(function (a, b) {
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
  return sortedSearchHistory;
}

function renderCollapseText() {
  historyContainer.classList.contains('show') //show means the search history card is hidden/collapsed
    ? (console.log('show'), collapseBtn.textContent = "Show History")
    : (console.log('hide'), collapseBtn.textContent = "Hide History");
}

function renderSpinnerDuringAPICall() {
  document.getElementById("spinner").classList.remove("hide");
  document.getElementById("spinner").classList.add("show");

  document.getElementById("spinner-text").classList.remove("hide");
  document.getElementById("spinner-text").classList.add("show");
}

function removeSpinnerAfterAPICall(passTimeOutId) {
  document.getElementById("spinner").classList.add("hide");
  document.getElementById("spinner").classList.remove("show");

  document.getElementById("spinner-text").classList.add("hide");
  document.getElementById("spinner-text").classList.remove("show");

  clearTimeout(passTimeOutId);
}

function validationModal(title, body) {
  $("#no-input-model").modal("show");
  $("#no-input-title").text(title);
  $("#no-input-body").text(body);
}

function getCityStateBasedOnZip(latitude, longitude) { 
  // if zip code is entered, need to retrieve city/state to display it
  // this could be retrieved via the open weather reverse API but the state is not abbreviated / consistent with other formats

  
  let cityState = "";
  cityListUSOnly.forEach(city => {
    city.coord.lat === parseFloat(latitude) && city.coord.lon === parseFloat(longitude)
    return cityState;
  })

  // console.log(parseFloat(latitude), parseFloat(longitude));
  // console.log("hello");
  
  // for (let i = 0; i < cityListUSOnly.length; i++) {
    //   if (cityListUSOnly[i].coord.lat === parseFloat(latitude) && cityListUSOnly[i].coord.lon === parseFloat(longitude)) {
      //     cityState = `${cityListUSOnly[i].name}, ${cityListUSOnly[i].state}`;
      //     return cityState;
      //   }
      // }
      
      
}

function populateAutoComplete() {
  let autoCompleteList = cityStateList.concat(zipCodeList);
  $("#city-search-input-text").autocomplete({
    minLength: 2,
    source: autoCompleteList,
  });
}

function deleteCity(event) {
  // if (event.target.matches("a span") || event.target.matches("a")) {
  if (event.target.classList.contains("remove-city")) {
    let searchHistory = getLocalStorage();

    // let cityList = [];
    // for (let i = 0; i < searchHistory.length; i++) {
    //   if (!cityList.includes(searchHistory[i].cityName)) {
    //     cityList.push(searchHistory[i].cityName);
    //   }
    // }

    let cityList = createCityList(searchHistory); //create list of cities
    let index = cityList.indexOf(event.target.parentNode.getAttribute("data-city")); //get index of city clicked

    event.target.parentNode.remove(); //remove city from DOM
    searchHistory.splice(index, 1); //remove city from local storage

    setLocalStorage(searchHistory);
  }
}

function getCurrentDate() {
  let dateString = Date();
  
  let date = new Date(dateString).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'}); //'2/22/22'
  let time = new Date(dateString).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit'}); //'7:38' or '15:50'
  let timeZone = /.*\(([^)]*)\)/.exec(dateString)[1].match(/[A-Z]/g).join(''); //'MDT'
  let dateShort = date + ' ' + time + ' ' + timeZone; // '2/22/22 7:38 MDT' or '3/22/22 15:51 MDT'
  let dateOnly = date; //'2/22/22'

  // console.log(dateString, dateShort);
  return {'dateString': dateString, 'date': date, 'time': time, 'timeZone': timeZone, 'dateShort': dateShort, 'dateOnly': dateOnly};
}

function createCityList(searchHistory) {
  let cityList = [];

  // for (let i = 0; i < searchHistory.length; i++) {
  //   if (!cityList.includes(searchHistory[i].cityName)) {
  //     cityList.push(searchHistory[i].cityName);
  //   }
  // }

  searchHistory.forEach(({cityName}) => {
    if (!cityList.includes(cityName)) {cityList.push(cityName)}
  })

  return cityList;
}

function mobileDefaultHideHistory(event) {
  if (window.innerWidth < 500) {
    collapseBtn.classList.add('collapsed');
    collapseBtn.textContent = "Show History";
    historyContainer.classList.remove('show');
  } else {
    collapseBtn.classList.remove('collapsed');
    collapseBtn.textContent = "Hide History";
    historyContainer.classList.add('show');
  }
}