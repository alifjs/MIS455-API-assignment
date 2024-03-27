document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const countryInfoContainer = document.getElementById('countryInfo');

    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === '') {
            alert('Please enter a country name.');
            return;
        }

        fetch(`https://restcountries.com/v3.1/name/${searchTerm}?fullText=true`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    alert('Country not found.');
                    return;
                }
                const countryData = data[0];
                const countryHTML = `
                    <div class="country-card">
                        <img src="${countryData.flags.png}" alt="Flag">
                        <div class="country-details">
                            <p><strong>Country Name:</strong> ${countryData.name.common}</p>
                            <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
                            <p><strong>Area:</strong> ${countryData.area.toLocaleString()} sq km</p>
                            <p><strong>Capital City:</strong> ${countryData.capital[0]}</p>
                            <button class="show-weather-btn">Show Weather Details</button>
                            <div class="weather-details" style="display: none;">
                                <!-- Weather details will be dynamically populated here -->
                            </div>
                        </div>
                    </div>
                `;
                countryInfoContainer.innerHTML = countryHTML;

                const showWeatherBtn = document.querySelector('.show-weather-btn');
                showWeatherBtn.addEventListener('click', function() {
                    const lat = countryData.latlng[0];
                    const lon = countryData.latlng[1];
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=935de5efb8e9e2cc702728bd0356bf48`)
                        .then(response => response.json())
                        .then(weatherData => {
                            const weatherDetailsContainer = document.querySelector('.weather-details');
                            const temperatureCelsius = (weatherData.list[0].main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
                            weatherDetailsContainer.innerHTML = `
                                <p><strong>Temperature:</strong> ${temperatureCelsius} °C</p>
                                <p><strong>Weather:</strong> ${weatherData.list[0].weather[0].main}</p>
                                <p><strong>Description:</strong> ${weatherData.list[0].weather[0].description}</p>
                                <p><strong>Wind Speed:</strong> ${weatherData.list[0].wind.speed} m/s</p>
                                <p><strong>Humidity:</strong> ${weatherData.list[0].main.humidity}%</p>
                            `;
                            weatherDetailsContainer.style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                            alert('An error occurred while fetching weather data. Please try again later.');
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching country data:', error);
                alert('An error occurred while fetching country data. Please try again later.');
            });
    });
});
