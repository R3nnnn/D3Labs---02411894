var svg = d3.select("#chart-area").append("svg") //Select the HTML element. Add an svg element inside the #chart-area; it's the container for all SVG graphics

	.attr("width", 400)

	.attr("height", 700);


var circle = svg.append("circle") //Appends a circle to the SVG container

	.attr("cx", 200)

	.attr("cy", 400)

	.attr("r", 100)

	.attr("fill", "violet");

var rect = svg.append("rect") //Appends a rectangle to the SVG container

	.attr("x", 100)

	.attr("y", 50)

	.attr("width", 300)

	.attr("height", 100)

	.attr("fill","pink");