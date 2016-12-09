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
var station = "GHCND:USC00110072";
//start date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var startDate = "2005-05-01";
//end date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var endDate = "2010-12-31";
//name of commodity being searched
//hard-coded---needs to be dynamically created from user input.
var commodityName = "corn";
//name of location queried for data
var locName;

//===============API AJAX Calls===================
//AJAX url only for determining name of location
var nameQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/locations/"+loc;
$.ajax({ url:nameQueryURL, headers:{ token:token } }).done(function(response){
     locName = response.name;
    console.log();
});
//AJAX query url for actual weather data
var queryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid="+dataType2+"&locationid="+loc+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit=500";
$.ajax({ url:queryURL, headers:{ token:token } }).done(function(response){
    var data = response.results;
    console.log(data);
    //API location id
    var locationId = loc;
    //variable for array of dates
    var dateArray = [];
    //dynamically created object of cleaned data for location, date, temp
    var weatherTempObject = {
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
      for (var i = 0; i < data.length; i++){
        dateArray[i] = {
            date: data[i].date,
            temp: data[i].value
            }
      }
    }
    //looping through ajax JSON to store relevant data (date, temp) in array
    for(var i in data){
        //checks if property index has value
        if(data.hasOwnProperty(i)) {
            //call for function that populates weatherObject
            collectDateInfo(i);
        }
    }
    var database = firebase.database();
    var weatherData = database.ref();
    weatherData.push({
        weatherTemp: weatherTempObject
    })
    console.log("====Constructed Object====");
    console.log(weatherTempObject);
});

