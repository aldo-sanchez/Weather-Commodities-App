$(document).ajaxError(function(event, jqhxr,settings, thrownError){
    if(jqhxr == 400) {
        console.log("API request failed due to faulty data request");
    }
})