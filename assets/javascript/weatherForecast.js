var forecastApiKey = "71f593a93964af8f";
function weatherForecastApi() {
    var weatherForecastURL = "http://api.wunderground.com/api/"+forecastApiKey+"/forecast10day/q/"+latitude+","+longitude+".json";
    console.log("weatherForecastURL: "+weatherForecastURL)
    $.ajax({
        url: weatherForecastURL,
        method: 'GET'
    }).done(function(response){
        console.log(response)
        var data = response.forecast.simpleforecast.forecastday;
        for(var i = 0; i < data.length; i++){
            var day = data[i].date.weekday;
            var conditionsTxt = data[i].conditions;
            var tempHigh = data[i].high.fahrenheit;
            var tempLow = data[i].low.fahrenheit;
            var precipitationProb = data[i].pop;
            var imgURL = data[i].icon_url;
            var newLi = $('<li>');
            var imgElement = ('<img class = "responsive-img" src="'+imgURL+'">');
            var dayTitle = $('<h3>'+day+'</h3><h4>'+conditionsTxt+'</h4>')
            var weatherInfo = ('<h5>Temperature (F)</h5> '+tempHigh+'/'+tempLow+'<h5>Chance of Rain (%)</h5>'+precipitationProb);
            var newChildLi = $('#weatherForecast').append(newLi);
            newLi.append(dayTitle);
            newLi.append(imgElement);
            newLi.append(weatherInfo);
        }
    });
};

