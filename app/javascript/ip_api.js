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
  fetch(`http://ip-api.com/json/${userIP}`)
    .then((response) => response.json())
    .then((data) => {
      // Traitez les données de réponse JSON ici
      console.log(data);
      console.log(data.countryCode);
      const flag = document.getElementById("flag");
      flag.innerHTML = `<img
      src="https://flagcdn.com/w160/${data.countryCode.toLowerCase()}.png"
      srcset="https://flagcdn.com/w320/${data.countryCode.toLowerCase()}.png 2x"
      width="50"
      alt="${data.country}">`;
      // Une fois que vous avez obtenu la ville de l'utilisateur, appelez l'API météo
      callWeatherAPI(data.city);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'appel de l'API : ",
        error
      );
    });
}

function callWeatherAPI(city) {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=17e97ad8c8fc4b7d9b2211954240602&q=${city}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const weatherInfo = document.getElementById("weather-info");
      weatherInfo.innerHTML = `
        <strong>${data.location.name}</strong><br>
        Température: <strong>${data.current.temp_c}°C</strong> <br>
        Vent:<strong>${data.current.wind_kph} km/h</strong> <br>
        Pluie: <strong>${data.current.precip_mm} mm</strong> <br>
        <strong>${data.current.is_day ? "Jour" : "Nuit"}</strong>
      `;
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'appel de l'API météo : ",
        error
      );
    });
}


getUserIP(callAPIWithUserIP);
