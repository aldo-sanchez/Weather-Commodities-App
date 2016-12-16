//arrays for graphing
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
//station
//hard-coded---needs to be dynamically created from user input. Use moment.js
var stn;
//start date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var startDate;
//end date
//hard-coded---needs to be dynamically created from user input. Use moment.js
var endDate;
//name of commodity being searched
//hard-coded---needs to be dynamically created from user input.
var commodityName;
//name of location queried for data
var locName;
//API return limit (max=1000)
var limit = "1000";

//============click events for commodities=============
var locEnetered = false;
var commodityEntered = false;
//click events for commodity
// commodityClick("#commodity-corn-btn","corn");
// commodityClick("#commodity-soybean-btn","soybean");
// commodityClick("#commodity-wheat-btn","wheat");
// commodityClick("#commodity-cotton-btn","cotton");
// commodityClick("#commodity-cattle-btn","cattle");
// //click event function for commodity
// function commodityClick(id, commodity) {
//     $(id).on('click',function(){
//         //signals commodity has been chosen by user
//         commodityEntered = true;
//         // sets commodity name depending on button clicked
//         commodityName = commodity;
//     });
// }

//============click events for locations on Map=============
    //sets name of station from map location
// locationClick("#locationIllinois");
// locationClick("#locationMissouri");
// locationClick("#locationIowa");
// locationClick("#locationMinnesota");
// function locationClick(id) {
//     $(id).on('click',function(){
//         //gets data attribute from button clicked
//         locEntered = true;
//         stn = $(this).data('id');
//         console.log("station id (stn)")
//         console.log(stn)
//         locationApiQuery();
//     });
// }
var locClick;
function detectLocation(){
    if(locClick == "US-IL") {
        locEntered = true;
        stn = "GHCND:USC00110764"; // 2004-2015 100% coverage
    } else if(locClick == "US-IA"){
        locEntered = true;
        stn = "GHCND:USW00014943"; //1948-2016 100% coverage
    } else if(locClick == "US-MN"){
        locEntered = true;
        stn = "GHCND:USC00219046"; //1898-2016 97% coverage
    } else if(locClick == "US-NE"){
        locEntered = true;
        stn = "GHCND:USC00259510"; //data for station from 1893-2008, 93% coverage
    } else if(locClick == "US-ND"){
        locEntered = true;
        stn = "GHCND:USW00094041";
    } else if(locClick == "US-KS"){
        locEntered = true;
        stn = "GHCND:USC00143218";
    } else if(locClick == "US-TX"){
        locEntered = true;
        stn = "GHCND:USC00417081";
    } else if(locClick == "US-MS"){
        locEntered = true;
        stn = "GHCND:USC00221707";
    } else if(locClick == ""){
        locEntered = true;
        stn = "";
    } else if(locClick == ""){
        locEntered = true;
        stn = "";
    } else if(locClick == ""){
        locEntered = true;
        stn = "";
    } else if(locClick == "US-"){
        locEntered = true;
        stn = "";
    } else if(locClick == ""){
        locEntered = true;
        stn = "";
    } else if(locClick == "US-"){
        locEntered = true;
        stn = "";
    } else if(locClick == ""){
        locEntered = true;
        stn = "";
    }
    console.log("station id (stn)")
    console.log(stn)
}

//=========click event for submit button (all data collected)=====
    //here coded for input-type
// $("#addChartButton").on('click',function(){
    function gatherData(){
    
        //gets input text from start date input field with id = #startDate-submit
        var startDateTest = $('#startDate').val().trim();
        console.log(startDateTest);
        startDate = moment($("#startDate").val().trim(), "D MMMM, YYYY").format("YYYY-MM-DD");
        // console.log(startDate);
        //gets input text from start date input field with id = #startDate-submit
        endDate = moment($("#endDate").val().trim(), "D MMMM, YYYY").format("YYYY-MM-DD");
        // console.log(endDate);
        //start date in month-year format
        startDateMonths = moment(startDate).format('MMM-YYYY');
        endDateMonths = moment(endDate).format('MMM-YYYY');
        //=======functions check if data exists==========
        weatherDataCheck('temperature', firebaseTempQuery(),temperatureApiQuery());
        weatherDataCheck('precipitation', firebasePrecipQuery(),precipitationApiQuery());
        financeDataCheck();
        populateTotalData();

        console.log("commodity Name variable: " + commodityName);
        console.log("start date: " + startDate);
        console.log("end date: " + endDate);
    
    // return false;
    }
// });

