console.log("hello world");

var dates = ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01']
var tempData = [
    ['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
    [32, 45, 56, 44, 67, 80]];

var precipData = [
['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
[2, -8, 12, 4, 15, 13]];

var priceData = [
['2005-01-01','2005-02-01','2005-03-01','2005-04-01','2005-05-01','2005-06-01'],
[133, 137, 145, 152, 160, 130]];

totalData = [precipData[1],priceData[1],tempData[1]];
var chartDataArray = [];
var axesArray = [];
var labelArray = ['precipitation','price','temperature'];
var positionArray = ['left','right','left'];


var ctx = document.getElementById("chartjs").getContext("2d");

for (i = 0; i < 3; i++){
  chartDataArray[i] = {
    "label": labelArray[i],
    yAxisID: 'y-' + i,
    "data": totalData[i]
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
