//arrays for graphing
var actualIndex;
var startIndex;
var endIndex;
var startDateMonths;
var endDateMonths;
var rawPrecipData = [];

var tempArray = [];
var tempDateArray = [];
var precipDateArray = [];

var precipArray = [];
var priceArray = [];
var financeDateArray = [];

var tempApiError = '';
var precipApiError = '';
var financeApiError = '';
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

var apiKey = "umJmbh6p4d37Z8soYvHB";
var soybeanFinance = "CHRIS/CME_S2";
var cornFinance = "CHRIS/CME_C2";
var wheatFinance = "CHRIS/CME_W2";
var cottonFinance = "CHRIS/ICE_CT1";
var cattleFinance = "CHRIS/CME_LC2";
var commodityFinance = '';
// var commodityFinance = corn;

function assignCommodityFinance() {

    if (commodityName == 'corn'){
        commodityFinance = cornFinance;
    }
    else if(commodityName == 'soybean'){
        commodityFinance = soybeanFinance;
    }
    else if (commodityName == 'wheat'){
        commodityFinance = wheatFinance;
    }
    else if (commodityName == 'cotton'){
        commodityFinance = cottonFinance;
    }
    else if (commodityName == 'cattle'){
        commodityFinance = cattleFinance;
    }
}


//===============Weather API Variables====================
//token for accessing API
var token = "sUtCbQRELKcKTvcahYjUDGMtwcoeqrmz";
//data set is specific type of data called from NOAA api
var dataSet = "GSOM";
//category id's: TEMP, PRCP(precipitation), WATER, SUTEMP(summer temperature), SUPRCP(summer preciptation)
var dataCategory = "TEMP";
//data types
var dataType1 = "TMAX";
var dataType2 = "TAVG";
var dataType3 = "PRCP";
//weather station location id, required for weather api calls
var stn;
//start date
var startDate;
//end date
var endDate;
//name of commodity being searched
var commodityName;
//name of location, required for weather firebase calls
var locName;
//API return limit (max=1000)
var limit = "1000";


//===function assigns stn and locName variables when a location clicked on geoChart.js===
var locClick;
function detectLocation(){
    if(locClick == "US-IL") {
        stn = "GHCND:USC00110764"; // 2004-2015 100% coverage
        locName = "BLOOMINGTON 5 W, IL US";
    } else if(locClick == "US-IA"){
        stn = "GHCND:USW00014943"; //1948-2016 100% coverage
        locName = "SIOUX CITY GATEWAY AIRPORT, IA US";
    } else if(locClick == "US-MN"){
        stn = "GHCND:USC00219046"; //1898-2016 97% coverage
        locName = "WINNEBAGO, MN US";
    } else if(locClick == "US-NE"){
        stn = "GHCND:USC00259510"; //data for station from 1893-2008, 93% coverage
        locName = "YORK, NE US";
    } else if(locClick == "US-ND"){
        stn = "GHCND:USW00094041";
        locName = "GARRISON, ND US";
    } else if(locClick == "US-KS"){
        stn = "GHCND:USC00143218";
        locName = "GREAT BEND 3 W, KS US";
    } else if(locClick == "US-TX"){
        stn = "GHCND:USC00417081";
        locName = "PLAINVIEW WATER PRODUCTION, TX US";
    } else if(locClick == "US-MS"){
        stn = "GHCND:USC00221707";
        locName = "CLARKSDALE, MS US";
    } else if(locClick == "US-MT"){
        stn = "GHCND:USW00094012";
        locName = "HAVRE AIRPORT ASOS, MT US";
    } else if(locClick == "US-GA"){
        stn = "GHCND:USC00090140";
        locName = "ALBANY 3 SE, GA US";
    }
}
//function stores user-input variables, runs initial functions
function gatherData(){
    //gets input from start date calendar: formatted for api
    startDate = moment($("#startDate").val().trim(), "D MMMM, YYYY").format("YYYY-MM-DD");
    //gets input from end date calendar: formatted for api
    endDate = moment($("#endDate").val().trim(), "D MMMM, YYYY").format("YYYY-MM-DD");
    //date variables in month-year format, for database
    startDateMonths = moment(startDate).format('MMM-YYYY');
    endDateMonths = moment(endDate).format('MMM-YYYY');
    //functions check if data exists
    tempDataCheck();
    precipDataCheck();
    financeDataCheck();
    //gathers precipArray,priceArray,tempArray and puts into TotalData array for graphing
    //function in appChart.js(line 8)
    populateTotalData();
}


