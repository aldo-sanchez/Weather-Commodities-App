console.log("hello world");

  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });
// variables: these will be pulled from alex and fred. for now these are placeholders.
var dates = ['Jan-2005','Feb-2005','Mar-2005','Apr-2005','Jun-2005','Jul-2005']

var tempData = [32, 45, 56, 44, 67, 80];

var precipData = [2, 8, 12, 4, 15, 13];

var priceData = [133, 137, 145, 152, 160, 130];

// Combine my data for charting.  This may change based on how data is received.
totalData = [precipData,priceData,tempData];
var chartDataArray = [];
var axesArray = [];
var labelArray = ['precipitation','price','temperature'];
var positionArray = ['left','right','left'];

var lineOpacity = .8;
var backgroundColor = 'white';
var gridLineColor = 'rgba(97, 97, 99, .2)';
var pointBackgroundColor = 'rgba(255, 255, 255, .5)';
var colorOptions = [
  'rgba(112, 203, 244,'+lineOpacity+')', 
  'rgba(122, 244, 111,'+lineOpacity+')',
  'rgba(244, 111, 111,'+lineOpacity+')'];

var dashOptions = [[10,10],[],[]];
var borderDashOffset = 0.0;

var borderCapStyle = 'butt';
var borderJoinStyle = 'miter';
var lineTension = 0.2;

var pointRadius = 5;
var pointBorderWidth = 2;
var pointHoverRadius = 6;
var pointHoverWidth = 3;

var ctx = document.getElementById("chartjs").getContext("2d");
for (i = 0; i < 3; i++){
  chartDataArray[i] = {
    label: labelArray[i],
    yAxisID: 'y-' + i,
    data: totalData[i],
    fill: false,
    backgroundColor: backgroundColor,
    borderColor: colorOptions[i],
    borderCapStyle: borderCapStyle,
    borderDash: dashOptions[i],
    borderDashOffset: borderDashOffset,
    borderJoinStyle: borderJoinStyle,
    lineTension: lineTension,
    pointBackgroundColor: pointBackgroundColor,
    pointBorderColor: colorOptions[i],
    pointBorderWidth: pointBorderWidth,
    pointRadius: pointRadius,
    pointHoverRadius: pointHoverRadius,
    pointHoverBackgroundColor: colorOptions[i],
    pointHoverBorderColor: colorOptions[i],
    pointHoverBorderWidth: pointHoverWidth,
    pointHitRadius: 10
  };

  axesArray[i] = {
    scaleLabel: {
      display: true,
      labelString: labelArray[i]
    },
    gridLines: {
      show: true,
      color: gridLineColor
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


