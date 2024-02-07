document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var searchTerm = document.getElementById("search-input").value.trim();

      fetchWeatherData(searchTerm);
    });
});

function fetchWeatherData(searchTerm) {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=17e97ad8c8fc4b7d9b2211954240602&q=${searchTerm}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      updateWeatherInfo(data);
      // Extract the country name from the weather data
      const countryName = data.location.country;
      // Call the function to get country code and update flag image
      getCountryCode(countryName).then((countryCode) => {
        const flag = document.getElementById("flag");
        flag.innerHTML = `<img src="https://flagcdn.com/w160/${countryCode}.png" srcset="https://flagcdn.com/w320/${countryCode}.png 2x" width="50" alt="${countryName}">`;
      });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function getCountryCode(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch country data");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data[0].cca2.toLowerCase());
      return data[0].cca2.toLowerCase(); // Return the country code
    })
    .catch((error) => {
      console.error("Error fetching country data:", error);
      return null;
    });
}

function updateWeatherInfo(data) {
  console.log(data);
  const weatherInfo = document.getElementById("weather-info");
  weatherInfo.innerHTML = `
  <div style="color: black; font-size: 50px"><strong>${
    data.location.name
  }</strong><br></div>
  <div style="color: black; font-size: 40px">${data.location.country}</div><br>
  <div style="color: black; font-size: 40px">Température: <strong>${
    data.current.temp_c
  }°C</strong><br></div>
  <div style="color: black; font-size: 40px">Vent: <strong>${
    data.current.wind_kph
  } km/h</strong><br></div>
  <div style="color: black; font-size: 40px">Nuage: <strong>${
    data.current.cloud ? "Dégagé" : "Nuageux"
  }</strong><br></div>
  <div style="color: black; font-size: 40px">Condition: <strong>${
    data.current.condition.text
  }</strong><br></div>
  <div style="color: black; font-size: 40px">Précipitations: <strong>${
    data.current.precip_mm
  } mm</strong><br></div>
  <div style="color: black; font-size: 40px">${
    data.current.is_day ? "Jour" : "Nuit"
  }</div>
  `;
}
