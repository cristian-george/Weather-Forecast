const API_KEY = 'YOUR_OPEN_WEATHER_MAP_API_HERE';

// get the weather for the specified location
async function getWeather(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// get the forecast for the specified location
async function getForecast(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// update the page with the weather information
function displayWeather(data) {
    // update the background image
    const weather = data.weather[0].main.toLowerCase();
    let imageUrl = 'images/';
    if (weather === 'clear') {
        imageUrl += 'sunny.jpg';
    } else if (weather === 'clouds') {
        imageUrl += 'cloudy.jpg';
    } else if (weather === 'rain') {
        imageUrl += 'rainy.jpg';
    } else if (weather === 'snow') {
        imageUrl += 'snowy.jpg';
    } else if (weather == 'fog') {
        imageUrl += 'foggy.jpg';
    }
    document.body.style.backgroundImage = `url('${imageUrl}')`;

    // update the weather information
    const location = data.name;
    const time = new Date(data.dt * 1000).toLocaleString();
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    document.getElementById('successMessage').innerHTML = `
    <p>Location: ${location}</p>
    <p>Time: ${time}</p>
    <p>Temperature: ${temperature}°C</p>
    <p>Description: ${description}</p>
  `;
    document.getElementById('successMessage').style.display = 'block';
}

// update the page with the forecast information
function displayForecast(data) {
    const location = data.city.name;
    const forecastList = data.list;
    let forecastHtml = `<h2>Forecast for ${location}</h2><div class="list-group">`;
    forecastList.forEach(forecast => {
        const time = new Date(forecast.dt * 1000).toLocaleString();
        const temperature = Math.round(forecast.main.temp - 273.15);
        const iconUrl = 'https://openweathermap.org/img/wn/' + forecast.weather[0].icon + '@2x.png';
        const description = forecast.weather[0].description;
        forecastHtml += `<a href="#" class="list-group-item list-group-item-action"> <img src="${iconUrl}"> <h5 class="mb-1">${time}</h5> <p class="mb-1">Temperature: ${temperature}°C</p> <p class="mb-1">Description: ${description}</p> </a>`;
    });
    forecastHtml += `</div>`;
    document.getElementById('forecastList').innerHTML = forecastHtml;
}

// save a location as a favourite
function saveFavourite(location) {
    // check if the location is already saved
    if (localStorage.getItem(location)) {
        alert('This location is already saved as a favourite.');
        return;
    }
    // get the weather for the location
    getWeather(location).then(data => {
        const time = new Date(data.dt * 1000).toLocaleString();
        const temperature = Math.round(data.main.temp - 273.15);
        const iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        const description = data.weather[0].description;
        localStorage.setItem(location, JSON.stringify({ time, temperature, iconUrl, description }));
    });
}

// load the favourite places
function loadFavourites() {
    const favourites = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = JSON.parse(localStorage.getItem(key));
        favourites.push({ location: key, ...value });
    }
    return favourites;
}

// handle the submit button click
document.getElementById('submitBtn')?.addEventListener('click', () => {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value;
    // check if the input is not empty
    if (!location) {
        document.getElementById('errorMessage').innerHTML = 'Please enter a location.';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    // hide the error message
    document.getElementById('errorMessage').style.display = 'none';
    // get the weather for the location
    getWeather(location).then(data => {
        // check if the location is valid
        if (data.cod !== 200) {
            document.getElementById('errorMessage').innerHTML = 'Invalid location.';
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }
        // display the weather information
        displayWeather(data);
        // get the forecast for the location
        getForecast(location).then(forecastData => {
            // display the forecast information
            displayForecast(forecastData);
        });
    });
});

// handle the favourite button click
document.getElementById('saveBtn')?.addEventListener('click', () => {
    const location = document.getElementById('locationInput').value;
    // check if the input is not empty
    if (!location) {
        alert('Please enter a location.');
        return;
    }
    // save the location as a favourite
    saveFavourite(location);
});

// update the page with a list of favourite places
function onLoadFavourites() {
    // load the favourite places
    const favourites = loadFavourites();

    if (!favourites.length) {
        $('#favouritePlacesList').html('<li class="list-group-item">No favourite places saved</li>');
        $('#clearFavouritesBtn').hide();
        return;
    }

    let favouritesHtml = `<h2>Favourite Places</h2><div class="list-group">`;
    favourites.forEach(favourite => {
        favouritesHtml += `<a href="#" class="list-group-item list-group-item-action"> <img src="${favourite.iconUrl}"> <h5 class="mb-1">${favourite.location}</h5> <p class="mb-1">Time: ${favourite.time}</p> <p class="mb-1">Temperature: ${favourite.temperature}°C</p> <p class="mb-1">Description: ${favourite.description}</p> </a>`;
    });

    favouritesHtml += `</div>`;
    document.getElementById('favouritePlacesList').innerHTML = favouritesHtml;
    $('#clearFavouritesBtn').show();
}

// handle the clear favourites button click
document.getElementById('clearFavouritesBtn')?.addEventListener('click', () => {
    localStorage.clear();
    document.getElementById('favouritePlacesList').innerHTML = null;

    $('#favouritePlacesList').html('<li class="list-group-item">No favourite places saved</li>');
    $('#clearFavouritesBtn').hide();
});




const locations = [
    'Arad', 'Bacău', 'Baia Mare', 'Bistriţa', 'Botoşani',
    'Brăila', 'Braşov', 'Bucureşti', 'Buzău', 'Călăraşi',
    'Cluj-Napoca', 'Constanţa', 'Craiova', 'Deva', 'Drobeta Turnu Severin',
    'Focşani', 'Galaţi', 'Iaşi', 'Ploieşti', 'Timişoara',
];

async function displayWeatherForLocations() {
    let label = `<h2>Weather of Romanian's cities</h2>`;
    let locationsHtml = `<div class="list-group d-flex flex-row flex-wrap">`;

    locations.forEach(location => {
        // get the weather for the location
        getWeather(location).then(data => {
            const temperature = Math.round(data.main.temp - 273.15);
            const iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
            locationsHtml += `<a href="#" class="list-group-item w-50 list-group-item-action"> <img src="${iconUrl}"> <h5 class="mb-1">${location}</h5> <h5 class="mb-1">${temperature}°C</h5> </a>`;
        });

    });
    locationsHtml += `</div>`;

    let loading = `<p align="center"><img width="150" src="images/gif.gif"></p>`;
    document.getElementById('label').innerHTML = loading;

    setTimeout(() => {
        document.getElementById('label').innerHTML = label;
        document.getElementById('locationsList').innerHTML = locationsHtml;
    }, 2000);
}