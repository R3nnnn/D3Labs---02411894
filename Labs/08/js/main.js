var margins = { top: 60, right: 220, bottom: 60, left: 80 },
    chartWidth = 960 - margins.left - margins.right,
    chartHeight = 540 - margins.top - margins.bottom;

var ui = d3.select("#chart-area").append("div").attr("id", "ui-panel");

ui.append("button").attr("id", "toggle-play").text("Start");
ui.append("button").attr("id", "restart").text("Restart");
ui.append("label").text("Year: ");
ui.append("span").attr("id", "current-year").text("1800");
ui.append("input")
    .attr("id", "time-slider")
    .attr("type", "range")
    .attr("min", 1800)
    .attr("max", 2020)
    .attr("step", 1);
ui.append("select").attr("id", "region-filter");

var canvas = d3.select("#chart-area")
    .append("svg")
    .attr("width", chartWidth + margins.left + margins.right)
    .attr("height", chartHeight + margins.top + margins.bottom)
    .style("display", "block")
    .style("margin", "auto")
    .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`);

var xScale = d3.scaleLog().domain([142, 150000]).range([0, chartWidth]);
var yScale = d3.scaleLinear().domain([0, 90]).range([chartHeight, 0]);
var areaScale = d3.scaleSqrt().domain([2000, 1400000000]).range([5, 40]);
var colorScale = d3.scaleOrdinal(d3.schemePastel1);

canvas.append("g").attr("class", "x-axis").attr("transform", `translate(0,${chartHeight})`).call(d3.axisBottom(xScale).tickValues([400, 4000, 40000]).tickFormat(d => `$${d}`));
canvas.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

canvas.append("text").attr("x", chartWidth / 2).attr("y", chartHeight + 50).attr("text-anchor", "middle").text("GDP Per Capita ($)");
canvas.append("text").attr("transform", "rotate(-90)").attr("x", -chartHeight / 2).attr("y", -50).attr("text-anchor", "middle").text("Life Expectancy (Years)");

var yearText = canvas.append("text").attr("x", chartWidth + 100).attr("y", chartHeight - 30).attr("text-anchor", "end").attr("font-size", "38px").attr("fill", "gray");

d3.json("data/data.json").then(data => {
    var cleanedData = data.map(entry => ({
        year: entry.year,
        countries: entry.countries.filter(c => c.income && c.life_exp && c.continent)
    }));

    var regions = Array.from(new Set(cleanedData.flatMap(e => e.countries.map(c => c.continent)))).sort();

    const regionDropdown = d3.select("#region-filter");
    regionDropdown.append("option").text("All").attr("value", "All");
    regionDropdown.selectAll("option.region")
        .data(regions)
        .enter()
        .append("option")
        .attr("class", "region")
        .attr("value", d => d)
        .text(d => d);

    let yearPos = 0;
    let timer;

    function render(dataObj) {
        const region = d3.select("#region-filter").property("value");
        let countries = dataObj.countries;
        if (region !== "All") {
            countries = countries.filter(c => c.continent === region);
        }

        yearText.text(dataObj.year);
        d3.select("#time-slider").property("value", dataObj.year);
        d3.select("#current-year").text(dataObj.year);

        var bubbles = canvas.selectAll("circle").data(countries, d => d.country);

        bubbles.exit().transition().attr("r", 0).remove();

        bubbles.enter().append("circle")
            .attr("fill", d => colorScale(d.continent))
            .attr("cx", d => xScale(d.income))
            .attr("cy", d => yScale(d.life_exp))
            .attr("r", 0)
            .merge(bubbles)
            .transition().duration(300)
            .attr("cx", d => xScale(d.income))
            .attr("cy", d => yScale(d.life_exp))
            .attr("r", d => areaScale(d.population));
    }

    function advance() {
        yearPos = (yearPos + 1) % cleanedData.length;
        render(cleanedData[yearPos]);
    }

    d3.select("#toggle-play").on("click", function() {
        if (timer) {
            clearInterval(timer);
            timer = null;
            d3.select(this).text("Start");
        } else {
            timer = setInterval(advance, 1000);
            d3.select(this).text("Pause");
        }
    });

    d3.select("#restart").on("click", function() {
        clearInterval(timer);
        timer = null;
        yearPos = 0;
        render(cleanedData[yearPos]);
        d3.select("#toggle-play").text("Start");
    });

    d3.select("#time-slider").on("input", function() {
        yearPos = +this.value - 1800;
        render(cleanedData[yearPos]);
    });

    d3.select("#region-filter").on("change", function() {
        render(cleanedData[yearPos]);
    });

    render(cleanedData[0]);

    var legendGroup = canvas.append("g").attr("transform", `translate(${chartWidth + 40}, 20)`);

    regions.forEach((region, i) => {
        var legendItem = legendGroup.append("g").attr("transform", `translate(0, ${i * 25})`);

        legendItem.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", colorScale(region));

        legendItem.append("text")
            .attr("x", 30)
            .attr("y", 15)
            .text(region);
    });
});