//===============API AJAX Calls===================
function locationApiQuery() {
    //AJAX url only for determining name of location
    var nameQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations/"+stn;
    $.ajax({ url:nameQueryURL, headers:{ token:token } }).done(function(response){
         locName = response.name;
        console.log("location Name: "+locName);
    });
}
//collects temp and date data from API JSON and assigns to array index(i)
// function collectData(index,apiArray,targetArray, targetObjectProperty, dateValue, targetValue){
//       for (var index = 0; index < apiArray.length; index++){
//             targetArray[index] = {
//                 date: moment(dateValue).format('MMM-YYYY'),
//                 targetObjectProperty:targetValue
//             }
//       }
// }
//AJAX query url for TEMPERATURE weather data
function temperatureApiQuery() {
    var tempQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=TAVG&stationid="+stn+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
    $.ajax({ url:tempQueryURL, headers:{ token:token } }).done(function(response){
        var tempData = response.results;
        //variable for array of dates
        var dateArray = [];
        function collectData(i){
              for (var i = 0; i < tempData.length; i++){
                    dateArray[i] = {
                        date: moment(tempData[i].date).format('MMM-YYYY'),
                        temperature:tempData[i].value
                    }
              }
        }
        //looping through ajax JSON to store relevant data (date, temp) in array
        for(var i in tempData){
            //checks if property index has value
            if(tempData.hasOwnProperty(i)) {
                //call for function that populates weatherObject
                //parameter reference: collectData(index,apiArray,targetArray, targetObjectProperty, dateValue, targetValue)
                collectData(i);
            }
        }
        // =======FIREBASE===========
        var database = firebase.database();
        var weatherData = database.ref("weather/temperature/commodity/"+commodityName+"/location/"+locName);
        weatherData.set({
            dates: dateArray
        });
        //creating date range variables
        findDateRange(dateArray);
        //loop through data array, creating new arrays for charting
        for(var i =startIndex; i < endIndex; i++){
            tempDateArray[i] = dateArray[i].date;
            tempArray[i] = dateArray[i].temperature;
        }
        console.log("tempArray:");
        console.log(tempArray);
        console.log("tempDateArray: ");
        console.log(tempDateArray);
    });
};

