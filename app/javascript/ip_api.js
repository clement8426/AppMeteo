// Récupérer l'adresse IP de l'utilisateur en utilisant un service tiers
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


      // Call the weather API with the retrieved city
      callWeatherAPI(data.city, userIP, data);
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
      const weatherInfoDayOrNight = document.getElementById("weather-info-day-or-night");
      const isDay = weatherData.current.is_day;

      if (isDay) {
          weatherInfoDayOrNight.innerHTML = '<img src="../../assets/soleil.png" alt="Soleil" width="30px" height="30px">';
      } else {
          weatherInfoDayOrNight.innerHTML = '<img src="../../assets/lune.png" alt="Lune" width="30px" height="30px">';
      }
      const weatherInfoCloud = document.getElementById("weather-info-cloud");

      // Déterminez si le ciel est dégagé ou nuageux
      const isClearSky = weatherData.current.cloud === 0;
      if (isClearSky) {
          weatherInfoCloud.innerHTML = '<img src="../../assets/clear_sky.png" alt="Ciel clair" width="50px" height="50px">';
      } else {
          weatherInfoCloud.innerHTML = '<img src="../../assets/cloudy_sky.png" alt="Nuageux" width="50px" height="50px">';
      }
console.log(weatherData);
      weatherInfoCountry.innerHTML = `${weatherData.location.country}`;
      weatherInfoTown.innerHTML = `${weatherData.location.name}`;
      weatherInfoTemperature.innerHTML = `${weatherData.current.temp_c}°C`;
      weatherInfoWind.innerHTML = `${weatherData.current.wind_kph} km/h`;

      weatherInfoCondition.innerHTML = `${weatherData.current.condition.text}`;
      weatherInfoPrecipitation.innerHTML = `${weatherData.current.precip_mm} mm`;

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

getUserIP(callAPIWithUserIP);
