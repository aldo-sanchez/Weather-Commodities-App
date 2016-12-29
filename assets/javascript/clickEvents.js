// list of click events for commweather.  Includes some logic.
// sets first round to true.  this is used to know if we have to destroy a chart... if a chart does not exist chart.js will not let you destroy a chart and throw an error.
var firstRound = true;

// addChartButton click event
$('#addChartButton').on('click', function () {
    // look at values for start and end dates.
    var checkStartDate = $('#startDate').val();
    var checkEndDate = $('#endDate').val();

    //if it isn't first round clear all data.
    if(!firstRound){
        clearData();
    }
    // we gather data necessary for charting using gatherData() -- see main.js for function
    gatherData();

    // checkComplete checks if all data is ready for plotting.  Using setInterval checkComplete checks every 100ms if tempDateArray is the same length as the difference in dates+1.  if it is it displays chart.
    var checkComplete = setInterval(function(){
        console.log('checking completion')
        //conditional runs if all types of data has finished being collected from Firebase
        if (tempDataDelivered && precipDataDelivered && financeDataDelivered){
            //stops timer function
            clearInterval(checkComplete);
            //runs function that plots data
            displayChart();
            //returns delivered data variables to false for next use
            tempDataDelivered = false;
            precipDataDelivered = false;
            financeDataDelivered = false;
        }
    },100);
});


//displays chart on chart collapsible
function displayChart(){
    //check if this is the first time the addChartButton has been pressed.  If it isn't then destroy the chart.  Destroying the chart resets all data.
    if(!firstRound){
        myChart.destroy();
    };
    // after destroying the chart we make a new chart with getNewChart
    getNewChart();
    // check if the chart collapsible is active.  if it isn't we make it active by clicking on it.
    if(!$('#chartCollapsible').hasClass('active')){
        $('#chartCollapsible').click();
    }
    // we remove the glow effect from addChartButton
    $('#addChartButton').removeClass('glowEffect');
    // We set first round to false.
    firstRound = false;
};

// clearData clears all charting data for chart.js plot
function clearData(){
    totalData = [];
    precipArray = [];
    tempArray = [];
    priceArray = [];
    tempDateArray = [];
}


$('#resetButton').on('click', function () {
    clearData();
    initialize();
    $('#locationIconSpot').fadeOut(500,function(){
      $('.locationIcon').attr('src', 'assets/images/US-Country_icon.svg');
      $('#locationIconSpot').fadeIn();
      if (totalData.length > 0){
          myChart.destroy();
      }
    if (!$('#mapCollapsible').hasClass('active')){
        $('#mapCollapsible').click();
    }
      $('#addChartButton').addClass('disabled');
      $('#startDate').val('');
      $('#endDate').val('');
      firstRound = true;
    });
});

$(document).on('click', '.commodityButton', function () {
    if (!userSelections.commodity) {
        var index = $(this).attr('id');
        index = index.substring(0, index.indexOf('Button'));
        commodityName = index;
        assignCommodityFinance();
        // console.log(commodityFinance);

        locationDataTest = commodityLocation[commodities.indexOf(index)][1];
        google.charts.setOnLoadCallback(drawMap);

        commodities.splice(commodities.indexOf(index), 1);
        // console.log(commodities);
        for (i = 0; i < commodities.length; i++) {

            var tempIcon = '#' + commodities[i] + 'Icon';
            var tempButton = '#' + commodities[i] + 'Button';

            $(tempIcon).addClass('fadeOutIcon');
            $(tempButton).addClass('disabled');
        }
        userSelections.commodity = true;
        checkCompletedInputs();
    }
});

$('.datepicker').change(function(){
    if ($('#startDate').val() != ''){
        console.log('not empty')
        userSelections.startDate = true;
    }
    if($('#endDate').val() != ''){
        userSelections.endDate = true;
    }
    if ($('#startDate').val() == ''){
        console.log('not empty')
        userSelections.startDate = false;
    }
    if($('#endDate').val() == ''){
        userSelections.endDate = false;
    }

checkCompletedInputs()
})

function checkCompletedInputs() {
        if (userSelections.commodity && userSelections.location && userSelections.startDate && userSelections.endDate) {
            $('#addChartButton').removeClass('disabled');
            $('#addChartButton').addClass('glowEffect');

        } else {
            if (!$('#addChartButton').hasClass('disabled')){
              $('#addChartButton').addClass('disabled');
            }
        }
};