
//AJAX query to get list of data types from 1000 to 1527
// var queryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes?limit=1000&offset=1000"
// $.ajax({ url:queryURL, headers:{ token:token } }).done(function(response){
// 	console.log(response);
// })
//token for accessing API
var token = "sUtCbQRELKcKTvcahYjUDGMtwcoeqrmz";
// ajax call for city location available
// $.ajax({
// 	url:"https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&datatypeid=TMAX&datatypeid=TAVG&locationid=CITY:AE000001&units=metric&startdate=2010-05-01&enddate=2010-12-31",
// 	headers:{token:token}
// 	}).done(function(response){
// 		console.log("city locations:")
// 		console.log(response)
// });

var tempAvg = [];
//data set: TAVG(Avg temp), TPCP(total precipitation), GSOY(global summary of the year), GSOM(global summ of month), PRECIP_15(Precipitation 15 Minute), DP10(Num of days with greater than or eq to 1 inch of precipitation)

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
var startDate = "2010-05-01";
//end date
var endDate = "2010-12-31";
//AJAX query
var queryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSet+"&datatypeid="+dataType1+"&datatypeid="+dataType2+"&datatypeid="+dataType3+"&locationid="+loc+"&units=metric&startdate=2010-05-01&enddate=2010-12-31&limit=1000";
$.ajax({ url:queryURL, headers:{ token:token } }).done(function(response){
	// console.log(response);
    var data = response.results;
    console.log(data);
    //looping through ajax JSON to store relevant data (date, temp) in array
    for(var i in data){
        if(data.hasOwnProperty(i)) {
            var date = data[i].date;
            var temp = data[i].value;
            var tempDateObj = {
                "date":date,
                "temp":temp
            }
            tempAvg.push(tempDateObj)
        }
    }
    // console.log("Avg temp Array: " + tempAvg);
})


