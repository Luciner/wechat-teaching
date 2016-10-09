
var socket = io('/statistics');
var historicalBarChart;

var chart = nv.models.discreteBarChart()
  .x(function(d) { return d.label })
  .y(function(d) { return d.value })
  .staggerLabels(true)
       //.staggerLabels(historicalBarChart[0].values.length > 8)
  .showValues(true)
  .duration(250)
  ;

socket.on('init-data', function(data){
	console.log('init-data');
  historicalBarChart = data;
  nv.addGraph(function() {
  d3.select('#chart1 svg')
    .datum(historicalBarChart)
    .call(chart);
  nv.utils.windowResize(chart.update);
    return chart;
  });
});

socket.on('redraw',function(data){
	  console.log('redraw');
    switch(data.option){
      case 'A': historicalBarChart[0].values[0].value++; break;
      case 'B': historicalBarChart[0].values[1].value++; break;
      case 'C': historicalBarChart[0].values[2].value++; break;
      case 'D': historicalBarChart[0].values[3].value++; break;
    }
    draw();
});
  
socket.on('clear-data', function(){
	console.log('clear-data');
    for (var i = 0; i < 4; i++) {
      historicalBarChart[0].values[i].value = 0;
    }
    draw();
});

var draw = function(){
  d3.select('#chart1 svg')
    .datum(historicalBarChart)
    .call(chart);
}

document.getElementById("new-question").onclick=function(){
   socket.emit('new-question');
};
