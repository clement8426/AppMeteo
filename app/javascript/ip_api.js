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
