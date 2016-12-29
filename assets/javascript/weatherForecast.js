//forecast api key
var forecastApiKey = "71f593a93964af8f";
//function runs weather forecast API, and appends new data info into page
function weatherForecastApi() {
    //AJAX query url
    var weatherForecastURL = "http://api.wunderground.com/api/"+forecastApiKey+"/forecast10day/q/"+latitude+","+longitude+".json";
    //AJAX jquery call
    $.ajax({
        url: weatherForecastURL,
        method: 'GET'
    }).done(function(response){
        //variable points directly to array of relevant weather forecast data
        var data = response.forecast.simpleforecast.forecastday;
        //loops through forecast array data
        for(var i = 0; i < data.length; i++){
            //stores text string of Day
            var day = data[i].date.weekday;
            //stores text string description of day's weather condition(i.e. 'cloudy')
            var conditionsTxt = data[i].conditions;
            //stores high temperature for the day
            var tempHigh = data[i].high.fahrenheit;
            //stores low temperature for the day
            var tempLow = data[i].low.fahrenheit;
            //stores probability of precipitation for the day (%)
            var precipitationProb = data[i].pop;
            //stores the url for the image for that day's weather
            var imgURL = data[i].icon_url;
            //jquery creates new <li> element
            var newLi = $('<li>');
            //jquery creates new img element with responsive class attribute (materialize) and src attribute with img url
            var imgElement = ('<img class = "responsive-img" src="'+imgURL+'">');
            // jquery stores h3 and h4 title elements for the day and conditon
            var dayTitle = $('<h3>'+day+'</h3><h4>'+conditionsTxt+'</h4>')
            //stores h5 title elemtns of weather data
            var weatherInfo = ('<h5>Temperature (F)</h5> '+tempHigh+'/'+tempLow+'<h5>Chance of Rain (%)</h5>'+precipitationProb);
            //appends <li> element in #weatherForecast location, at ul element
            var newChildLi = $('#weatherForecast').append(newLi);
            //appends title, img, weather info under <li> element
            newLi.append(dayTitle);
            newLi.append(imgElement);
            newLi.append(weatherInfo);
        }
    });
};

