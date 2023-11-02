// Set Globals
const geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city-name}&limit=1&appid="
const weatherUrl =  'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid='
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
        let url = geoUrl.replace("{city-name}",city)

        // perform fetch
        fetch(url + key)
            .then(function(response) {
                return response.json()
            }).then(function(data) {
                // Store data in more easily referenced variable
                var cityData = data[0];

                // Get Relevant City Data for next fetch


            })
    } 

});
