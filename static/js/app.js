// some colour variables
console.log(d3v4.version);
console.log(d3v3.version);
  var tcBlack = "#130C0E";
// rest of vars
var w = 1200,
    h = 350,
    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25,
    root;
var vis;
var force = d3v3.layout.force();
vis = d3v3.select("#vis").append("svg").attr("width", w).attr("height", h);
d3v3.json("../static/data/sharkdata.json", function(json) {
  root = json;
  root.fixed = true;
  root.x = w / 2;
  root.y = h / 4;


        // Build the path
  var defs = vis.insert("svg:defs")
      .data(["end"]);


  defs.enter().append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

     update();
});
function update() {
  var nodes = flatten(root),
  links = d3v3.layout.tree().links(nodes);
  // Restart the force layout.
  force.nodes(nodes)
        .links(links)
        .gravity(0.05)
    .charge(-1500)
    .linkDistance(100)
    .friction(0.5)
    .linkStrength(function(l, i) {return 1; })
    .size([w, h])
    .on("tick", tick)
        .start();

   var path = vis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    path.enter().insert("svg:path")
      .attr("class", "link")
      // .attr("marker-end", "url(#end)")
      .style("stroke", "#eee");


  // Exit any old paths.
  path.exit().remove();



  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id; });


  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", click)
      .call(force.drag);

  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
      .style("fill", "#eee");


  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50);

  // make the image grow a little on mouse over and add the text details on click
  var setEvents = images
          // Append hero text
          .on( 'click', function (d) {
              d3v3.select("h1").html(d.hero);
              d3v3.select("h2").html(d.name);
              d3v3.select("h3").html ("Take me to " + "<a href='" + d.link + "'+ target='_blank' >"  + d.hero + " web page ⇢"+ "</a>" );
              change(d.name);
           })
          .on( 'mouseenter', function() {
            // select element in current context
            d3v3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);
          })
          // set back
          .on( 'mouseleave', function() {
            d3v3.select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 50)
              .attr("width", 50);
          });
  // Append hero name on roll over next to the node as well
  nodeEnter.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser)
      .attr("y", y_browser +15)
      .attr("fill", tcBlack)
      .text(function(d) { return d.hero; });


  // Exit any old nodes.
  node.exit().remove();


  // Re-select for update.
  path = vis.selectAll("path.link");
  node = vis.selectAll("g.node");

function tick() {


    path.attr("d", function(d) {

     var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           return   "M" + d.source.x + ","
            + d.source.y
            + "A" + dr + ","
            + dr + " 0 0,1 "
            + d.target.x + ","
            + d.target.y;
  });
    node.attr("transform", nodeTransform);
  }

}

