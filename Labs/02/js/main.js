var svg = d3.select("#chart-area").append("svg") //Select the HTML element. Add an svg element inside the #chart-area; it's the container for all SVG graphics

	.attr("width", 400)

	.attr("height", 400);

var data = [25, 20, 15, 10, 5];

var rectangles = svg.selectAll("rect") //selectAll used to select all exixting rectangles and bind data to them. 
    .data(data) //D3 compares the data array with the existing rectangles
    .enter() //access the placeholder for new elements
    .append("rect")
    .attr("x", function(d, i) { //.attr() sets the attributes for each rectangle
        return i * 50;
    })
    .attr("y", function(d) {
        return 400 - d;
    })
    .attr("width", 40)
    .attr("height", function(d) {
        return d;
    })
    .attr("fill", "	#87CEEB");