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

//===============API AJAX Calls===================

var queryURL="https://www.quandl.com/api/v3/datasets/"+commodity+".json?api_key="+token+"&start_date=2010-01-01&end_date=2016-01-01";

var data = [];
var dateArray = [];
$.ajax({url:queryURL,method:'Get'})
		.done(function(response){
			console.log(response);
			data = response.dataset.data;
			console.log(data);

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

    		// dateArray.reverse();
    		console.log("local dateArray"+dateArray);

			console.log(dateArray);
			for (var i in data){
				collectDateInfo(i);
			}
				dateArray = dateArray.reverse();
				console.log("new");
				console.log(dateArray);
		});




