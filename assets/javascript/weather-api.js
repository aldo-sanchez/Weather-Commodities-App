// Initialize Firebase
var config = {
apiKey: "AIzaSyD5onGD-yX2IvrbzyEiNJ2Y7DfsjNQz0EA",
authDomain: "weather-commodities-app.firebaseapp.com",
databaseURL: "https://weather-commodities-app.firebaseio.com",
storageBucket: "weather-commodities-app.appspot.com",
messagingSenderId: "917117502463"
};
firebase.initializeApp(config);
//===============Finance API Variables====================
//token for accessing API

var token = "umJmbh6p4d37Z8soYvHB";
var wheat = "COM/WLD_WHEAT_US_SRW";
var coffee = "COM/PCOFFOTM_USD";
var corn = "COM/PMAIZMT_USD";
var cotton = "COM/COTTON";
var timber = "COM/WLD_ITIMBER";
var cocoa = "COM/WLD_COCOA";
var orange = "COM/WLD_ORANGE"
var soybean = "COM/WLD_SOYBEANS";
var commodity = corn;

//===============Weather API Variables====================
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
var stn;
//start date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var startDate = "2010-01-01";
//end date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var endDate = "2016-12-31";
//name of commodity being searched
//hard-coded---needs to be dynamically created from user input.
var commodityName;
//name of location queried for data
var locName;
//API return limit (max=1000)
var limit = "1000";

//============click events=============
/*
1. need to set commodityName, location, start date, end date
2. only call API once all variables have been set (use submit button?)
*/
var locEnetered = false;
var commodityEntered = false;
//click event for corn commodity
    //sets commodity name
$("#commodity-corn-btn").on('click',function(){
    commodityEntered = true
    //add data attribute, data-name = corn
    $(this).attr('data-name', 'corn');
});
//click event for location
    //sets name of station from map location
$("#locationIllinois").on('click',function(){
    //gets data attribute from button clicked
    locEntered = true;
    stn = $(this).data('id');
    console.log("station id (stn)")
    console.log(stn)
    locationApiQuery();
});

//click event for submit button (all data collected)
    //here coded for input-type
$("#submit-button").on('click',function(){
    //checks if location and commodity entered
    if (!commodityEntered) {
        alert("choose commodity!")
    } else if (!locEntered) {
        alert("choose location!")
    } else {
        //commodityName set from data attribute of button element
        commodityName = $("#commodity-corn-btn").data('name');
        //gets input text from start date input field with id = #startDate-submit
        startDate = moment($("#startDate-submit").val().trim(), "MM-DD-YYYY").format("YYYY-MM-DD");
        //gets input text from start date input field with id = #startDate-submit
        endDate = moment($("#endDate-submit").val().trim(), "MM-DD-YYYY").format("YYYY-MM-DD");

        // run weather data API functions - get data and store into firebase
        temperatureApiQuery();
        precipitationApiQuery();
        financeApiQuery();
        console.log("commodity Name variable: " + commodityName);
        console.log("start date: " + startDate);
        console.log("end date: " + endDate);
    }
    return false;

});
//===============API AJAX Calls===================
function locationApiQuery() {
    //AJAX url only for determining name of location
    var nameQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations/"+stn;
    $.ajax({ url:nameQueryURL, headers:{ token:token } }).done(function(response){
         locName = response.name;
        console.log(locName);
    });
}
//AJAX query url for TEMPERATURE weather data
function temperatureApiQuery() {
    var tempQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=TAVG&stationid="+stn+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
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
                        date: moment(tempData[i].date).format('YYYY-MM-DD'),
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
        // =======FIREBASE===========
        var database = firebase.database();
        var weatherData = database.ref("weather/temperature/commodity/"+commodityName+"/location/"+locName);
        weatherData.push({
            dates: dateArray
        });
        console.log("====Constructed TEMP dateArray====");
        console.log(dateArray);
    });
};

//AJAX query url for PRECIPITATION weather data
function precipitationApiQuery() {
    var prcpQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=PRCP&stationid="+stn+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
    $.ajax({ url:prcpQueryURL, headers:{ token:token } }).done(function(response){
        var prcpData = response.results;
        console.log(response);
        //API location id
        var locationId = loc;
        //variable for array of dates
        var dateArray = [];
        //collects temp and date data from API JSON and assigns to array index(i)
        function collectDateInfo(){
          for (var i = 0; i < prcpData.length; i++){
            dateArray[i] = {
                dates: moment(prcpData[i].date).format('YYYY-MM-DD'),
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
        var weatherData = database.ref("weather/precipitation/commodity/"+commodityName+"/location/"+locName);
        weatherData.push({
            dates:dateArray
        });
        console.log("====Constructed PRECIPITATION dateArray====");
        console.log(dateArray);
    });
};
//AJAX query for finance data
function financeApiQuery() {
    var queryURL="https://www.quandl.com/api/v3/datasets/"+commodity+".json?api_key="+token+"&start_date=2010-01-01&end_date=2016-01-01";
    var data = [];
    var dateArray = [];
    $.ajax({url:queryURL,method:'Get'}).done(function(response){
        data = response.dataset.data;
        function collectDateInfo(){
            for (var i = 0; i < data.length; i++){
                dateArray[i] = {
                    date: data[i][0],
                    price: {
                        price: data[i][1]
                    }
                }
            }
        }
        for (var i in data){
            collectDateInfo(i);
        }
        // dateArray.reverse();
        dateArray = dateArray.reverse();
        var database = firebase.database();
        var financeData = database.ref("finance/commodity/"+commodityName);
        financeData.push({
            dates:dateArray
        })
    });
}

//=========Querying Firebase==========
function firebaseTempQuery() {
    var tempRef = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName);
    tempRef.then(function(){
        return tempRef.once
        console.log("tempData Query");
        console.log(snapshot);
        var tempData = snapshot.dates.val();
        console.log('tempData variable')
        console.log(tempData)
        // for(var i =0; i < snapshot.length)

    })
}
firebaseTempQuery();

