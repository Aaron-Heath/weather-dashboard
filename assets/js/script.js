// Set Globals
const geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city-name}&limit=1&appid="
const weatherUrl =  'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid='
const forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid='
const exclusions = "&exclude=minutely,hourly,alerts"
const todayFormat = "MMMM D, YYYY"
const forecastFormat = "ddd M/D"
// This would normally be obscured as an environment variable
const key = "b86517d6f9f09daf180408ee9981a4cc"

const storageKey = "weatherSearches"
var previousSearches = JSON.parse(localStorage.getItem(storageKey));
if(previousSearches === null) {
    previousSearches = [];
}



// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
    // Select Main Elements
    var $mainContent = $("main").children("div");
    var $activeContainer = $("#active-search");
    var $forecastContainer = $('#forecast');
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

    // Create Event Listener for Previous Searches
    $previousContainer.on("click","button", function(event) {
        let $target = $(event.target);
        // console.log($target.attr('id'));
        geoFetch($target.attr('id'));
    })

    function storeSearch(newSearch) {
        if(previousSearches.length > 0) {
            for (let search of previousSearches) {
                if (search.city === newSearch.city) {
                    return;
                }
            }
        }

        previousSearches.push(newSearch);
        // Save to Local Storage
        localStorage.setItem(storageKey, JSON.stringify(previousSearches));
    }

    // Render Previous Searches
    function renderPrevious() {
        if(previousSearches.length <= 0) {
            return;
        }

        $previousContainer.html("")
        for(search of previousSearches) {
            let $searchCard = $("<button>");
            $searchCard.attr("class","previous-search");
            $searchCard.attr("id", search.city);
            $searchCard.text(search.city);
            $searchCard.appendTo($previousContainer);
        }
    }

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
        var url = forecastUrl.replace("{lat}",cityData.lat).replace("{lon}",cityData.lon) + key + exclusions;

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
        $forecastContainer.html("")
        
        // Assign needed data for easier reference
        var today = dayjs().format(todayFormat);
        var mainWeather = weatherData.list[0].main;

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
        var iconSource = "http://openweathermap.org/img/w/" + weatherData.list[0].weather[0].icon + ".png"
        $icon.attr('src',iconSource);
        $icon.attr('alt', "Weather Icon");
        $activeContainer.append($icon);

        // Create and append Temp
        var $temp = $('<p>')
        $temp.text(`Temp: ${Math.round(weatherData.list[0].main.temp)} °F`)
        $activeContainer.append($temp);

        // Create and append Wind
        let $wind = $("<p>")
        $wind.text(`Wind: ${weatherData.list[0].wind.speed} MPH`);
        $wind.addClass("weather-stat");
        $activeContainer.append($wind);
        
        // Create and append Humidity
        let $humidity = $('<p>');
        $humidity.text(`Humidity: ${weatherData.list[0].main.humidity}%`);
        $activeContainer.append($humidity);

        // Loop for forecast cards
        for(let i = 8; i < weatherData.list.length; i+=8) {
            
            // Get this iteration's weather data for ease of access
            let iterWeather = weatherData.list[i];
            let iterDate = dayjs(iterWeather.dt_txt).format(forecastFormat);
            // Create parent element
            let $forecastCard = $("<div>");
            $forecastCard.addClass("forecast-card");

            // Date Content
            let $dateBlock = $("<div>");
            $dateBlock.addClass("forecast-date");
            $dateBlock.append($("<p>").addClass("forecast-day").text(iterDate.split(" ")[0]));
            $dateBlock.append($("<p>").addClass("forecast-monthday").text(iterDate.split(" ")[1]));

            $forecastCard.append($dateBlock);

            // Forecast Content
            let $forecastContent = $("<div>");
            // Icon
            let $iterIcon = $("<img>");
            let iterIconSource = "http://openweathermap.org/img/w/" + iterWeather.weather[0].icon + ".png"
            $iterIcon.attr("src",iterIconSource);
            $iterIcon.attr("alt","Forecast Icon");
            $forecastCard.append($iterIcon);

            let $paragraph = $("<p>");
                // Temperature
            let $iterTemp = $("<span>");
            $iterTemp.addClass("forecast-temp");
            $iterTemp.text(`${Math.round(iterWeather.main.temp)}°`);
            $iterTemp.appendTo($paragraph);
            $forecastCard.append($paragraph);

            // Humidity & Windspeed
            let $suppDiv = $("<div>");
            $suppDiv.attr("class", "supp-weather");
            $suppDiv.append(
                $("<p>").text(`Humidity: ${iterWeather.main.humidity}%`)
                );
            $suppDiv.append(
                $("<p>").text(`Wind: ${Math.round(iterWeather.wind.speed)} MPH`)
                );
            
            $forecastCard.append($suppDiv);



            $forecastContainer.append($forecastCard);
        }

        // Render previous searches BEFORE adding most recent search
        renderPrevious();
        // Add to previous search
        storeSearch(
            {
                city: cityData.name,
                temp: `${Math.round(weatherData.list[0].main.temp)}°F`
            });
    }




});
