function getUserIP(callback) {
  fetch("https://api64.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      callback(data.ip);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération de l'adresse IP : ",
        error
      );
    });
}

// Appeler l'API avec l'adresse IP récupérée
function callAPIWithUserIP(userIP) {
  fetch(`https://geolocation-db.com/json/${userIP}`)
    .then((response) => response.json())
    .then((data) => {
      const flag = document.getElementById("flag");
      flag.innerHTML = `<img src="https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png"
      srcset="https://flagcdn.com/w320/${data.country_code.toLowerCase()}.png 2x"
      width="80"
      alt="${data.country_name}"
      >`;
      // Appeler l'API météo avec la ville récupérée
      callWeatherAPI(data.city, userIP, data);
      // Appeler l'API de devises avec le nom du pays récupéré
      getCurrencyInfo(userIP, data);
    })
    .catch((error) => {
      console.error("An error occurred while calling the API:", error);
    });
}

function callWeatherAPI(city, userIP, locationData) {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=17e97ad8c8fc4b7d9b2211954240602&q=${city}&aqi=no`
  )
    .then((response) => response.json())
    .then((weatherData) => {
      const weatherInfoLocalTime = document.getElementById(
        "weather-info-local-time"
      );
      const localTime = new Date(weatherData.location.localtime);
      const hours = localTime.getHours();
      const minutes = localTime.getMinutes();
      const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;

      const weatherInfo = document.getElementById("weather-info");
      const weatherInfoTown = document.getElementById("weather-info-town");
      const weatherInfoCountry = document.getElementById(
        "weather-info-country"
      );
      const weatherInfoTemperature = document.getElementById(
        "weather-info-temperature"
      );
      const weatherInfoWind = document.getElementById("weather-info-wind");
      const weatherInfoCondition = document.getElementById(
        "weather-info-condition"
      );
      const weatherInfoPrecipitation = document.getElementById(
        "weather-info-precipitation"
      );
      const weatherInfoDayOrNight = document.getElementById(
        "weather-info-day-or-night"
      );
      const weatherInfoCloud = document.getElementById("weather-info-cloud");

      recordSearch(city);
      displaySearchCount(city);

      if (weatherInfoWind) {
        weatherInfoWind.innerHTML = `${weatherData.current.wind_kph} km/h`;
      } else {
        console.error("Element weather-info-wind not found in the DOM.");
      }

      if (weatherInfoDayOrNight) {
        const isDay = weatherData.current.is_day;
        weatherInfoDayOrNight.innerHTML = isDay
          ? '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362034/pbnjcluffqy5hioxtft5.png" alt="Sun" width="30px" height="30px">'
          : '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362031/smnymgttfaehzeow9kkh.png" alt="Moon" width="30px" height="30px">';
      } else {
        console.error(
          "Element weather-info-day-or-night not found in the DOM."
        );
      }

      if (weatherInfoCloud) {
        const cloudCoverPercentage = weatherData.current.cloud;
        const isCloudy = cloudCoverPercentage >= 50; // Condition de nuageux
        weatherInfoCloud.innerHTML = isCloudy
          ? '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362021/qata0shzyb4uikhnnclt.png" alt="Nuageux" width="50px" height="50px">'
          : '<img src="https://res.cloudinary.com/dlcltznns/image/upload/v1708362026/vj08co2edbwpqxdahgbh.png" alt="Ciel clair" width="50px" height="50px">';
      } else {
        console.error("Element weather-info-cloud not found in the DOM.");
      }

      console.log(weatherData);

      if (weatherInfoCountry) {
        weatherInfoCountry.innerHTML = `${weatherData.location.country}`;
      } else {
        console.error("Element weather-info-country not found in the DOM.");
      }

      if (weatherInfoTown) {
        weatherInfoTown.innerHTML = `${weatherData.location.name}`;
      } else {
        console.error("Element weather-info-town not found in the DOM.");
      }

      if (weatherInfoTemperature) {
        weatherInfoTemperature.innerHTML = `${weatherData.current.temp_c}°C`;
      } else {
        console.error("Element weather-info-temperature not found in the DOM.");
      }

      if (weatherInfoCondition) {
        weatherInfoCondition.innerHTML = `${weatherData.current.condition.text}`;
      } else {
        console.error("Element weather-info-condition not found in the DOM.");
      }

      if (weatherInfoLocalTime) {
        weatherInfoLocalTime.innerHTML = `${formattedTime}`;
      } else {
        console.error("Element weather-info-localtime not found in the DOM.");
      }

      if (weatherInfoPrecipitation) {
        weatherInfoPrecipitation.innerHTML = `${weatherData.current.precip_mm} mm`;
      } else {
        console.error(
          "Element weather-info-precipitation not found in the DOM."
        );
      }

      // Combiner les données de localisation et de météo dans un seul objet
      const postData = {
        visitors: {
          country: locationData.country_name,
          city: locationData.city,
          userIP: userIP,
          countryCode: locationData.country_code.toLowerCase(),
          temperature: weatherData.current.temp_c,
          windSpeed: weatherData.current.wind_kph,
          weatherCondition: weatherData.current.cloud ? "Dégagé" : "Nuageux",
          conditionText: weatherData.current.condition.text,
          precipitation: weatherData.current.precip_mm,
          dayOrNight: weatherData.current.is_day ? "Jour" : "Nuit",
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
          console.error(
            "Erreur lors de l'envoi des données au serveur:",
            error
          );
        });
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'appel de l'API météo : ",
        error
      );
    });
}

function getCurrencyInfo(userIP, locationData) {
  fetch(`https://restcountries.com/v3.1/name/${locationData.country_name}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch currency data");
      }
      return response.json();
    })
    .then((data) => {
      const currencies = data[0]?.currencies;
      const currencyInfo = {
        code: Object.keys(currencies)[0],
        name: currencies[Object.keys(currencies)[0]].name,
        symbol: currencies[Object.keys(currencies)[0]].symbol,
      };
      updateCurrencyInfo(currencyInfo);
    })
    .catch((error) => {
      console.error("Error fetching currency data:", error);
    });
}

function updateCurrencyInfo(currencyInfo) {
  const currencyInfoElement = document.getElementById("currency-info");
  if (currencyInfoElement) {
    currencyInfoElement.innerHTML = `Currency: ${currencyInfo.name} (${currencyInfo.symbol})`;
  } else {
    console.error("Element currency-info not found in the DOM.");
  }
}

function recordSearch(city) {
  city = city.toLowerCase(); // Convertit la ville en minuscules
  let searches = JSON.parse(localStorage.getItem("searches")) || {};
  searches[city] = (searches[city] || 0) + 1;
  localStorage.setItem("searches", JSON.stringify(searches));
}

// Fonction pour afficher le nombre de recherches pour une ville donnée
function displaySearchCount() {
  let searches = JSON.parse(localStorage.getItem("searches")) || {};
  const searchCountElement = document.getElementById("search-count");

  // Effacer le contenu précédent
  searchCountElement.innerHTML = "";

  // Afficher le nombre de recherches pour chaque ville
  for (let city in searches) {
    const searchCount = searches[city];
    // Capitaliser la première lettre de la ville
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    const listItem = document.createElement("p");
    listItem.textContent = `Nombre de recherches pour ${capitalizedCity}: ${searchCount}`;
    searchCountElement.appendChild(listItem);
  }
}

getUserIP(callAPIWithUserIP);
