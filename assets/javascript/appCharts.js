console.log("hello world");
// variables: these will be pulled from alex and fred. for now these are placeholders.
var dates = ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01']

var tempData = [
    ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
    [32, 45, 56, 44, 67, 80]];

var precipData = [
['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
[2, 8, 12, 4, 15, 13]];

var priceData = [
['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
[133, 137, 145, 152, 160, 130]];

// Combine my data for charting.  This may change based on how data is received.
totalData = [precipData[1],priceData[1],tempData[1]];
var chartDataArray = [];
var axesArray = [];
var labelArray = ['precipitation','price','temperature'];
var positionArray = ['left','right','left'];
var colorOptions = ['#70cbf4', '#05af27','#ce123e'];
var dashOptions = [[10,10],[],[]]
var bor

var ctx = document.getElementById("chartjs").getContext("2d");
for (i = 0; i < 3; i++){
  chartDataArray[i] = {
    label: labelArray[i],
    yAxisID: 'y-' + i,
    data: totalData[i],
    fill: false,
      backgroundColor: "black",
      borderColor: colorOptions[i],
      borderCapStyle: 'butt',
      borderDash: dashOptions[i],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      lineTension: 0.1,
      pointBackgroundColor: "white",
      pointBorderColor: colorOptions[i],
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: colorOptions[i],
      pointHoverBorderColor: colorOptions[i],
      pointHoverBorderWidth: 3,
      pointHitRadius: 10
  };
  axesArray[i] = {
    scaleLabel: {
      display: true,
      labelString: labelArray[i]
    },
    position: positionArray[i],
    'id': 'y-' + i
  };
};

var myChart = new Chart(ctx, {
  type: "line",
  data: {
    "labels": dates,
    'datasets': chartDataArray
  },
  options: {
    scales: {
      yAxes: axesArray
    }
  }
});


