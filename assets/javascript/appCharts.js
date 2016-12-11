console.log("hello world");

// var data = {
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//   series: [
//     [5,2,4,2,0]
//   ]
// };

// new Chartist.Line('.ct-chart', data);

// var oneDArray = [1,2,3,4,5];
// var twoDArray = [[1,2,3,4,5],["jun","may","aug","july","sept"]];

labelArray = [];
seriesArray = [];

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
  width: '200px',
  height: '200px'
};

new Chartist.Line('.ct-chart', data, options);