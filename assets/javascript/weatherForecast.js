var forecastApiKey = "71f593a93964af8f";
function weatherForecastApi() {
    var weatherForecastURL = "http://api.wunderground.com/api/"+forecastApiKey+"/forecast10day/q/"+latitude+","+longitude+".json";
    console.log("weatherForecastURL: "+weatherForecastURL)
    $.ajax({
        url: weatherForecastURL,
        method: 'GET'
    }).done(function(response){
        console.log(response)
    });
};

