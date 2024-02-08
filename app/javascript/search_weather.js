function getUserIP(callback) {
  fetch("https://api64.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      callback(data.ip);
    })
    .catch((error) => {
      console.error(
        "An error occurred while retrieving the IP address: ",
        error
      );
    });
}

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
      // Extract the country name from the weather data
      const countryName = data.location.country;
      // Call the function to get country code and update flag image
      getCountryCode(countryName).then((countryCode) => {
        const flag = document.getElementById("flag");
        flag.innerHTML = `<img src="https://flagcdn.com/w160/${countryCode}.png" srcset="https://flagcdn.com/w320/${countryCode}.png 2x" width="50" alt="${countryName}">`;
        // Get user's IP address and pass it to updateWeatherInfo
        getUserIP((userIP) => {
          updateWeatherInfo(data, userIP, countryCode);
        });
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
      const countryCode = data[0].cca2.toLowerCase();
      return countryCode; // Return the country code
    })
    .catch((error) => {
      console.error("Error fetching country data:", error);
      return null;
    });
}

function updateWeatherInfo(data, userIP, countryCode) {
  const dataInfoTown = document.getElementById("weather-info-town");
  const dataInfoCountry = document.getElementById("weather-info-country");
  const dataInfoTemperature = document.getElementById(
    "weather-info-temperature"
  );
  const dataInfoWind = document.getElementById("weather-info-wind");
  const dataInfoCloud = document.getElementById("weather-info-cloud");
  const dataInfoCondition = document.getElementById("weather-info-condition");
  const dataInfoPrecipitation = document.getElementById(
    "weather-info-precipitation"
  );
  const dataInfoDayOrNight = document.getElementById(
    "weather-info-day-or-night"
  );
  dataInfoCountry.innerHTML = `${data.location.country}`;
  dataInfoTown.innerHTML = `${data.location.name}`;
  dataInfoTemperature.innerHTML = `${data.current.temp_c}°C`;
  dataInfoWind.innerHTML = `${data.current.wind_kph} km/h`;
  dataInfoCloud.innerHTML = `${data.current.cloud ? "Dégagé" : "Nuageux"}`;
  dataInfoCondition.innerHTML = `${data.current.condition.text}`;
  dataInfoPrecipitation.innerHTML = `${data.current.precip_mm} mm`;
  dataInfoDayOrNight.innerHTML = `${data.current.is_day ? "Jour" : "Nuit"}`;

  // Combiner les données de localisation et de météo dans un seul objet
  const postData = {
    visitors: {
      country: data.location.country,
      city: data.location.name,
      userIP: userIP,
      countryCode: countryCode,
      temperature: data.current.temp_c,
      windSpeed: data.current.wind_kph,
      weatherCondition: data.current.cloud ? "Dégagé" : "Nuageux",
      conditionText: data.current.condition.text,
      precipitation: data.current.precip_mm,
      dayOrNight: data.current.is_day ? "Jour" : "Nuit",
    },
  };
  console.log(postData);

  // Envoie les données combinées au serveur Rails
  fetch("/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des données au serveur");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi des données au serveur:", error);
    });
}
