// Global Variables
var selectedLocation;
var commoditySelectedBool;
var locationSelectedBool;
var startDateSelectedBool;
var endDateSelectedBool;

// User States - Selections
var userSelections = {
    commodity: commoditySelectedBool,
    location: locationSelectedBool,
    startDate: startDateSelectedBool,
    endDate: endDateSelectedBool,
};

// Commodities array (used for buttons)
var commodities = [];

// Header and location used as inputs for geo chart
header = ['State', '% Produced'];
var locationDataTest = [];
var cornLocation = [header, ['US-IA', 18.42], ['US-NE', 14.80], ['US-IL', 12.45]];
var soybeanLocation = [header, ['US-IL', 14.03], ['US-IA', 12.5], ['US-MN', 8.25]];
var wheatLocation = [header, ['US-ND', 18.03], ['US-KS', 15.69], ['US-MT', 9.04]];
var cottonLocation = [header, ['US-TX', 45.00], ['US-GA', 16.30], ['US-MS', 5.20]];
var cattleLocation = [header, ['US-TX', 12.72], ['US-NE', 7.01], ['US-KS', 6.79]];

// Array summarizing location information
var commodityLocation = [['corn', cornLocation], ['soybean', soybeanLocation], ['wheat', wheatLocation], ['cotton', cottonLocation], ['cattle', cattleLocation]];

// loading google chart
google.charts.load('current', { 'packages': ['line'] });

// initialization - variables and states
$(document).ready(function () {
    initialize();
})
function initialize() {

    commodities = ['corn', 'soybean', 'wheat', 'cotton', 'cattle'];

    userSelections.commodity = false;
    userSelections.location = false;
    userSelections.startDate = false;
    userSelections.endDate = false;

    locationDataTest = [['State', '% Produced']];
    for (i = 0; i < commodities.length; i++) {
      
        var tempIcon = '#' + commodities[i] + 'Icon';
        var tempButton = '#' + commodities[i] + 'Button';
     
        $(tempIcon).removeClass('fadeOutIcon');
        $(tempButton).removeClass('disabled');
    }

    // call to draw map on site
  google.charts.setOnLoadCallback(drawMap);
}

// function used to draw map on site
function drawMap() {
    // all locations are fed here.  these change depending on selected commodity
    var data = google.visualization.arrayToDataTable(locationDataTest);

    // opttions for chart such as colors, size, and region.
    var options = {
        backgroundColor: { fill: 'transparent' },
        colorAxis: {colors: ['#81d4fa','#01579b']},
        datalessRegionColor: '#bababa',
        height: 400,
        region: "US",
        resolution: "provinces"
    };

    var container = document.getElementById('mapVis');
    var chart = new google.visualization.GeoChart(container);

    function myClickHandler() {
        if (userSelections.commodity) {
            // console.log('i ran');
            var selection = chart.getSelection();
            var message = '';
            for (var i = 0; i < selection.length; i++) {
                var item = selection[i];
                if (item.row != null && item.row != null) {
                    //message += '{row:' + item.row + ',column:' + item.column + '}';
                    message = locationDataTest[item.row + 1];
                    selectedLocation = locationDataTest[item.row + 1];
                }
                else if (item.row != null) {
                    message += locationDataTest[item.row + 1];
                    selectedLocation = locationDataTest[item.row + 1];
                } else if (item.column != null) {
                    message += locationDataTest[item.row + 1];
                    selectedLocation = locationDataTest[item.row + 1];
                }
            }
            if (message == '') {
                message = 'nothing';
            }
            if (message != '') {
                userSelections.location = true;
                // console.log(message[0]);
                locClick = selectedLocation[0];

                detectLocation();
                locationApiQuery();
                $('#locationIconSpot').fadeOut(500,function(){
                    $('.locationIcon').attr('src', '');
                    $('#locationIconSpot').fadeIn();
                    $('.locationIcon').attr('src', 'assets/images/' + message[0] + '_icon.svg');
                    $('#locationIconSpot').fadeIn();
                });
                // $('.locationIcon').attr('src', 'assets/images/' + message[0] + '_icon.svg');
                // $('#locationIconSpot').fadeIn();
                checkCompletedInputs();
            }
        }
    }

    google.visualization.events.addListener(chart, 'select', myClickHandler);

    chart.draw(data, options);

}

var firstRound = true;
$('#addChartButton').on('click', function () {
    var checkStartDate = $('#startDate').val();
    var checkEndDate = $('#endDate').val();
    if (checkStartDate != '' && checkEndDate != ''){
    if(!firstRound){
        clearData();
    }
    gatherData();
    displayChart();
    firstRound = false;
    }
});

function displayChart(){
    if(!firstRound){
        myChart.destroy();
    };    
    setTimeout(getNewChart, 2000);
    if(firstRound){
        $('#chartCollapsible').click();
    }
    
};

function clearData(){
    // myChart.destroy();
    totalData = [];
    precipArray = [];
    tempArray = [];
    priceArray = [];
    tempDateArray = [];
}

$('#resetButton').on('click', function () {
    // myChart.destroy();

    initialize();
    $('#locationIconSpot').fadeOut(500,function(){
      $('.locationIcon').attr('src', 'assets/images/US-Country_icon.svg');
      $('#locationIconSpot').fadeIn();
      if (totalData.length > 0){
          myChart.destroy();
      }
      $('#mapCollapsible').click();
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

function checkCompletedInputs() {
    
        if (userSelections.commodity && userSelections.location) {
            $('#addChartButton').removeClass('disabled');
        } else {
        // console.log('still looking');
    }
    
};