//===============API Calls===================
// calls NOAA api to determine name of weather location when using stn ID
function locationApiQuery() {
    //AJAX url
    var nameQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations/"+stn;
    //AJAX call
    $.ajax({ url:nameQueryURL, headers:{ token:token } }).done(function(response){
        //name of location
         locName = response.name;
    });
}
//API call for TEMPERATURE weather data
function temperatureApiQuery() {
    //AJAX url: uses variables set by user
    var tempQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=TAVG&stationid="+stn+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
    //AJAX call
    $.ajax({
        url:tempQueryURL,
        headers:{ token:token },
        error: function(jqHXR, exception){
            if(jqHXR.status == 400){
                tempApiError = "Bad Request: It's possible that dates are out of range. Please select new dates.";
            } else if (jqHXR.status == 404){
                tempApiError = "Data not found. It's possible that dates are out of range of weather information available. Please try new dates."
            } else if (jqHXR.status == 0 || jqHXR == 500){
                tempApiError = "NOAA Weather Source Server is likely down. Please try again later."
            } else if (jqHXR.status == 502){
                tempApiError = "high traffic to NOAA weather Server has prevented a data request. Please try again later."
            }
        }
         }).done(function(response){
        //holds JSON object with relevant data
        var tempData = response.results;
        //variable for array of dates
        var dateArray = [];
        // console.log("temperature array 'dateArray'");
        // console.log(dateArray)
        //populates dateArray by looping through JSON array of data
        function collectData(i){
              for (var i = 0; i < tempData.length; i++){
                    //array of objects from index, i
                    dateArray[i] = {
                        //date property
                        date: moment(tempData[i].date).format('MMM-YYYY'),
                        //temperature property with value
                        temperature:tempData[i].value
                    }
              }
        }
        //looping through ajax JSON to store relevant data (date, temp) in dateArray
        for(var i in tempData){
            //checks if property index has value
            if(tempData.hasOwnProperty(i)) {
                //call for function that populates weatherObject
                collectData(i);
            }
        }
        //====Storing into FIREBASE====
        var database = firebase.database();
        //referencing the database node where data is to be stored. If it doesnt exist, it creates new node
        var weatherData = database.ref("weather/temperature/commodity/"+commodityName+"/location/"+locName);
        // within reference node, new dates object is created, containing dateArray
        weatherData.set({
            dates: dateArray
        });
        //creating date range variables to grab correct values - see line 408
        findDateRange(dateArray);
        //loop through data array, creating new arrays for charting
        for(var i = startIndex; i < endIndex; i++){
            //array containing dates of Temperature Data
            tempDateArray[i] = dateArray[i].date;
            //array containing values of Temperature Data
            tempArray[i] = dateArray[i].temperature;
        }
    });
};

