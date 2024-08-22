const search_input = document.querySelector(".search-input");
const currentweatherdiv = document.querySelector(".current-weather");
const hourlyWeatherdiv = document.querySelector(".weather-list");
const locationButton = document.querySelector(".location-button");
const inputText = document.querySelector(".search-input");

const API_KEY = "cbb21cf3cdaf46a19bd204916242008";

const weatherCodes = {
    clear : [1000],
    clouds:[1003, 1006, 1009],
    mist : [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain:[1186, 1189, 1192, 1195, 1243, 1246],
    snow:[1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],
}

const displayHourlyforecast = (hourly_data, data) => {
    const currentHour = new Date().setMinutes(0, 0, );
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    const next24HoursData = hourly_data;

    hourlyWeatherdiv.innerHTML = next24HoursData.map(item => {
        const temperature = item.temp_c;
        const time = item.time.split(" ")[1].substring(0, 5);
        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));

        return  `<li class="weather-items">
                    <p class="items">${time}</p>
                    <img src="${weatherIcon}.png" alt="" class="weather-icons" height="40px">
                    <p class="items-temperature">${temperature}&deg</p>
                </li>`;
    }).join("");

    // console.log(hourlyweatherHTML);
}

const getWeatherdetails = async (cityname) => {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityname}`;
    document.body.classList.remove("show-no-result");
    try{
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);

        const temperature = data.current.temp_c;
        const description = data.current.condition.text;

        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code))
        
        currentweatherdiv.querySelector(".temperature").innerHTML = `${temperature}<span>&degC</span>`;
        currentweatherdiv.querySelector(".description").innerHTML = `${description}`;
        currentweatherdiv.querySelector(".weather-icon").src = `${weatherIcon}.png`;

        const hourly_data = [...data.forecast.forecastday[0].hour];
        displayHourlyforecast(hourly_data, data);

    }
    catch(error){
        document.body.classList.add("show-no-result");
    }
}


search_input.addEventListener("keydown" , (e) => {
    const cityname = search_input.value.trim();
    if( e.key == "Enter" && cityname){
        // console.log(cityname);
        getWeatherdetails(cityname);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    getWeatherdetails("Patna");
});

locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
      fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
          const city = data.address.city;
          console.log(city);
          inputText.value = city; // Update input text
          const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}`;
          getWeatherdetails(API_URL);
        })
        .catch(error => {
          alert("Error getting location");
        });
    }, error => {
      alert("Location access denied. Please enable permission to use this feature.");
    });
  });