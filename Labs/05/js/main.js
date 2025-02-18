var margin = { left: 100, right: 10, top: 10, bottom: 140 }; // Increased bottom margin because some names were incomplete because they hid inside the margin :(
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

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
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([height, 0]);

    var xAxisCall = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("x", -5)
        .attr("y", 15) // Increased y-offset for the buildings' titles
        .attr("text-anchor", "end");

    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `${d}m`);
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 130) // Reduced y-offset to fit inside the margins
        .attr("text-anchor", "middle")
        .text("The world's tallest buildings");

    svg.append("text")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Height (m)");

    var rects = svg.selectAll("rect") //Create the buildings
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.height))
        .attr("fill", "grey");

}).catch((error) => {
    console.error("Error loading data:", error);
});