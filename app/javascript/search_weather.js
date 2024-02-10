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
      const countryName = data.location.country;
      getCountryCode(countryName)
        .then((countryCode) => {
          const flag = document.getElementById("flag");
          flag.innerHTML = `<img src="https://flagcdn.com/w160/${countryCode}.png" srcset="https://flagcdn.com/w320/${countryCode}.png 2x" width="80" alt="${countryName}">`;
          getUserIP((userIP) => {
            getCurrency(countryName)
              .then((currencyData) => {
                updateWeatherInfo(data, userIP, countryCode, currencyData);
                recordSearch(searchTerm);
                displaySearchCount(searchTerm.toLowerCase()); // Afficher le nombre de recherches pour la ville spécifique
              })
              .catch((error) => {
                console.error("Error fetching currency data:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error fetching country code:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function recordSearch(city) {
  let searches = JSON.parse(localStorage.getItem("searches")) || {};
  let userIP = localStorage.getItem("userIP");

  if (!searches[city]) {
    searches[city] = 1;
    localStorage.setItem("searches", JSON.stringify(searches));
  } else {
    if (userIP) {
      let previousSearches = JSON.parse(userIP);
      if (!previousSearches.includes(city)) {
        previousSearches.push(city);
        localStorage.setItem("userIP", JSON.stringify(previousSearches));
        searches[city]++;
        localStorage.setItem("searches", JSON.stringify(searches));
      }
    }
  }
}

// Fonction pour afficher le nombre de recherches pour chaque ville
function displaySearchCount(city) {
  let searches = JSON.parse(localStorage.getItem("searches")) || {};
  const searchCountElement = document.getElementById("search-count");

  // Effacer le contenu précédent
  searchCountElement.innerHTML = "";

  // Récupérer le nombre de recherches pour la ville spécifique
  const searchCount = searches[city] || 0;

  // Afficher le nombre de recherches pour la ville spécifique
  const listItem = document.createElement("p");
  listItem.textContent = `Searches for ${city.charAt(0).toUpperCase() + city.slice(1)}: ${searchCount}`;
  searchCountElement.appendChild(listItem);
}


function getCurrency(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch country data");
      }
      return response.json();
    })
    .then((data) => {
      const currencies = data[0]?.currencies;
      return currencies;
    })
    .catch((error) => {
      console.error("Error fetching currency data:", error);
      return null;
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


function updateWeatherInfo(data, userIP, countryCode, currencyData) {
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
  //le temps local
  const dataInfoLocalTime = document.getElementById("weather-info-local-time");
  const localTime = new Date(data.location.localtime);
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes();

  const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

  const currencyInfo = document.getElementById("currency-info");
  if (currencyInfo && currencyData) {
    const currencyCode = Object.keys(currencyData)[0];
    const currencyName = currencyData[currencyCode].name;
    const currencySymbol = currencyData[currencyCode].symbol;
    currencyInfo.innerHTML = `Currency: ${currencyName} (${currencySymbol})`;
  } else {
    console.error("Element currencyInfo not found in the DOM or currency data not available.");
  }

  if (dataInfoLocalTime) {
    dataInfoLocalTime.innerHTML = `${formattedTime}`;
  } else {
    console.error("Element dataInfoLocalTime not found in the DOM.");
  }

  if (dataInfoCountry) {
    dataInfoCountry.innerHTML = `${data.location.country}`;
  } else {
    console.error("Element dataInfoCountry not found in the DOM.");
  }

  if (dataInfoTown) {
    dataInfoTown.innerHTML = `${data.location.name}`;
  } else {
    console.error("Element dataInfoTown not found in the DOM.");
  }

  if (dataInfoTemperature) {
    dataInfoTemperature.innerHTML = `${data.current.temp_c}°C`;
  } else {
    console.error("Element dataInfoTemperature not found in the DOM.");
  }

  if (dataInfoWind) {
    dataInfoWind.innerHTML = `${data.current.wind_kph} km/h`;
  } else {
    console.error("Element dataInfoWind not found in the DOM.");
  }

  if (dataInfoCloud) {
    const cloudPercentage = data.current.cloud;
    const isCloudy = cloudPercentage > 50;
    const cloudImage = isCloudy ? '<img src="../../assets/cloudy_sky.png" alt="Nuageux" width="50px" height="50px">' : '<img src="../../assets/clear_sky.png" alt="Ciel clair" width="50px" height="50px">';
    dataInfoCloud.innerHTML = cloudImage;
} else {
    console.error("Element dataInfoCloud not found in the DOM.");
}

  if (dataInfoCondition) {
    console.log(data.current.condition.text);
    dataInfoCondition.innerHTML = `${data.current.condition.text}`;
  } else {
    console.error("Element dataInfoCondition not found in the DOM.");
  }

  if (dataInfoPrecipitation) {
    dataInfoPrecipitation.innerHTML = `${data.current.precip_mm} mm`;
  } else {
    console.error("Element dataInfoPrecipitation not found in the DOM.");
  }

  if (dataInfoDayOrNight) {
    const isDay = data.current.is_day;
    dataInfoDayOrNight.innerHTML = isDay ? '<img src="../../assets/soleil.png" alt="Soleil" width="30px" height="30px">' : '<img src="../../assets/lune.png" alt="Lune" width="30px" height="30px">';
} else {
    console.error("Element dataInfoDayOrNight not found in the DOM.");
}

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
      localtime: formattedTime,
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
