// set the dimensions and margins of the graph
var margin = {top: 100, right: 0, bottom: 0, left: 150},
    width = 700 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border


// append the svg object
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");


// Declaring Variables
  var sharkchart = dc.rowChart("#my_dataviz");
  var sharkCatchart = dc.rowChart("#my_dataviz1");
  var body = d3.select("#summary-table>tbody");

// Reading the data
d3.json( '/api/v1/deals/sharkscategory/all', function(data) {

  console.log(data);

  // Crossfilter
  var ndx = crossfilter(data);
  var all = ndx.groupAll();

  // Declaring Dimesions and Groups
  var sharkDim = ndx.dimension(function (d) { return d["Shark"]; });
  var sharkgroup = sharkDim.group();

  var sharkCatDim = ndx.dimension(function (d) {  return d["Category"]; });
  var sharkCatgroup = sharkCatDim.group();

  // On Click of Category display table
  function renderTable(key){
    d3.json("/api/v1/deals/sharkscategory/summary",function(data) {
      // Empty the table
      console.log(data);
      body.html("")

      // Filter based on the selection
      function filterK(summaryData) {
        return summaryData.Category === key;
      }
      var filteredData = data.filter(filterK);

      // appending <tr> and <td>
      filteredData.forEach(function (record) {
        Object.entries(record).forEach(function ([key, value]) {
            var row = body.append('tr')
                          .text(key)
                          .append('td')
                          .text(value)
        });
     });

    })

  };



  // Drawing the chart
  sharkchart
    .dimension(sharkDim)
    .group(sharkgroup)
    .elasticX(true);

  sharkCatchart
    .height(400)
    .dimension(sharkCatDim)
    .group(sharkCatgroup)
    .elasticX(true)
    //.data(function (group) { return group.top(10)});


  sharkCatchart.on('filtered.monitor', function(chart, filter) {
    renderTable(filter);
  });


    // dc.renderAll();
    sharkchart.render();
    sharkCatchart.render();

});