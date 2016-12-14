console.log("hello world");
google.charts.load('current', { 'packages': ['line'] });

var tempData = [
    ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
    [32, 45, 56, 44, 67, 80]];

var precData = [
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
      data.addColumn('number', "precipitation");

      for (i = 0; i < tempData[0].length; i++) {
        chartRows[i] = [tempData[0][i], tempData[1][i], precData[1][i]];
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
          title: 'temperature and precipitation'
        },
        width: 900,
        height: 500,
        series: {
          // Gives each series an axis name that matches the Y-axis below.
          0: {axis: 'temperature',
              color: '#43459d'
            },
          1: {axis: 'precipitation',
              color: '#e7711b'
            }
        },
        axes: {
          // Adds labels to each axis; they don't have to match the axis names.
          y: {
            temperature: {label: 'Temps (Celsius)'},
            precipitation: {label: 'precipitation'}
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