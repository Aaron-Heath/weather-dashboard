// Set Globals
const geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city-name}&limit=1&appid="
const weatherUrl =  'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid='
const exclusions = "&exclude=minutely,hourly,alerts"
const dateFormat = "MMMM D, YYYY" 
// This would normally be obscured as an environment variable
const key = "b86517d6f9f09daf180408ee9981a4cc"



// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
    // Select Main Elements
    var $mainContent = $("main").children("div");
    var $activeContainer = $("#active-search");
    var $previousContainer = $("#previous-search");

    var $cityInput = $("#city-input")
    var $submitBtn = $("#search-btn");

    // Create Event Listener for Button
    $submitBtn.on("click", function(event) {
        event.preventDefault();
        var city = $cityInput.val();
        console.log(city);

        geoFetch(city);

    })

    function geoFetch(city) {
        // Bulid fetch url
        var url = geoUrl.replace("{city-name}",city) + key

        // Fetch Data
        fetch(url)
            .then(function(response) {
                return response.json()
            }).then(function(data) {
                // Store data in more easily referenced variable
                var cityData = data[0];
                console.log(cityData);

                // Second Fetch to weather API
                weatherFetch(cityData);

            })
    } 

    function weatherFetch(cityData) {
        // Build fetch url
        console.log(cityData.lon);
        var url = weatherUrl.replace("{lat}",cityData.lat).replace("{lon}",cityData.lon) + key + exclusions;

        // Fetch Data
        fetch(url)
            .then(function(response) {
                return response.json()
            }).then(function(weatherData){
                console.log(weatherData);

                renderWeather(cityData,weatherData);
            })

    }

    function renderWeather(cityData,weatherData) {
        // Clear Active Container
        $activeContainer.html("");

        // Assign needed data for easier reference
        var today = dayjs().format(dateFormat);
        var mainWeather = weatherData.main;

        // Create and append city header
        var $cityName = $("<h2>");
        $cityName.text(cityData.name);
        $activeContainer.append($cityName);

        // Create and append subtitle with date
        var $dateSubtitle = $("<p>");
        $dateSubtitle.text(today);
        $dateSubtitle.addClass("subtitle")
        $activeContainer.append($dateSubtitle);

        // Create and append weather icon
        var $icon = $("<img>")
        var iconSource = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png"
        $icon.attr('src',iconSource);
        $icon.attr('alt', "Weather Icon");
        $activeContainer.append($icon);

        // Create and append Temp
        var $temp = $('<p>')
        $temp.text(`Temp: ${weatherData.main.temp} °F`)
        $activeContainer.append($temp);

        // Create and append Wind
        let $wind = $("<p>")
        $wind.text(`Wind: ${weatherData.wind.speed} MPH`);
        $wind.addClass("weather-stat");
        $activeContainer.append($wind);
        
        // Create and append Humidity
        let $humidity = $('<p>');
        $humidity.text(`Humidity: $${weatherData.main.humidity}%`);
        $activeContainer.append($humidity);


    }

});
