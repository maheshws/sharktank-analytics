

d3.json('http://127.0.0.1:5000/api/v1/deals/dealsbyshark/all', function(data) {
console.log(data)

var ndx = crossfilter(data);
var all = ndx.groupAll();

console.log(all.value());

});