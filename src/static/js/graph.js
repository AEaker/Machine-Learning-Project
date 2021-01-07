
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json('http://127.0.0.1:5000/adj.json', function( data) {
    console.log(data)

  // Initialize the links
  var link = svg
    .select("line")
    .data(data.links)
    .enter()
    .append("line")
      .style("stroke", "#aaa")

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", 20)
      .style("fill", "#69b3a2")

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x+6; })
         .attr("cy", function(d) { return d.y-6; });
  }

});
// // Using the above implemented graph class
// var g = new Graph(20);
// var vertices = [ 'Lewis Hamilton', 'Valtteri Bottas', 'Max Verstappen', 'Sergio Pérez', 'Charles Leclerc', 'Daniel Ricciardo', 
// 'Carlos Sainz', 'Lando Norris', 'Alexander Albon', 'Pierre Gasly', 'Lance Stroll', 'Esteban Ocon', 'Sebastian Vettel', 'Daniil Kvyat', 
// 'Nico Hülkenberg', 'Kimi Räikkönen', 'Antonio Giovinazzi', 'Romain Grosjean', 'Kevin Magnussen', 'Nicholas Latifi'];

// g.addEdge('Lewis Hamilton', 'Nicholas Latifi');
// g.addEdge('Valtteri Bottas','Lewis Hamilton');
// g.addEdge('Max Verstappen', 'Valtteri Bottas');
// g.addEdge('Sergio Pérez', 'Max Verstappen');
// g.addEdge('Charles Leclerc', 'Sergio Pérez');
// g.addEdge('Daniel Ricciardo', 'Charles Leclerc');
// g.addEdge('Carlos Sainz', 'Daniel Ricciardo');
// g.addEdge('Lando Norris', 'Carlos Sainz');
// g.addEdge('Alexander Albon', 'Lando Norris');
// g.addEdge('Pierre Gasly', 'Alexander Albon');
// g.addEdge('Lance Stroll', 'Pierre Gasly');
// g.addEdge('Esteban Ocon', 'Lance Stroll');
// g.addEdge('Sebastian Vettel', 'Esteban Ocon');
// g.addEdge('Daniil Kvyat', 'Sebastian Vettel');
// g.addEdge('Nico Hülkenberg', 'Daniil Kvyat');
// g.addEdge('Kimi Räikkönen', 'Nico Hülkenberg');
// g.addEdge('Antonio Giovinazzi', 'Kimi Räikkönen');
// g.addEdge('Romain Grosjean', 'Antonio Giovinazzi');
// g.addEdge('Kevin Magnussen', 'Romain Grosjean');
// g.addEdge('Nicholas Latifi', 'Kevin Magnussen');