console.log("hello world");
google.charts.load('current', { 'packages': ['line'] });
// var data = {
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//   series: [
//     [5,2,4,2,0]
//   ]
// };

// new Chartist.Line('.ct-chart', data);

// var oneDArray = [1,2,3,4,5];
// var twoDArray = [[1,2,3,4,5],["jun","may","aug","july","sept"]];

var tempData = [
    ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
    [32, 45, 56, 44, 67, 80]];


var data = {
  labels: tempData[0],
  series: [
    tempData[1]
  ],
  
};

var options = {
  low: 0,
  showArea: true,
  showPoint: false,
  fullWidth: true,
  //width: '200px',
    //height: '200px'
};
var chartRows = [];


new Chartist.Line('.ct-chart', data, options);

function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Temperature');

    for (i = 0; i < tempData[0].length; i++) {
        chartRows[i] = [tempData[0][i], tempData[1][i]];
    };

    data.addRows(chartRows);

    /*data.addRows([
      ['2005 - 01 - 01', 32],
      ['2005 - 02 - 01', 45],
      ['2005 - 03 - 01', 56],
      ['2005 - 04 - 01', 44],
      ['2005 - 05 - 01', 67],
      ['2005 - 06 - 01', 80]
    ]);*/

    var options = {
        chart: {
            title: 'temperature over dates',
            subtitle: 'in degrees celsius'
        },
        height: 500
    };

    var chart = new google.charts.Line(document.getElementById('linechart_material'));

    chart.draw(data, options);
}

google.charts.setOnLoadCallback(drawChart);