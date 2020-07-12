// variables HTML elements
const btnWeather = document.querySelector("#button-search");
const cityNameInput = document.querySelector("#city-name");
const btnCurrentLocation = document.querySelector("#button-currentLocation");
const con = document.querySelector("#con");

// Api Key form https://openweathermap.org/
const apiKey = "84b5c59049054a6076ceb266293c7bc7";

/**
 *function get the weather information from fetching api
 *
 * @param {*} cityName
 */
function weatherInfo(cityName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?&q=" +
      cityName +
      "&units=metric&appid=" +
      apiKey
  )
    .then(resp => resp.json())
    .then(json => {
        localStorage.clear();
        localStorage.setItem("city", JSON.stringify(json));  
      displayWeatherInfo(json);
    });
}
/**
 *
 *
 * @param {*} lat =>latitude
 * @param {*} lon =>longitude
 */
function weatherInfoCurrentLocation(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=metric&appid=" +
      apiKey
  )
    .then(resp => resp.json())
    .then(json => {
      localStorage.clear();
      localStorage.setItem("city", JSON.stringify(json));
      displayWeatherInfo(json);
    });
}
function displayWeatherInfo(data) {
  // weather icon

  const iconCode = data.weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  document.querySelector("#weather-icon").setAttribute("src", iconUrl);

  // location
  document.querySelector("#location").innerHTML = data.name;

  // temperature
  document.querySelector("#temp").innerHTML = `${data.main.temp} &degC`;

  // wind speed
  const wind = data.wind.speed;
  //sunset & sunrise
  const secSunrise = data.sys.sunrise;
  const secSunset = data.sys.sunset;

  /**
   *
   *convert the seconds to the local time
   * @param {*} sec
   */
  function convertTime(sec) {
    const time = new Date(sec * 1000);
    return time.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  const timeSunrise = convertTime(secSunrise);
  const timeSunset = convertTime(secSunset);
  // cloudy
  const cloudsData = data.weather[0].description;
  const cloudiness = cloudsData.charAt(0).toUpperCase() + cloudsData.slice(1);
  const tableDataLi = document.createElement("li");
  const tableDataUl = document.querySelector(".table .table-data");
  const tableTitle = document.querySelector(".table .table-title");

  tableTitle.style.display = "block";
  tableDataUl.innerHTML = "";
  tableDataLi.innerHTML = `
            <ul>
                <li>${wind}</li>
                <li>${timeSunrise}</li>
                <li>${timeSunset}</li>
                <li>${cloudiness}</li>
            </ul>
        `;
  tableDataUl.appendChild(tableDataLi);
  // display the location on the map
  const latitude = data.coord.lat;
  const longitude = data.coord.lon;
  renderLocationOnGoogleMap(latitude, longitude);
}
/**
 *render the location using latitude and longitude
 *
 * @param {*} lat
 * @param {*} lng
 */
function renderLocationOnGoogleMap(lat, lng) {
    const mapDiv = document.querySelector("#map");
    const map = new google.maps.Map(mapDiv, {
      center: { lat, lng },
      zoom: 8
    });
    console.log(map);
  }
cityNameInput.addEventListener("keyup", event => {
  event.preventDefault();
  if (event.keyCode === 13) {
    btnWeather.click();
  }
  if (cityNameInput.value === "") {
    alert("Enter your city name");
  }
  weatherInfo(cityNameInput.value);
});
btnCurrentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(function(position) {
    const currentLocation = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    };
    weatherInfoCurrentLocation(
      currentLocation.latitude,
      currentLocation.longitude
    );
  });
});
window.addEventListener("load", () => {
    if (localStorage.getItem("city") !== null) {
      const data = JSON.parse(localStorage.getItem("city"));
      displayWeatherInfo(data);
    }
  });