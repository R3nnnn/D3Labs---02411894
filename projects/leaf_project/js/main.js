// Margins and dimensions
var margin = { left: 80, right: 20, top: 50, bottom: 100 };
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var currentYear = 1800;

// SVG container
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Group for the chart
var g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Scales
var x = d3.scaleLog()
    .base(10)
    .domain([142, 150000])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]);

var area = d3.scaleLinear()
    .domain([2000, 1400000000])
    .range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal()
    .domain(["asia", "europe", "africa", "americas", "oceania"]) // Lowercase to match your data
    .range(d3.schemePastel1);

// Axes
var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d => "$" + d);

var yAxisCall = d3.axisLeft(y);

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`);

var yAxis = g.append("g")
    .attr("class", "y-axis");

// Labels
g.append("text")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");

g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .text("Life Expectancy (Years)");

var yearLabel = g.append("text")
    .attr("x", width - 50)
    .attr("y", height - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "40px")
    .style("fill", "#999");

// Legend
var legend = g.append("g")
    .attr("transform", `translate(${width - 100}, ${height - 150})`);

color.domain().forEach((continent, i) => {
    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 25)
        .attr("r", 8)
        .attr("fill", color(continent));
    
    legend.append("text")
        .attr("x", 15)
        .attr("y", i * 25 + 4)
        .text(continent)
        .style("font-size", "12px");
});

// Update function
function update(data) {
    console.log("Update data:", data); // Check data passed to update function
    if (!data || !data.year || !data.countries) {
        console.error("Invalid data:", data);
        return;
    }

    // Update year label
    yearLabel.text(data.year);

    // Bind data to circles
    var circles = g.selectAll("circle")
        .data(data.countries, d => {
            console.log("Country data:", d); // Check each country object
            return d.country; // Use country as the key
        });

    // Exit
    circles.exit().remove();

    // Update existing circles
    circles.attr("cx", d => x(d.income))
        .attr("cy", d => y(d.life_exp))
        .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
        .attr("fill", d => color(d.continent.toLowerCase())); // Ensure continent is lowercase

    // Enter new circles
    circles.enter()
        .append("circle")
            .attr("cx", d => x(d.income))
            .attr("cy", d => y(d.life_exp))
            .attr("r", d => Math.sqrt(area(d.population) / Math.PI))
            .attr("fill", d => color(d.continent.toLowerCase())) // Ensure continent is lowercase
            .attr("opacity", 0)
        .transition()
            .duration(500)
            .attr("opacity", 1);

    // Update axes
    xAxis.call(xAxisCall);
    yAxis.call(yAxisCall);
}

// Load data
d3.json("data/data.json").then(data => {
    // Clean data
    const formattedData = data.map(year => ({
        year: year.year,
        countries: year.countries
            .filter(country => country.income !== null && country.life_exp !== null) // Filter out null values
            .map(country => ({
                ...country,
                income: +country.income,
                life_exp: +country.life_exp,
                population: +country.population
            }))
    }));

    console.log("Formatted data:", formattedData); // Check formatted data

    if (formattedData.length > 0) {
        // Initial update
        update(formattedData[0]);

        // Interval function
        d3.interval(() => {
            currentYear = (currentYear === 2020) ? 1800 : currentYear + 1; // Loop back to 1800 after 2020
            const yearData = formattedData.find(d => d.year === currentYear); // Find data for the current year
            console.log("Year data:", yearData); // Check year data
            if (yearData) {
                update(yearData); // Update the chart
            } else {
                console.error("No data found for year:", currentYear);
            }
        }, 1000);
    } else {
        console.error("Formatted data is empty.");
    }
}).catch(error => {
    console.error("Error loading the data:", error);
});