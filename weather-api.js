
//AJAX query to get list of data types from 1000 to 1527
var queryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes?limit=1000&offset=1000"
$.ajax({ url:queryURL, headers:{ token:token } }).done(function(response){
	console.log(response);
})
//token for accessing API
var token = "sUtCbQRELKcKTvcahYjUDGMtwcoeqrmz";
//ajax call for city location available
$.ajax({
	url:"https://www.ncdc.noaa.gov/cdo-web/api/v2/locations?locationcategoryid=CITY&sortfield=name&sortorder=desc&limit=1000",
	headers:{token:token}
	}).done(function(response){
		console.log("city locations:")
		console.log(response)
});


//data set: TAVG(Avg temp), TPCP(total precipitation), GSOY(global summary of the year), GSOM(global summ of month), PRECIP_15(Precipitation 15 Minute), DP10(Num of days with greater than or eq to 1 inch of precipitation)
var dataSetId = "GSOM";
//category id's: TEMP, PRCP(precipitation), WATER, SUTEMP(summer temperature), SUPRCP(summer preciptation)
var dataCategoryId = "TEMP";
//data type
var dataTypeId = "TAVG";
//location
var locationId = "28801";
//start date
var startDate = "2010-05-01";
//end date
var endDate = "2010-12-31";
//AJAX query
var queryURL = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid="+dataSetId+"&datatypeid="+dataTypeId+"&locationid=ZIP:"+locationId+"&units=metric&startdate="+startDate+"&enddate="+endDate+"&limit=20"
$.ajax({ url:queryURL, headers:{ token:token } }).done(function(response){
	console.log(response);
})