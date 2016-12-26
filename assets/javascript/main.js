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
    startDateMonths = moment(startDate).format('YYYY-MM');
    endDateMonths = moment(endDate).format('YYYY-MM');
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
        },
        //handler function that runs only when api completed successfully
        complete: function (jqHXR){
            //when api complete, query database to collect the data
            firebaseTempQuery();
        }
    }).done(function(response){
        //holds JSON object with relevant data
        var tempData = response.results;
        //Storing into FIREBASE
        var database = firebase.database();
        //looping through ajax JSON to store relevant data (date, temp) in dateArray
        for(var i = 0; i < tempData.length; i++){
            //date formatted into Years first and then months, so organized in asc manner in firebase
            var date = moment(tempData[i].date).format('YYYY-MM');
            //formats dates for display in chart
            var dateDisplay = moment(tempData[i].date).format('MMM-YYYY');
            //referencing the database node where data is to be stored. Creates new node for new date
            var value = database.ref("weather/temperature/commodity/"+commodityName+"/location/"+locName+"/"+date);
            //sets new property in firebase node at tempValue reference
            value.set({temp: tempData[i].value});
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
        },
        //handler function that runs only when api completed successfully
        complete: function (jqHXR){
            //when api complete, query database to collect the data
            firebasePrecipQuery();
        }
    }).done(function(response){
        //holds JSON object with relevant data
        var prcpData = response.results;
        //storing into firebase database
        var database = firebase.database();
        //looping through ajax JSON to store relevant data (date, temp) in dateArray
        for(var i = 0; i < prcpData.length; i++){
            //date formatted into Years first and then months, so organized in asc manner in firebase
            var date = moment(prcpData[i].date).format('YYYY-MM');
            //referencing the database node where data is to be stored. Creates new node for new date
            var value = database.ref("weather/precipitation/commodity/"+commodityName+"/location/"+locName+"/"+date);
            //sets new property in firebase node at tempValue reference
            value.set({precip: prcpData[i].value});
        }
    });
};
//AJAX query for finance data
function financeApiQuery() {
    //AJAX url: uses variables set by user
    var queryURL="https://www.quandl.com/api/v3/datasets/"+commodityFinance+".json?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&collapse=monthly";
    //  AJAX JSON return
    var data = [];
    //AJAX call
    $.ajax({
        url:queryURL,
        method:'Get',
        error: function (jqHXR, exception){
            if(jqHXR.status == 400){
                financeApiError = "Bad Request: It's possible that dates are out of range. Please select new dates.";
            } else if (jqHXR.status == 404){
                financeApiError = "Data not found. It's possible that this particular data no longer exists. Please try new dates."
            } else if (jqHXR.status == 0 || jqHXR == 500){
                financeApiError = "NOAA Weather Source Server is likely down. Please try again later."
            } else if (jqHXR.status == 502){
                financeApiError = "high traffic to NOAA weather Server has prevented a data request. Please try again later."
            }
        },
         //handler function that runs only when api completed successfully
        complete: function (jqHXR){
            //when api complete, query database to collect the data
            firebaseFinanceQuery();
        }
    }).done(function(response){
        //holds JSON object with relevant data
        data = response.dataset.data;
        //Storing into FIREBASE
        var database = firebase.database();
        //looping through ajax JSON to store relevant data (date, temp) in dateArray
        for(var i = 0; i < data.length; i++){
            //date formatted into Years first and then months, so organized in asc manner in firebase
            var date = moment(data[i][0]).format('YYYY-MM');
            var price = data[i][3];
            //referencing the database node where data is to be stored. Creates new node for new date
            var value = database.ref("finance/commodity/"+commodityName+"/"+date);
            //sets new property in firebase node at reference node
            value.set({price: price});
        }
    });
}
//=========Querying DATABASE==========
function firebaseTempQuery() {
    //reference data path, to reach specific date array
    var tempRef = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName);
    //performs function once at specified reference, with start date and end date value
    tempRef.orderByKey().startAt(startDateMonths).endAt(endDateMonths).once('value').then(function(snapshot){
        //store JSON object from firebase
        var rawTempData = snapshot.val();
        //iterates through properties of JSON object returned by firebase
        for(var prop in rawTempData){
            //checks if property exists
            if(rawTempData.hasOwnProperty(prop)){
                //stores property of rawTempData of current iteration
                var value = rawTempData[prop];
                //pushes value of temp property into array for plotting with Chart.js
                tempArray.push(value.temp)
            }
        }
        //Object.getOwnPropertyNames creates array of all properties found. Here: dates from firebase
        var dateArray = Object.getOwnPropertyNames(rawTempData);
        for (var i = 0; i < dateArray.length; i++){
            //formats dates for display in chart
            var dateDisplay = moment(dateArray[i]).format('MMM-YYYY');
            tempDateArray[i] = dateDisplay;
        }
    })
}
function firebasePrecipQuery() {
    //reference data path, to reach specific date array
    var ref = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName);
    //performs function once at specified reference
    ref.orderByKey().startAt(startDateMonths).endAt(endDateMonths).once('value').then(function(snapshot){
        //store data array
        var rawPrecipData = snapshot.val();
        //iterates through properties of JSON object returned by firebase
        for(var prop in rawPrecipData){
            //checks if property exists
            if(rawPrecipData.hasOwnProperty(prop)){
                //stores property of rawPrecipData of current iteration
                var value = rawPrecipData[prop];
                //pushes value of precip property into array for plotting with Chart.js
                precipArray.push(value.precip)
            }
        }
    });
}
function firebaseFinanceQuery() {
    //reference data path, to reach specific date array
    var ref = firebase.database().ref('finance/commodity/'+commodityName);
    //performs function once at specified reference
    ref.orderByKey().startAt(startDateMonths).endAt(endDateMonths).once('value').then(function(snapshot){
        //store data array
        var rawFinData = snapshot.val();
        //iterates through properties of JSON object returned by firebase
        for(var prop in rawFinData){
            //checks if property exists
            if(rawFinData.hasOwnProperty(prop)){
                //stores property of rawFinData of current iteration
                var value = rawFinData[prop];
                //pushes value of precip property into array for plotting with Chart.js
                priceArray.push(value.price)
            }
        }
    })
}
//checks if temperature data exists in Database
function tempDataCheck(){
    // variable to store bolean
    var startDateExist;
    var endDateExist;
    // database location reference to node of specific start date
    var startRef = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName+'/'+startDateMonths);
    var endRef = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName+'/'+endDateMonths);
    //function performed for specified reference
    startRef.once('value').then(function(snapshot){
        //exist method checks if referenced node contains data, assigns boolean
        startDateExist = snapshot.exists();
        console.log("TEMPERATURE startDateExist inside ref function")
        console.log(startDateExist)
        if(startDateExist){
            endRef.once('value').then(function(snapshot){
                endDateExist = snapshot.exists();
                console.log("TEMPERATURE endDateExist inside ref function")
                console.log(endDateExist);
                if(endDateExist){
                    console.log("querying TEMPERATURE FIREBASE")
                    //execute function that queries database
                    firebaseTempQuery();
                } else {
                    console.log("TEMPERATURE startDate found, endDate NOT found, calling API")
                    // run temperature API function
                    temperatureApiQuery();
                }
            });
        //if data does not exist
        } else {
            console.log("startDateExist: "+startDateExist);
            console.log("TEMP startDate NOT found, running API call")
            // run temperature API function
            temperatureApiQuery();
        }
    });

    //if start and end data both does exist, query firebase

}
//checks if precipitation data exists in Database
function precipDataCheck(){
    // variable to store bolean
    var startDateExist;
    var endDateExist;
    // database location reference to node of specific start date
    var startRef = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName+'/'+startDateMonths);
    var endRef = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName+'/'+endDateMonths);
    //function performed for specified reference
    startRef.once('value').then(function(snapshot){
        //exist method checks if referenced node contains data, assigns boolean
        startDateExist = snapshot.exists();
        if(startDateExist){
            endRef.once('value').then(function(snapshot){
                endDateExist = snapshot.exists();
                console.log("PRECIPITATION endDateExist inside ref function")
                console.log(endDateExist);
                if(endDateExist){
                    console.log("querying PRECIPITATION FIREBASE")
                    //execute function that queries database
                    firebasePrecipQuery();
                } else {
                    console.log("PRECIPITATION startDate found, endDate NOT found, calling API")
                    // run temperature API function
                    precipitationApiQuery();
                }
            });
        //if data does not exist
        } else {
            console.log("PRECIPITATION startDateExist: "+startDateExist);
            console.log("PRECIPITATION endDateExist: "+endDateExist)
            console.log("PRECIPITATION startDate NOT found, running API call")
            // run temperature API function
            precipitationApiQuery();
        }
    });
}
//checks if finance data exists in Database
function financeDataCheck(){
    // variable to store bolean
    var startDateExist;
    var endDateExist;
    // database location reference to node of specific start date
    var startRef = firebase.database().ref('finance/commodity/'+commodityName+'/'+startDateMonths);
    var endRef = firebase.database().ref('finance/commodity/'+commodityName+'/'+endDateMonths);
    //function performed for specified reference
    startRef.once('value').then(function(snapshot){
        //exist method checks if referenced node contains data, assigns boolean
        startDateExist = snapshot.exists();
        console.log("FINANCE startDateExist inside ref function")
        console.log(startDateExist)
        if(startDateExist){
            endRef.once('value').then(function(snapshot){
                endDateExist = snapshot.exists();
                console.log("FINANCE endDateExist inside ref function")
                console.log(endDateExist);
                if(endDateExist){
                    console.log("querying FINANCE  FIREBASE")
                    //execute function that queries database
                    firebaseFinanceQuery();
                } else {
                    console.log("FINANCE startDate found, endDate NOT found, calling API")
                    // run temperature API function
                    financeApiQuery();
                }
            });
        //if data does not exist
        } else {
            console.log("FINANCE  startDate NOT found, running API call")
            // run temperature API function
            financeApiQuery();
        }
    });
}

