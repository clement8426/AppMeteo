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
      // Traitez les données de réponse JSON ici
      console.log(data);

      // Mise à jour du contenu de la balise <div> avec les informations sur la météo
      const weatherInfo = document.getElementById("weather-info");
      weatherInfo.innerHTML = `
        <strong>Ville:</strong> ${data.location.name}<br>
        <strong>Température actuelle:</strong> ${data.current.temp_c}°C<br>
        <strong>Sensation thermique:</strong> ${data.current.feelslike_c}°C<br>
        <strong>Direction du vent:</strong> ${data.current.wind_dir}<br>
        <strong>Vitesse du vent:</strong> ${data.current.wind_kph} km/h<br>
        <strong>Précipitations:</strong> ${data.current.precip_mm} mm<br>
        <strong>Jour ou nuit:</strong> ${data.current.is_day ? "Jour" : "Nuit"}
      `;
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'appel de l'API météo : ",
        error
      );
    });
}

// Utilisation :
getUserIP(callAPIWithUserIP);
