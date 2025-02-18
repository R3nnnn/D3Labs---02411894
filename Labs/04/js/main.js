var margin = { top: 50, right: 20, bottom: 100, left: 50 };
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data/buildings.json").then((data) => {
    data.forEach((d) => {
        d.height = +d.height;
    });

    var x = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, 828])
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeSet3); //Sets the color scale

    var bars = svg.selectAll("rect") //Creates the rectangles (the buildings)
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.height))
        .attr("fill", (d) => color(d.name));

    var labels = svg.selectAll("text") //Places labels. They are rotated because otherwise they didn't fit D':
        .data(data)
        .enter()
        .append("text")
        .text((d) => d.name)
        .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.height) + 30) 
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("transform", (d) => `rotate(-45, ${x(d.name) + x.bandwidth() / 2}, ${y(d.height) + 30})`);

}).catch((error) => {
    console.error("Error loading data:", error);
});