console.log('map Vis')



var locClick;
var selectedLocation;
var commoditySelectedBool;
var locationSelectedBool;
var startDateSelectedBool;
var endDateSelectedBool;

var userSelections = {
    commodity: commoditySelectedBool,
    location: locationSelectedBool,
    startDate: startDateSelectedBool,
    endDate: endDateSelectedBool,
};

var commodities = [];


header = ['State', '% Produced'];
var locationDataTest = [];
var cornLocation = [header, ['US-IA', 18.42], ['US-NE', 14.80], ['US-IL', 12.45]];
var soybeanLocation = [header, ['US-IL', 14.03], ['US-IA', 12.5], ['US-MN', 8.25]];
var pecanLocation = [header, ['US-TX', 32], ['US-NM', 15], ['US-CA', 4]];

var commodityLocation = [['corn', cornLocation], ['soybean', soybeanLocation], ['pecan', pecanLocation]];

google.charts.load('current', { 'packages': ['line'] });


$(document).ready(function () {
    initialize();
})
function initialize() {

    commodities = ['corn', 'soybean', 'pecan'];

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
  google.charts.setOnLoadCallback(drawMap);
  
}

function drawMap() {
    var data = google.visualization.arrayToDataTable(locationDataTest);

    var options = {
        backgroundColor: { fill: 'transparent' },
        height: 400,
        //   width: 556, 
        //   height: 347, 
        region: "US",
        resolution: "provinces"
        // dataMode: 'regions',
        // width: 834,
        // height: 521
    };

    var container = document.getElementById('mapVis');
    var chart = new google.visualization.GeoChart(container);

    function myClickHandler() {
        if (userSelections.commodity) {
            console.log('i ran');
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
                console.log(message[0]);
                locClick = selectedLocation[0];
                detectLocation();
                $('.locationIcon').attr('src', 'assets/images/' + message[0] + '_icon.svg');
                $('#locationIconSpot').fadeIn();
                checkCompletedInputs();
            }
        }
    }

    google.visualization.events.addListener(chart, 'select', myClickHandler);

    chart.draw(data, options);

}

$('#addChartButton').on('click', function () {
    console.log('get chart!!!');
    $('#mapCollapsible').click();
    $('#chartCollapsible').click();
});

$('#resetButton').on('click', function () {
    console.log('reset');
    initialize();
});

$(document).on('click', '.commodityButton', function () {
    if (!userSelections.commodity) {
        var index = $(this).attr('id');
        index = index.substring(0, index.indexOf('Button'));

        locationDataTest = commodityLocation[commodities.indexOf(index)][1];
        google.charts.setOnLoadCallback(drawMap);

        commodities.splice(commodities.indexOf(index), 1);
        console.log(commodities);
        for (i = 0; i < commodities.length; i++) {
            console.log(commodities[i]);
            var tempIcon = '#' + commodities[i] + 'Icon';
            var tempButton = '#' + commodities[i] + 'Button';
            console.log(tempIcon)
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
        console.log('still looking');
    }
};