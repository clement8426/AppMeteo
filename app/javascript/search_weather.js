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

      document.getElementById("search-input").value = "";

      fetchWeatherData(searchTerm);
    });
});

// yo
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

  // Obtenir le timestamp actuel en millisecondes

  let timestamp = new Date();
  timestamp = timestamp.getTime();
  if (!searches[city]) {
    // Enregistrer la recherche avec son timestamp
    searches[city] = { count: 1, timestamp: timestamp };
    localStorage.setItem("searches", JSON.stringify(searches));
  } else {
    if (userIP) {
      let previousSearches = JSON.parse(userIP);
      if (!previousSearches.includes(city)) {
        previousSearches.push(city);
        localStorage.setItem("userIP", JSON.stringify(previousSearches));

        // Enregistrer la recherche avec son timestamp
        searches[city] = {
          count: searches[city].count + 1,
          timestamp: timestamp,
        };
        localStorage.setItem("searches", JSON.stringify(searches));
      }
    }
  }
}

function displaySearchCount(city) {
  let searches = JSON.parse(localStorage.getItem("searches")) || {};
  const searchCountElement = document.getElementById("search-count");

  // Effacer le contenu précédent
  searchCountElement.innerHTML = "";

  // Récupérer le nombre de recherches pour la ville spécifique
  const searchCount = searches[city] || 0;

  // Afficher le nombre de recherches pour la ville spécifique
  const listItem = document.createElement("p");
  listItem.textContent = `Searches for ${
    city.charAt(0).toUpperCase() + city.slice(1)
  }: ${searchCount}`;
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

  const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;

  const currencyInfo = document.getElementById("currency-info");
  if (currencyInfo && currencyData) {
    const currencyCode = Object.keys(currencyData)[0];
    const currencyName = currencyData[currencyCode].name;
    const currencySymbol = currencyData[currencyCode].symbol;
    currencyInfo.innerHTML = `Currency: ${currencyName} (${currencySymbol})`;
  } else {
    console.error(
      "Element currencyInfo not found in the DOM or currency data not available."
    );
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
    const cloudImage = isCloudy
      ? '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362021/qata0shzyb4uikhnnclt.png" alt="Cloudy sky" width="50px" height="50px">'
      : '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362026/vj08co2edbwpqxdahgbh.png" alt="Clear sky" width="50px" height="50px">';

    dataInfoCloud.innerHTML = cloudImage;
  } else {
    console.error("Element dataInfoCloud not found in the DOM.");
  }

  if (dataInfoCondition) {
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
    dataInfoDayOrNight.innerHTML = isDay
      ? '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362034/pbnjcluffqy5hioxtft5.png" alt="Sun" width="30px" height="30px">'
      : '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362031/smnymgttfaehzeow9kkh.png" alt="Moon" width="30px" height="30px">';
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
// Appel de la fonction pour récupérer les 10 dernières recherches au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Appel de la fonction pour récupérer les 10 dernières recherches au chargement de la page
  fetchRecentSearches();

  // Mettre en place une actualisation automatique toutes les x secondes (par exemple, toutes les 60 secondes)
  setInterval(fetchRecentSearches, 1000);

  // Fonction pour récupérer les 10 dernières recherches
  function fetchRecentSearches() {
    fetch("/visitors/recent-searches")
      .then((response) => response.json())
      .then((data) => {
        // Mettre à jour l'affichage des 10 dernières recherches sur votre page
        updateRecentSearches(data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des 10 dernières recherches : ",
          error
        );
      });
  }

  function updateRecentSearches(data) {
    const recentSearchesList = document.getElementById("recent-searches-list");
    recentSearchesList.innerHTML = ""; // Effacer le contenu précédent

    data.forEach((search, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "d-flex",
        "justify-content-between",
        "mb-3",
        "align-items-center"
      );

      // Colonne Location
      const locationColumn = document.createElement("div");
      locationColumn.classList.add("text-center", "flex-grow-1", "col-3");

      // Ajouter l'image de drapeau
      const flagImage = document.createElement("img");
      flagImage.src = `https://flagcdn.com/w160/${search.countryCode.toLowerCase()}.png`;
      flagImage.alt = `${search.country} Flag`;
      flagImage.width = 40;
      locationColumn.appendChild(flagImage);

      // Ajouter le pays et la ville
      const locationText = document.createElement("div");
      locationText.textContent = `${search.country}/${search.city}`;
      locationColumn.appendChild(locationText);

      listItem.appendChild(locationColumn);

      // Colonne Time of Day
      const timeOfDayColumn = document.createElement("div");
      timeOfDayColumn.classList.add("text-center", "flex-grow-1", "col-3");
      const timeOfDayImage = document.createElement("img");
      timeOfDayImage.src =
        search.dayOrNight === "Jour"
          ? "https://res.cloudinary.com/dlcltznns/image/upload/v1708362034/pbnjcluffqy5hioxtft5.png"
          : "https://res.cloudinary.com/dlcltznns/image/upload/v1708362031/smnymgttfaehzeow9kkh.png";
      timeOfDayImage.alt = search.dayOrNight === "Jour" ? "Sun" : "Moon";
      timeOfDayImage.width = 30;
      timeOfDayImage.height = 30;
      timeOfDayColumn.appendChild(timeOfDayImage);
      listItem.appendChild(timeOfDayColumn);

      // Colonne Date
      const dateColumn = document.createElement("div");
      dateColumn.classList.add("text-center", "flex-grow-1", "col-3");

      // Calculer le temps écoulé
      const givenDate = new Date(search.created_at);
      const now = new Date();
      const diffMs = now - givenDate;
      const diffMin = Math.floor(Math.abs(diffMs / (1000 * 60)));
      let timeAgo;
      if (diffMin >= 1) {
        timeAgo = `${diffMin} min`;
      } else {
        timeAgo = `${(diffMs / 1000).toFixed(0)} sec`;
      }

      dateColumn.textContent = timeAgo;
      listItem.appendChild(dateColumn);

      // Colonne Temperature
      const temperatureColumn = document.createElement("div");
      temperatureColumn.classList.add("text-center", "flex-grow-1", "col-3");
      temperatureColumn.textContent = `${search.temperature}°C`;
      listItem.appendChild(temperatureColumn);

      recentSearchesList.appendChild(listItem);
    });
  }
});
