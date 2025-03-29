var margin = { left: 100, right: 10, top: 10, bottom: 140 };
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var flag = true;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleBand() //Static elements
    .range([0, width])
    .padding(0.2);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

var yAxisGroup = g.append("g")
    .attr("class", "y-axis");

var xLabel = g.append("text")
    .attr("x", width / 2)
    .attr("y", height + 130)
    .attr("text-anchor", "middle")
    .text("Month");

var yLabel = g.append("text")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle");

d3.json("data/revenues.json").then((data) => { //This loads the data
    data.forEach((d) => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    update(data); //initial update
    d3.interval(() => {//Interval setup
        flag = !flag;
        update(data);
    }, 1000);
}).catch((error) => {
    console.error("Error loading data:", error);
});

function update(data) {
    var value = flag ? "revenue" : "profit";
    var label = flag ? "Revenue ($)" : "Profit ($)";

    x.domain(data.map(d => d.month)); //Update the scales
    y.domain([0, d3.max(data, d => d[value])]);

    var xAxisCall = d3.axisBottom(x); //Update the axis
    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `$${d}`);

    xAxisGroup.call(xAxisCall)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("x", -5)
        .attr("y", 15)
        .attr("text-anchor", "end");

    yAxisGroup.call(yAxisCall);

    yLabel.text(label);

    var rects = g.selectAll("rect") //Updates bars using D3
        .data(data);

    rects.exit().remove(); //Removes the old elements

    rects.attr("x", d => x(d.month))//Updates the existing elements
        .attr("y", d => y(d[value]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[value]));

    rects.enter() //adds the new elements
        .append("rect")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d[value]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[value]))
        .attr("fill", "steelblue");
}