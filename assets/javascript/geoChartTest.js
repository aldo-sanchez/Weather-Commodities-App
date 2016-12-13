
console.log('map Vis')

if(commodityName == "soybean"){
    console.log('Im in')
};

// google.charts.load('upcoming', {'packages':['geochart']});
google.charts.setOnLoadCallback(drawMap);

function drawMap() {
    var data = google.visualization.arrayToDataTable([
    ['State', 'Foo Factor'],
    ['US-IL', 200],
    ['US-IN', 300],
    ['US-IA', 20],
    ['US-RI', 150],
    ['US-TX',400]
    ]);
    
    var options = {
      width: 556, 
      height: 347, 
      region: "US", 
      resolution: "provinces"
        // dataMode: 'regions',
        // width: 834,
        // height: 521
    }; 
    
    var container = document.getElementById('mapVis');
    var chart = new google.visualization.GeoChart(container);
    
    function myClickHandler(){
        var selection = chart.getSelection();
        var message = '';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                message += '{row:' + item.row + ',column:' + item.column + '}';
            } else if (item.row != null) {
                message += '{row:' + item.row + '}';
            } else if (item.column != null) {
                message += '{column:' + item.column + '}';
            }
        }
        if (message == '') {
            message = 'nothing';
        }
        alert('You selected ' + message);
    }
    
    google.visualization.events.addListener(chart, 'select', myClickHandler);
    
    chart.draw(data, options);
}
