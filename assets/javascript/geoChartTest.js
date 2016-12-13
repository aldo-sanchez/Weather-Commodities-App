// console.log('map Vis')
// function drawVisualization() {
//   var data = google.visualization.arrayToDataTable([
//     ['State', 'Foo Factor'],
//     ['US-TX', 200],
//     ['US-IN', 300],
//     ['US-IA', 20],
//     ['US-RI', 150]
//   ]);

//   var geochart = new google.visualization.GeoChart(
//       document.getElementById('visualization'));
// var options = {region: "US", resolution: "provinces"};

//   geochart.draw(data, options);
// }

// google.charts.setOnLoadCallback(drawVisualization)

// Set a callback to run when the Google Visualization API is loaded.
 google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1], 
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};
 
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('visualization'));

        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            alert('The user selected ' + topping);
          }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }
