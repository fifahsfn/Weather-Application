
document.addEventListener("DOMContentLoaded", function() {
    // Fetch weather data based on user's location
    fetchWeatherData();
});

function fetchWeatherData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiKey = 'eb1142b48ede275aef6d2019fbea2131'; // Replace with your API key
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Update location and current weather
                    updateLocation(data);
                    updateCurrentWeather(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    showError('Unable to fetch weather data. Please try again later.');
                });

            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    // Update forecast
                    updateForecast(data);
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                    showError('Unable to fetch forecast data. Please try again later.');
                });
        }, function(error) {
            // Handle geolocation errors
            showError('Geolocation error: ' + error.message);
        });
    } else {
        // Geolocation is not supported by this browser
        showError('Geolocation is not supported by this browser.');
    }
}

function updateLocation(data) {
    const location = data.name && data.sys && data.sys.country ? `${data.name}, ${data.sys.country}` : 'Location not available';
    document.getElementById('city-country').textContent = location;
}

function updateCurrentWeather(data) {
    const temperature = `Temperature: ${data.main.temp}°C`;
    const conditions = `Conditions: ${data.weather[0].description}`;
    document.getElementById('temperature').textContent = temperature;
    document.getElementById('conditions').textContent = conditions;
    const iconCode = data.weather[0].icon;
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = getWeatherIconClass(iconCode);
}

function updateForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = ''; // Clear previous forecast data
    const forecasts = data.list.slice(0, 6); // Display only the next 5 forecasts
    forecasts.forEach(forecast => {
        const dateTime = new Date(forecast.dt * 1000);
        const date = dateTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const time = dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const temperature = `Temperature: ${forecast.main.temp}°C`;
        const conditions = `Conditions: ${forecast.weather[0].description}`;
        const iconCode = forecast.weather[0].icon;
        const weatherIconClass = getWeatherIconClass(iconCode);
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <div>
                <p>${date} ${time}</p>
                <p>${temperature}</p>
                <p>${conditions}</p>
            </div>
            <i class="icon ${weatherIconClass}"></i>
        `;
        forecastList.appendChild(forecastItem);
    });
}

function getWeatherIconClass(iconCode) {
    // Map OpenWeatherMap icon codes to Font Awesome icon classes
    switch (iconCode) {
        case '01d':
        case '01n':
            return 'fas fa-sun'; // clear sky
        case '02d':
        case '02n':
            return 'fas fa-cloud-sun'; // few clouds
        case '03d':
        case '03n':
            return 'fas fa-cloud'; // scattered clouds
        case '04d':
        case '04n':
            return 'fas fa-cloud'; // broken clouds
        case '09d':
        case '09n':
            return 'fas fa-cloud-showers-heavy'; // shower rain
        case '10d':
        case '10n':
            return 'fas fa-cloud-rain'; // rain
        case '11d':
        case '11n':
            return 'fas fa-bolt'; // thunderstorm
        case '13d':
        case '13n':
            return 'fas fa-snowflake'; // snow
        case '50d':
        case '50n':
            return 'fas fa-smog'; // mist
        default:
            return 'fas fa-question'; // unknown condition
    }
}

function showError(message) {
    // Display error message
    document.getElementById('city-country').textContent = message;
    document.getElementById('temperature').textContent = 'Temperature: --';
    document.getElementById('conditions').textContent = 'Conditions: --';
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = 'fas fa-exclamation-triangle'; // Display error icon
}
