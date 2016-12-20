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

function checkCompletedInputs() {
    
        if (userSelections.commodity && userSelections.location) {
            $('#addChartButton').removeClass('disabled');
        } else {
        // console.log('still looking');
    }
    
};