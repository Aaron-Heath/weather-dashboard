// Set Globals
const geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city-name}&limit=1&appid="
const weatherUrl =  'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid='
const exclusions = "&exclude=minutely,hourly,alerts"
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

        // Create Header with city name and date
        var $cityName = $("<h2>");
        var today = dayjs().format("(M/DD/YYYY)");

        // Set attributes
        $cityName.text(`${cityData.name} ${today}`);

        // Append
        $activeContainer.append($cityName);


        // Create P tag with Temp

        // Create P tag with Wind

        // Create P tag with humidity
    }

});
