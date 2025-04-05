const margins = { top: 60, right: 220, bottom: 60, left: 120 },
    chartWidth = 900 - margins.left - margins.right,
    chartHeight = 500 - margins.top - margins.bottom;

const chartSvg = d3.select("#chart-area")
    .append("svg")
    .attr("width", chartWidth + margins.left + margins.right)
    .attr("height", chartHeight + margins.top + margins.bottom)
    .style("display", "block")
    .style("margin", "auto")
    .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`);

const scaleX = d3.scaleLog().domain([142, 150000]).range([0, chartWidth]);
const scaleY = d3.scaleLinear().domain([0, 90]).range([chartHeight, 0]);
const bubbleSize = d3.scaleLinear().domain([2000, 1400000000]).range([25 * Math.PI, 1500 * Math.PI]);
const colorScale = d3.scaleOrdinal(d3.schemePastel1);

const bottomAxis = d3.axisBottom(scaleX)
    .tickValues([400, 4000, 40000])
    .tickFormat(d => `$${d}`);
const leftAxis = d3.axisLeft(scaleY);

chartSvg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(bottomAxis);

chartSvg.append("g")
    .attr("class", "y-axis")
    .call(leftAxis);

chartSvg.append("text")
    .attr("class", "x-label")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 45)
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");

chartSvg.append("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -80)
    .attr("text-anchor", "middle")
    .text("Life Expectancy (Years)");

const yearText = chartSvg.append("text")
    .attr("class", "year-label")
    .attr("x", chartWidth + 100)
    .attr("y", chartHeight - 20)
    .attr("text-anchor", "end")
    .attr("font-size", "40px")
    .attr("fill", "gray");

const legend = chartSvg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${chartWidth + 100}, ${chartHeight - 160})`);

d3.json("data/data.json").then(dataset => {
    const processedData = dataset.map(yearObj => ({
        year: yearObj.year,
        countries: yearObj.countries.filter(c => c.income && c.life_exp).map(c => {
            return {
                ...c,
                income: +c.income,
                life_exp: +c.life_exp
            };
        })
    }));

    const allContinents = [...new Set(processedData.flatMap(d => d.countries.map(c => c.continent)))];

    const legendRows = legend.selectAll(".legend-row")
        .data(allContinents)
        .enter().append("g")
        .attr("class", "legend-row")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendRows.append("rect")
        .attr("x", 10)
        .attr("y", -10)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => colorScale(d));

    legendRows.append("text")
        .attr("x", 35)
        .attr("y", 4)
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text(d => d);

    let yearStep = 0;

    function draw(yearData) {
        const t = d3.transition().duration(1000);

        const circles = chartSvg.selectAll("circle").data(yearData.countries, d => d.country);

        circles.exit()
            .transition(t)
            .attr("r", 0)
            .remove();

        circles.enter()
            .append("circle")
            .attr("fill", d => colorScale(d.continent))
            .attr("cx", d => scaleX(d.income))
            .attr("cy", d => scaleY(d.life_exp))
            .attr("r", 0)
            .merge(circles)
            .transition(t)
            .attr("cx", d => scaleX(d.income))
            .attr("cy", d => scaleY(d.life_exp))
            .attr("r", d => Math.sqrt(bubbleSize(d.population) / Math.PI));

        yearText.text(yearData.year);
    }

    d3.interval(() => {
        yearStep = (yearStep + 1) % processedData.length;
        draw(processedData[yearStep]);
    }, 1000);

    draw(processedData[0]);
});
