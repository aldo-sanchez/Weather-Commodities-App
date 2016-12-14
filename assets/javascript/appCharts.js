console.log("hello world");
google.charts.load('current', { 'packages': ['line'] });

var tempData = [
    ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
    [32, 45, 56, 44, 67, 80]];

var priceData = [
['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
[1, 5, 2, 3, 3, 10]];


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
};
var chartRows = [];

function drawChartDual(){

var data = new google.visualization.DataTable();
      data.addColumn('string', 'Month');
      data.addColumn('number', "temperature");
      data.addColumn('number', "price");

      for (i = 0; i < tempData[0].length; i++) {
        chartRows[i] = [tempData[0][i], tempData[1][i], priceData[1][i]];
    };

      data.addRows(chartRows)
      // data.addRows([
      //   [new Date(2014, 0),  -.5,  5.7],
      //   [new Date(2014, 1),   .4,  8.7],
      //   [new Date(2014, 2),   .5,   12],
      //   [new Date(2014, 3),  2.9, 15.3],
      //   [new Date(2014, 4),  6.3, 18.6],
      //   [new Date(2014, 5),    9, 20.9],
      //   [new Date(2014, 6), 10.6, 19.8],
      //   [new Date(2014, 7), 10.3, 16.6],
      //   [new Date(2014, 8),  7.4, 13.3],
      //   [new Date(2014, 9),  4.4,  9.9],
      //   [new Date(2014, 10), 1.1,  6.6],
      //   [new Date(2014, 11), -.2,  4.5]
      // ]);

      var materialOptions = {
        chart: {
          title: 'temperature and price'
        },
        width: 900,
        height: 500,
        series: {
          // Gives each series an axis name that matches the Y-axis below.
          0: {axis: 'temperature',
              color: '#43459d'
            },
          1: {axis: 'price',
              color: '#e7711b'
            }
        },
        axes: {
          // Adds labels to each axis; they don't have to match the axis names.
          y: {
            temperature: {label: 'Temps (Celsius)'},
            price: {label: 'price ($)'}
          },
          gridlines:{
            color: '#0061ff'
          }
        }
      };

      function drawMaterialChart() {
        var materialChart = new google.charts.Line(document.getElementById('yAxisDual'));
        // var materialChart = new google.charts.Line(chartDiv);
        materialChart.draw(data, materialOptions);
      }
      drawMaterialChart();
    }

// google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawChartDual);

var ctx = document.getElementById("chartjs").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    "labels": [
      "01.12.2015",
      "02.12.2015",
      "03.12.2015",
      "04.12.2015",
      "30.12.2015"
    ],
    "datasets": [{
      "label": "DEA Burrweiler test Abgabe",
      yAxisID: "y-axis-0",
      "data": [
        8.7913,
        8.6985,
        8.7914,
        8.7948,
        8.7882
      ]
    }, {
      "label": "DEA Burrweiler Druck Zulauf",
      "fill": "false",
      yAxisID: "y-axis-1",
      "data": [
        4.5997,
        4.5526,
        4.5915,
        4.5937,
        4.5795
      ],
      backgroundColor: "rgba(000,111,111,.5)",
      fill: false
    }, {
      "label": "DMS Flemlingen Durchfluss",
      "fill": "false",
      yAxisID: "y-axis-1",
      "data": [
        1.9588,
        2.4226,
        2.1392,
        2.223,
        1.9048
      ],
      backgroundColor: "blue",
      fill: false
    }]
  },
  options: {
  
    scales: {
      yAxes: [{
        position: "left",
        "id": "y-axis-0",
      }, {
        position: "right",
        "id": "y-axis-1",
      }]
    }
  }
});