//AJAX query url for PRECIPITATION weather data
function precipitationApiQuery() {
    //AJAX url: uses variables set by user
    var prcpQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=PRCP&stationid="+stn+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
    //AJAX call
    $.ajax({
        url:prcpQueryURL,
        headers:{ token:token },
        error: function (jqHXR, exception){
            if(jqHXR.status == 400){
                precipApiError = "Bad Request: It's possible that dates are out of range. Please select new dates.";
            } else if (jqHXR.status == 404){
                precipApiError = "Data not found. It's possible that dates are out of range of weather information available. Please try new dates."
            } else if (jqHXR.status == 0 || jqHXR == 500){
                precipApiError = "NOAA Weather Source Server is likely down. Please try again later."
            } else if (jqHXR.status == 502){
                precipApiError = "high traffic to NOAA weather Server has prevented a data request. Please try again later."
            }
        }
         }).done(function(response){
        //holds JSON object with relevant data
        var prcpData = response.results;
        //variable for array of dates and weather data
        var dateArray = [];
        //populates dateArray by looping through JSON array of data
        function collectData(i){
              for (var i = 0; i < prcpData.length; i++){
                    //array of objects from index, i
                    dateArray[i] = {
                        //date property
                        date: moment(prcpData[i].date).format('MMM-YYYY'),
                        //temperature property with value
                        precipitation:prcpData[i].value
                    }
              }
        }
        //looping through ajax JSON to store relevant data (date, temp) in dateArray
        for(var i in prcpData){
            //checks if property index has value
            if(prcpData.hasOwnProperty(i)) {
                //call for function that populates weatherObject
                collectData(i);
            }
        }
        //====Storing into FIREBASE====
        var database = firebase.database();
        //referencing the database node where data is to be stored. If it doesnt exist, it creates new node
        var weatherData = database.ref("weather/precipitation/commodity/"+commodityName+"/location/"+locName);
        // within reference node, new dates object is created, containing dateArray
        weatherData.set({
            dates:dateArray
        });
        //creating date range variables to grab correct values - see line 408
        findDateRange(dateArray);
        //loop through data array, creating new arrays for charting
        for(var i =startIndex; i < endIndex; i++){
            //array containing dates of Temperature Data
            precipDateArray[i] = dateArray[i].date;
            //array containing values of Temperature Data
            precipArray[i] = dateArray[i].precipitation;
        }
    });
};
//AJAX query for finance data
function financeApiQuery() {
    //AJAX url: uses variables set by user
    var queryURL="https://www.quandl.com/api/v3/datasets/"+commodityFinance+".json?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&collapse=monthly";
    //  AJAX JSON return
    var data = [];
    //variable for array of dates and weather data
    var dateArray = [];
    //AJAX call
    $.ajax({
        url:queryURL,
        method:'Get',
        error: function financeApiErrorHandler(jqHXR, exception){
            if(jqHXR.status == 400){
                financeApiError = "Bad Request: It's possible that dates are out of range. Please select new dates.";
            } else if (jqHXR.status == 404){
                financeApiError = "Data not found. It's possible that this particular data no longer exists. Please try new dates."
            } else if (jqHXR.status == 0 || jqHXR == 500){
                financeApiError = "NOAA Weather Source Server is likely down. Please try again later."
            } else if (jqHXR.status == 502){
                financeApiError = "high traffic to NOAA weather Server has prevented a data request. Please try again later."
            }
        }
        }).done(function(response){
        //holds JSON object with relevant data
        data = response.dataset.data;
        //populates dateArray by looping through JSON array of data
        function collectData(i){
              for (var i = 0; i < data.length; i++){
                    //array of objects from index, i
                    dateArray[i] = {
                        //date property
                        date: moment(data[i][0]).format('MMM-YYYY'),
                        //price property with value
                        price:data[i][6]
                    }
              }
        }
        //looping through ajax JSON to store relevant data (date, temp) in dateArray
        for (var i in data){
            //call for function that populates weatherObject
            collectData(i);
        }
        // reverses order of array because API dates are given in descending order. Need in ascending order
        dateArray = dateArray.reverse();
        //====Storing into FIREBASE====
        var database = firebase.database();
        //referencing the database node where data is to be stored. If it doesnt exist, it creates new node
        var financeData = database.ref("finance/commodity/"+commodityName);
        // within reference node, new dates object is created, containing dateArray
        financeData.set({
            dates:dateArray
        })
        //creating date range variables to grab correct values - see line 408
        findDateRange(dateArray);
        //loop through data array, creating new arrays for charting
        for(var i =0; i < dateArray.length; i++){
            //array containing dates of Temperature Data
            financeDateArray[i] = dateArray[i].date;
            //array containing values of Temperature Data
            priceArray[i] = dateArray[i].price;
        }
    });
}
//=========Querying DATABASE==========
function firebaseTempQuery() {
    //reference data path, to reach specific date array
    var tempRef = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName+'/dates');
    //performs function once at specified reference
    tempRef.once('value').then(function(snapshot){
        //store data array
        var rawTempData = snapshot.val();
        //creating date range variables to grab correct values - see line 408
        findDateRange(rawTempData);
        //loop through data array, creating new arrays for charting
        //(endIndex - actualIndex) is number of loops performed. Length determined from date range figured out in findDateRange();
        for(var i = 0; i < (endIndex - actualIndex);i++){
            //dates from temperature data
            //startIndex is first index from date range found
            tempDateArray[i] = rawTempData[startIndex].date;
            //temperature data
            tempArray[i] = rawTempData[startIndex].temperature;
            //startIndex increased by 1 to move downstream data array
            startIndex++;
        }
    })
}
function firebasePrecipQuery() {
    //reference data path, to reach specific date array
    var precipRef = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName+'/dates');
    //performs function once at specified reference
    precipRef.once('value').then(function(snapshot){
        //store data array
        rawPrecipData = snapshot.val();
        //creating date range variables to grab correct values - see line 408
        findDateRange(rawPrecipData);
        //loop through data array, creating new arrays for charting
        //(endIndex - actualIndex) is number of loops performed. Length determined from date range figured out in findDateRange();
        for(var i = 0; i < (endIndex - actualIndex);i++){
            //dates from precipitation data
            //startIndex is first index from date range found
            precipDateArray[i] = rawPrecipData[startIndex].date;
            //temperature data
            precipArray[i] = rawPrecipData[startIndex].precipitation;
            //startIndex increased by 1 to move downstream data array
            startIndex++;
        }
    })
}
function firebaseFinanceQuery() {
    //reference data path, to reach specific date array
    var finRef = firebase.database().ref('finance/commodity/'+commodityName+'/dates');
    //performs function once at specified reference
    finRef.once('value').then(function(snapshot){
        //store data array
        var rawFinData = snapshot.val();
        //creating date range variables to grab correct values - see line 408
        findDateRange(rawFinData);
        //loop through data array, creating new arrays for charting
        //(endIndex - actualIndex) is number of loops performed. Length determined from date range figured out in findDateRange();
        for(var i = 0; i < (endIndex - actualIndex);i++){
            //dates from financial data
            //startIndex is first index from date range found
            financeDateArray[i] = rawFinData[startIndex].date;
            //temperature data
            priceArray[i] = rawFinData[startIndex].price;
            //startIndex increased by 1 to move downstream data array
            startIndex++;
        }
    })
}
//checks if temperature data exists in Database
function tempDataCheck(){
    // variable to store bolean
    var exists;
    // database location reference
    var ref = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName);
    //function performed for specified reference
    ref.once('value').then(function(snapshot){
        //exist method checks if referenced node contains data, assigns boolean
        exists = snapshot.exists();
        //if data does exist
        if(exists){
            //execute function that queries database
            firebaseTempQuery();
        //if data does not exist
        } else {
            // run temperature API function
            temperatureApiQuery();
        }
    })
}
//checks if precipitation data exists in Database
function precipDataCheck(){
    // variable to store bolean
    var exists;
    // database location reference
    var ref = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName);
    //function performed for specified reference
    ref.once('value').then(function(snapshot){
        //exist method checks if referenced node contains data, assigns boolean
        exists = snapshot.exists();
        //if data does exist
        if(exists){
            //run function that queries database
            firebasePrecipQuery();
        //if data does not exist
        } else {
            // run precipitation API function
            precipitationApiQuery();
        }
    })
}
//checks if finance data exists in Database
function financeDataCheck(){
    // variable to store bolean
    var finExist;
    // database location reference
    var finRef = firebase.database().ref('finance/commodity/'+commodityName+'/dates');
    //function performed for specified reference
    finRef.once('value').then(function(snapshot){
        //exist method checks if referenced node contains data, assigns boolean
        finExist = snapshot.exists();
        //if data does exist
        if(finExist){
            //run function that queries database
            firebaseFinanceQuery();
        //if data does not exist
        } else {
            // run precipitation API function
            financeApiQuery();
        }
    })
}
//finds date range desired by user for array
//runs through array determining the index where user's date inputs are located
function findDateRange(array){
    //loops through array
    for(var i = 0; i < array.length; i++){
        //if index's date string equals start date string of user
        if(array[i].date == startDateMonths){
            //store the index, i, where this occured
            actualIndex = i;
            startIndex = i;
            //break from loop
            break;
        }
    }
    //loops through array
    for(var i = 0; i < array.length; i++){
        //if index's date equals end date of user
        if (array[i].date == endDateMonths){
            //store the index, i, where this occured
            endIndex = i;
            //break from loop
            break;
        }
    }
}
