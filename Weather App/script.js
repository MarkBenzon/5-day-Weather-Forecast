
const cityInput = document.querySelector('.city-search');
const searchButton = document.querySelector('.search-button');
const forecastInfo = document.querySelector('.forecast');
const notFound = document.querySelector('.search-message');
const searchCity = document.querySelector('.search-city');

const apiKey = '8f681a4010a8169b2608f437ea4ea273';


searchButton.addEventListener('click', handleSearch);
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


window.addEventListener('load', () => {
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
        cityInput.value = lastSearchedCity;
        updateWeatherInfo(lastSearchedCity); 
    }
});


function handleSearch() {
    if (cityInput.value.trim() !== '') {
        const city = cityInput.value;
        updateWeatherInfo(city);
        localStorage.setItem('lastSearchedCity', city); 
        cityInput.blur(); 
}
}


async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod !== 200) {
        showDisplaySection('not-found');
        return;
    }

    const forecastData = await getFetchData('forecast', city);
    if (forecastData.cod !== "200") {
        showDisplaySection('not-found');
        return;
    }

    displayWeather(weatherData);
    displayForecast(forecastData);
    showDisplaySection('forecast');
}


function showDisplaySection(section) {
    [forecastInfo, searchCity, notFound].forEach(sec => sec.style.display = 'none');
    if (section === 'forecast') {
        forecastInfo.style.display = 'block';
    } else {
        notFound.style.display = 'block';
    }
}


function displayWeather(data) {
    const cityName = document.querySelector('.city');
    const temperature = document.querySelector('.temp');
    const weatherIcon = document.querySelector('.weather-icon');

    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.five-forecast');
    forecastContainer.innerHTML = ''; 

    const uniqueDates = new Set();
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDates.has(date) && uniqueDates.size < 5) {
            uniqueDates.add(date);
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h5 class="forecast-date">${date}</h5>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="" class="forecast">
                <h5 class="forecast-temp">${Math.round(item.main.temp)}°C</h5>
            `;
            forecastContainer.appendChild(forecastItem);
        }
    });

    forecastContainer.style.display = 'flex'; 
}