//AJAX query url for PRECIPITATION weather data
function precipitationApiQuery() {
    var prcpQueryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid=PRCP&stationid="+stn+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit="+limit;
    $.ajax({ url:prcpQueryURL, headers:{ token:token } }).done(function(response){
        var prcpData = response.results;
        //variable for array of dates
        var dateArray = [];
        //collects temp and date data from API JSON and assigns to array index(i)
        //looping through ajax JSON to store relevant data (date, temp) in array
        function collectData(i){
              for (var i = 0; i < prcpData.length; i++){
                    dateArray[i] = {
                        date: moment(prcpData[i].date).format('MMM-YYYY'),
                        precipitation:prcpData[i].value
                    }
              }
        }
        for(var i in prcpData){
            //checks if property index has value
            if(prcpData.hasOwnProperty(i)) {
                //call for function that populates weatherObject
                collectData(i);
            }
        }
        console.log("precipitation dateArray")
        console.log(dateArray)
        //=======FIREBASE===========
        var database = firebase.database();
        var weatherData = database.ref("weather/precipitation/commodity/"+commodityName+"/location/"+locName);
        weatherData.set({
            dates:dateArray
        });
        //creating date range variables
        findDateRange(dateArray);
        //loop through data array, creating new arrays for charting
        for(var i =startIndex; i < endIndex; i++){
            precipDateArray[i] = dateArray[i].date;
            precipArray[i] = dateArray[i].precipitation;
        }
        console.log("precipArray:");
        console.log(precipArray);
        console.log("precipDateArray: ");
        console.log(precipDateArray);
    });
};
//AJAX query for finance data
function financeApiQuery() {
    var queryURL="https://www.quandl.com/api/v3/datasets/"+commodityFinance+".json?api_key="+apiKey+"&start_date="+startDate+"&end_date="+endDate+"&collapse=monthly";
    var data = [];
    var dateArray = [];
    $.ajax({url:queryURL,method:'Get'}).done(function(response){
        data = response.dataset.data;
        function collectData(i){
              for (var i = 0; i < data.length; i++){
                    dateArray[i] = {
                        date: moment(data[i][0]).format('MMM-YYYY'),
                        price:data[i][6]
                    }
              }
        }
        for (var i in data){
            //function collects data from api and stores into array
            //parameter reference: collectData(index,dataArray,targetArray, targetObjectProperty, dateValue, targetValue)
            collectData(i);
        }
        // dateArray.reverse();
        dateArray = dateArray.reverse();
        //======FIREBASE data send=======
        var database = firebase.database();
        var financeData = database.ref("finance/commodity/"+commodityName);
        financeData.set({
            dates:dateArray
        })
        //loop through data array, creating new arrays for charting
        for(var i =0; i < dateArray.length; i++){
            financeDateArray[i] = dateArray[i].date;
            priceArray[i] = dateArray[i].price;
        }
        console.log("priceArray:");
        console.log(priceArray);
        console.log("priceDateArray: ");
        console.log(financeDateArray);
    });
}
//=========Querying Firebase==========
function firebaseTempQuery() {
    //reference data path, to reach date array
        //takes snapshot of the data one, not an event listener
    var tempRef = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName+'/dates');
    tempRef.once('value').then(function(snapshot){
        //store data array
        var rawTempData = snapshot.val();
        //creating date range variables
        findDateRange(rawTempData);
        //loop through data array, creating new arrays for charting
        for(var i = 0; i < (endIndex - actualIndex);i++){
            tempDateArray[i] = rawTempData[startIndex].date;
            tempArray[i] = rawTempData[startIndex].temperature;
            startIndex++;
        }
    })
    console.log("firebase queried!: tempDatesArray")
    console.log(tempDateArray)
    console.log("tempArray");
    console.log(tempArray);
}
function firebasePrecipQuery() {
    //reference data path, to reach date array
        //takes snapshot of the data one, not an event listener
    var precipRef = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName+'/dates');
    precipRef.once('value').then(function(snapshot){
        //store data array
        rawPrecipData = snapshot.val();
        console.log(rawPrecipData);
        //creating date range variables
        findDateRange(rawPrecipData);
        //loop through data array, creating new arrays for charting
        for(var i = 0; i < (endIndex - actualIndex);i++){
            precipDateArray[i] = rawPrecipData[startIndex].date;
            precipArray[i] = rawPrecipData[startIndex].precipitation;
            startIndex++;
        }
    })
    console.log("firebase queried!: precipitation precipData");
    console.log(precipArray);
    console.log("precipDateArray");
    console.log(precipDateArray);
}
function firebaseFinanceQuery() {
    //reference data path, to reach date array
        //takes snapshot of the data one, not an event listener
    var finRef = firebase.database().ref('finance/commodity/'+commodityName+'/dates');
    finRef.once('value').then(function(snapshot){
        //store data array
        var rawFinData = snapshot.val();
        //creating date range variables
        findDateRange(rawFinData);
        //loop through data array, creating new arrays for charting
        for(var i = 0; i < (endIndex - actualIndex);i++){
            financeDateArray[i] = rawFinData[startIndex].date;
            priceArray[i] = rawFinData[startIndex].price;
            startIndex++;
        }
    })
    console.log("firebase queried!: Price Array")
    console.log(priceArray)
    console.log("finance dates Array")
    console.log(financeDateArray)
}

function weatherDataCheck(weatherVariableType, firebaseQueryFunction, apiQueryFunction){
    var exists;
    var ref = firebase.database().ref('weather/'+weatherVariableType+'/commodity/'+commodityName+'/location/'+locName);
    ref.once('value').then(function(snapshot){
        exists = snapshot.exists();
        console.log("temp data exists: "+exists);
        if(exists){
            console.log("data found!")
            firebaseQueryFunction;
        } else {
            console.log("data not found, querying API!")
            // run weather data API functions
            apiQueryFunction;
        }
    })
}
function financeDataCheck(){
    var finExist;
    // var commodityName = "corn";
    // var locName = "BLOOMINGTON 5 W, IL US";
    var finRef = firebase.database().ref('finance/commodity/'+commodityName+'/dates');
    finRef.once('value').then(function(snapshot){
        finExist = snapshot.exists();
        console.log("temp data exists: " + finExist);
        if(finExist){
            console.log("finance data found!")
            firebaseFinanceQuery();
        } else {
            console.log("data not found, querying precipitatio API!")
            // run weather data API functions
            financeApiQuery();
        }
    })
}
var actualIndex;
function findDateRange(array){
    for(var i = 0; i < array.length; i++){
        if(array[i].date == startDateMonths){
            actualIndex = i;
            startIndex = i;
            break;
            // console.log("===========startIndex variable: "+ startIndex);
        }
        // console.log("===========endIndex variable: "+ endIndex);
    }
    for(var i = 0; i < array.length; i++){
        if (array[i].date == endDateMonths){
            endIndex = i;
            break;
        }
    }
}
