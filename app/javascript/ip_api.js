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
      console.log(data);
      console.log(data.city, data.country_code2);
      console.log(userIP);
      const flag = document.getElementById("flag");
      flag.innerHTML = `<img
      src="https://flagcdn.com/w160/${data.country_code.toLowerCase()}.png"
      srcset="https://flagcdn.com/w320/${data.country_code.toLowerCase()}.png 2x"
      width="50"
      alt="${data.country}">`;

      // Appeler l'API météo avec la ville récupérée
      callWeatherAPI(data.city, userIP, data);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'appel de l'API:",
        error
      );
    });
}

function callWeatherAPI(city, userIP, locationData) {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=17e97ad8c8fc4b7d9b2211954240602&q=${city}&aqi=no`
  )
    .then((response) => response.json())
    .then((weatherData) => {
      console.log(weatherData);
      const weatherInfo = document.getElementById("weather-info");
      weatherInfo.innerHTML = `
        <strong>${weatherData.location.name}</strong><br>
        Température: <strong>${weatherData.current.temp_c}°C</strong><br>
        Vent: <strong>${weatherData.current.wind_kph} km/h</strong><br>
        Nuage: <strong>${
          weatherData.current.cloud ? "Dégagé" : "Nuageux"
        }</strong><br>
        Condition: <strong>${weatherData.current.condition.text}</strong><br>
        Précipitations: <strong>${weatherData.current.precip_mm} mm</strong><br>
        Jour ou Nuit: <strong>${
          weatherData.current.is_day ? "Jour" : "Nuit"
        }</strong>
      `;
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
          console.log("Données envoyées avec succès");
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
