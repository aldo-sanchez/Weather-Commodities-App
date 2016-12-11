// Initialize Firebase
var config = {
apiKey: "AIzaSyD5onGD-yX2IvrbzyEiNJ2Y7DfsjNQz0EA",
authDomain: "weather-commodities-app.firebaseapp.com",
databaseURL: "https://weather-commodities-app.firebaseio.com",
storageBucket: "weather-commodities-app.appspot.com",
messagingSenderId: "917117502463"
};
firebase.initializeApp(config);

//===============API Variables====================
//token for accessing API
    //hard-coded---needs to be dynamically created from user input. Use moment.js
var token = "sUtCbQRELKcKTvcahYjUDGMtwcoeqrmz";
//data set is specific type of data called from NOAA api
    //hard-coded---needs to be dynamically created from user input. Use moment.js
var dataSet = "GSOM";
//category id's: TEMP, PRCP(precipitation), WATER, SUTEMP(summer temperature), SUPRCP(summer preciptation)
    //hard-coded---needs to be dynamically created from user input. Use moment.js
var dataCategory = "TEMP";
//data types
    //hard-coded---needs to be dynamically created from user input. Use moment.js
var dataType1 = "TMAX";
var dataType2 = "TAVG";
var dataType3 = "PRCP";
//location
//hard-coded---needs to be dynamically created from user input. Use moment.js
var loc = "CITY:US170002";
//station
//hard-coded---needs to be dynamically created from user input. Use moment.js
var stn = "GHCND:US1MOSL0050";
//start date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var startDate = "2010-01-01";
//end date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var endDate = "2016-12-31";
//name of commodity being searched
//hard-coded---needs to be dynamically created from user input.
var commodityName = "soybean";
//name of location queried for data
var locName;
//API return limit (max=1000)
var limit = "1000";

var locationType;
var locStation = false
//click event listener for station location (API call type)
$("#locationX").on('click',function(){
    locStation = true;
    dataLocationType();
})
//click event for city location (API call type)
$("#locationX").on('click',function(){
    locStation = true;
    dataLocationType();
})
//conditional for determining location type for correct API call
function dataLocationType(){
    if(locStation){
        locationType = "station"
    } else{
        locationType = "location"
    }
}
//===============API AJAX Calls===================
//AJAX url only for determining name of location
var nameQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations/GHCND:US1MOSL0050";
$.ajax({ url:nameQueryURL, headers:{ token:token } }).done(function(response){
     locName = response.name;
    console.log(locName);
});
//AJAX query url for TEMPERATURE weather data
var tempQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=TAVG&stationid=GHCND:USC00110764&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
$.ajax({ url:tempQueryURL, headers:{ token:token } }).done(function(response){
    var tempData = response.results;
    console.log(response);

    //API location id
    var locationId = loc;
    //variable for array of dates
    var dateArray = [];

    //collects temp and date data from API JSON and assigns to array index(i)
    function collectDateInfo(){
      for (var i = 0; i < tempData.length; i++){
        dateArray[i] = {
            date: tempData[i].date,
            temperature: {
                temp: tempData[i].value
            }
        }
      }
    }
    //looping through ajax JSON to store relevant data (date, temp) in array
    for(var i in tempData){
        //checks if property index has value
        if(tempData.hasOwnProperty(i)) {
            //call for function that populates weatherObject
            collectDateInfo(i);
        }
    }
        //dynamically created object of cleaned data for location, date, temp
    var temperature = {
      commodity: {
        name: commodityName,
        location: {
            Name: locName,
            date: {
                dateArray
            },
        }
      }
    }
    // =======FIREBASE===========
    var database = firebase.database();
    var weatherData = database.ref("weather/temperatureData");
    weatherData.push({
        temperature: temperature
    });
    console.log("====Constructed TEMP Object====");
    console.log(temperature);
});
////AJAX query url for PRECIPITATION weather data
var prcpQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=PRCP&stationid=GHCND:USC00110764&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
$.ajax({ url:prcpQueryURL, headers:{ token:token } }).done(function(response){
    var prcpData = response.results;
    console.log(response);
    //API location id
    var locationId = loc;
    //variable for array of dates
    var dateArray = [];
    //dynamically created object of cleaned data for location, date, temp
    precipitation = {
      commodity: {
        name: commodityName,
        location: {
            Name: locName,
            date: {
                dateArray
            },
        }
      }
    }
    //collects temp and date data from API JSON and assigns to array index(i)
    function collectDateInfo(){
      for (var i = 0; i < prcpData.length; i++){
        dateArray[i] = {
            dates: prcpData[i].date,
            precipitation: {
                prcp: prcpData[i].value
            }
        }
      }
    }
    //looping through ajax JSON to store relevant data (date, temp) in array
    for(var i in prcpData){
        //checks if property index has value
        if(prcpData.hasOwnProperty(i)) {
            //call for function that populates weatherObject
            collectDateInfo(i);
        }
    }
    //=======FIREBASE===========
    var database = firebase.database();
    var weatherData = database.ref("weather/precipitationData");
    weatherData.push({
        precipitation:precipitation
    });
    console.log("====Constructed PRECIPITATION Object====");
    console.log(precipitation);
});

