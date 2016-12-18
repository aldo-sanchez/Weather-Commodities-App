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
    $.ajax({ url:tempQueryURL, headers:{ token:token } }).done(function(response){
        //holds JSON object with relevant data
        var tempData = response.results;
        //variable for array of dates
        var dateArray = [];
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
        // ==FIREBASE===========
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
    console.log('=======precipitation API function runs=========')
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
    console.log('=======finance API function runs=========')
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

function tempDataCheck(){
    console.log('=======tempDataCheck function runs=========')
    var exists;
    var ref = firebase.database().ref('weather/temperature/commodity/'+commodityName+'/location/'+locName);
    ref.once('value').then(function(snapshot){
        exists = snapshot.exists();
        console.log("temperature data exists: "+exists);
        if(exists){
            console.log("temperature data found!")
            firebaseTempQuery();
        } else {
            console.log("temperature data not found, querying API!")
            // run weather data API functions
            temperatureApiQuery();
        }
    })
}
function precipDataCheck(){
    console.log('=======precipDataCheck function runs=========');
    var exists;
    var ref = firebase.database().ref('weather/precipitation/commodity/'+commodityName+'/location/'+locName);
    ref.once('value').then(function(snapshot){
        exists = snapshot.exists();
        console.log("precipitation data exists: "+exists);
        if(exists){
            console.log("precipitation data found! running firebasePrecipQuery function")
            firebasePrecipQuery();
        } else {
            console.log("precipitation data not found, running precipAPIQuery function!")
            // run weather data API functions
            precipitationApiQuery();
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
        console.log("financial data exists: " + finExist);
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
