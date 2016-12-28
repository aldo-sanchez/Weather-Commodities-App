//==========MUST DISPLAY MESSAGE: <a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/purple.png" width="134" height="29"/> </a>
var weatherForecastApiKey = "dj0yJmk9S3VNc3U3WkFhN2VuJmQ9WVdrOVpVYzRNMHA2TkdNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD04Mg--&17f82e854c1a206db1d7f33e65760e2e9ce5ce63";
// var latitude = "40.7127837";
// var longitude = "-74.0059413";
var forecastQueryURL = "https://api.login.yahoo.com/oauth/v2/get_request_token";
var accessToken = "17f82e854c1a206db1d7f33e65760e2e9ce5ce63";
$.ajax({
	url: forecastQueryURL,
	method: 'GET',
	headers: {
		token: accessToken
	}
}).done(function(response){
	console.log(response)
})