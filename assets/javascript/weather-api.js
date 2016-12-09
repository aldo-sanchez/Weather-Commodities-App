// Initialize Firebase
var config = {
apiKey: "AIzaSyD5onGD-yX2IvrbzyEiNJ2Y7DfsjNQz0EA",
authDomain: "weather-commodities-app.firebaseapp.com",
databaseURL: "https://weather-commodities-app.firebaseio.com",
storageBucket: "weather-commodities-app.appspot.com",
messagingSenderId: "917117502463"
};
firebase.initializeApp(config);

//token for accessing API
var token = "sUtCbQRELKcKTvcahYjUDGMtwcoeqrmz";

var dataSet = "GSOM";
//category id's: TEMP, PRCP(precipitation), WATER, SUTEMP(summer temperature), SUPRCP(summer preciptation)
var dataCategory = "TEMP";
//data type
var dataType1 = "TMAX";

var dataType2 = "TAVG";

var dataType3 = "PRCP";
//location
var loc = "CITY:US170002";
//station
var station = "GHCND:USC00110072";
//start date
var startDate = "2005-05-01";
//end date
var endDate = "2010-12-31";
//AJAX query
var queryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid="+dataType2+"&locationid="+loc+"&units=metric&startdate=2005-01-01&enddate=2010-12-31&limit=10";
$.ajax({ url:queryURL, headers:{ token:token } }).done(function(response){
	// console.log(response);
    var data = response.results;
    //dynamically created object of cleaned data for location, date, temp
    var weatherObj = {};
    console.log(data);
    //function to fetch JSON date, temp, and location and creates new property on this object
    function weatherMetaData(location, date, temp) {
        this.location = location;
        this.date = date;
        this.temp = temp;
    }
    //looping through ajax JSON to store relevant data (date, temp) in array
    for(var i in data){
        //checks if property index has value
        if(data.hasOwnProperty(i)) {
            //variable holds date data for i object
            var dateData = data[i].date;
            // variable holds temperature data for i object
            var tempData = data[i].value;
            //creates location, date, and temp property on each property index of weather Obj.
            weatherObj[i] = new weatherMetaData(loc, dateData, tempData);
        }
    }
    console.log("constructed object: ");
    console.log(weatherObj);
})
  var database = firebase.database();
  var weatherData = database.ref();
  function storeData() {
    weatherData.push()
  }