function nodeTransform(d) {
  d.x =  Math.max(maxNodeSize, Math.min(w - (d.imgwidth/2 || 16), d.x));
    d.y =  Math.max(maxNodeSize, Math.min(h - (d.imgheight/2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
   }


function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update();
}

function flatten(root) {
  var nodes = [];
  var i = 0;

  function recurse(node) {
    if (node.children)
      node.children.forEach(recurse);
    if (!node.id)
      node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

// set the dimensions and margins of the graph
var margin = {top: 100, right: 0, bottom: 0, left: 150},
    width = 700 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border


// append the svg object
var svg = d3v4.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");


// Declaring Variables
  var sharkchart = dc.rowChart("#my_dataviz");
  var sharkCatchart = dc.rowChart("#my_dataviz1");
  var body = d3v4.select("#summary-table>tbody");

// Reading the data
d3v4.json("api/v1/deals/sharkscategory/all", function(data) {

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
    d3v4.json("/api/v1/deals/sharkscategory/summary",function(data) {
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

  function renderSharkTable(key){
    d3v4.json("/api/v1/deals/dealsbyshark/portfolio",function(data) {
      // Empty the table
      body.html("")

      // Filter based on the selection
      function filterK(sharkData) {
        return sharkData.Shark === key;
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

  sharkchart.on('filtered.monitor', function(chart, filter) {
      // console.log(filter);
      renderSharkTable(filter);
    });

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
function change(sharkName) {
d3.json('/api/v1/deals/dealsbyshark/'+sharkName, function(data) {
  console.log(data);
  var mod_data= [];
      Object.entries(data[0]).forEach(function ([key, value]) {
         var temp = {"sector":key, "exposure":value*100};
         console.log(temp);
         mod_data.push(temp);
      });
  console.log(mod_data) ;
  var pie = d3.layout.pie()
        .value(function (d) {
            return d.value;
        }).sort(null)(data);
  var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    path = d3.select("#donut")
        .selectAll("path")
        .data(pie); // Compute the new angles
    var arc = d3.svg.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    path.transition().duration(500).attr("d", arc); // redrawing the path with a smooth transition
})
}

function paintPieDataViz()
{
    alert("I am here");
    var e = document.getElementById("shrkviews");
    var result = e.options[e.selectedIndex].value;
    alert(result); //ID002
}

function updatePie(driver){
clearPie();
   d3v4.json("/api/v1/deals/dealsbygender/all",function(data) {
console.log(data);
var values = [];
var labelSet = ["Female","Male","Mixed Teams"];
data.forEach(function(val){
    if (driver=="DealsProposed")
    {
        values.push(val.DealsProposed);
    }
    else if (driver=="DealsClosedbyGender")
    {
        values.push(val.PercentClosed);
    }
    else
    {
        values.push(val.PercentClosed);
    }

});
var data = [{
  type: "pie",
  values: values,
  labels: labelSet,
  textinfo: "label",
  insidetextorientation: "radial",
  automargin: true
}]
var layout = [{
  height: 400,
  width: 400
}]
Plotly.newPlot('pie_dataviz', data, layout)
})
}

function updateSeasonBar(){
clearPie();
   d3v4.json("/api/v1/deals/dealsbyseason/all",function(data) {
console.log(data);
var x1 = [];
var y1 = [];
var y2 =[];
data.forEach(function(val){
    x1.push(val.Season);
    y1.push(val.DealsOffered);
    y2.push(val.ClosedDeals);

});
var trace1 = {
  x: x1,
  y: y1,
  type: 'bar',
  name: 'Deals Offered',
  marker: {
    color: 'rgb(49,130,189)',
    opacity: 0.7,
  }
};

var trace2 = {
  x: x1,
  y: y2,
  type: 'bar',
  name: 'Deals Closed',
  marker: {
    color: 'rgb(16, 227, 171)',
    opacity: 0.5
  }
};

var data = [trace1, trace2];

var layout = {
  height: 500,
  width: 620,
  title: '11 Season of Deals Offered vs. Closed',
  xaxis: {
    tickangle: -45
  },
  barmode: 'group'
};

Plotly.newPlot('pie_dataviz', data, layout)
})
}


function updateSectorGenderBar(){
clearPie();
   d3v4.json("/api/v1/deals/sectorgender/summary",function(data) {
console.log(data);
var x1 = [];
var y1 = [];
var y2 =[];
var y3 =[];
data.forEach(function(val){
    x1.push(val.Category);
    y1.push(val.Female);
    y2.push(val.Male);
    y3.push(val.MixedTeam);

});
var trace1 = {
  x: x1,
  y: y1,
  type: 'bar',
  name: 'Female Participation',
  marker: {
    color: 'rgb(255,192,203)',
    opacity: 0.7,
  }
};

var trace2 = {
    x: x1,
    y: y2,
    type: 'bar',
    name: 'Male Participation',
    marker: {
        color: 'rgb(0,0,255)',
        opacity: 0.5
    }
};
var trace3 = {
  x: x1,
  y: y3,
  type: 'bar',
  name: 'Mixed Team Participation',
  marker: {
    color: 'rgb(145, 81, 240)',
    opacity: 0.5
  }
};

var data = [trace1, trace2,trace3];

var layout = {
  height: 650,
  width: 620,
  title: 'Gender Distribution across Categories',
  xaxis: {
    tickangle: -45
  },
  barmode: 'group'
};

Plotly.newPlot('pie_dataviz', data, layout)
})
}

function clearPie() {
        document.getElementById("pie_dataviz").innerHTML = "";
    }