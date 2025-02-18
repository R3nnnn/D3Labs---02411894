d3.json("data/buildings.json").then((data) => {
    // Parse height values as numbers
    data.forEach((d) => {
        d.height = +d.height;
    });

    var margin = { top: 50, right: 20, bottom: 150, left: 50 }; // Had to increase bottom margin, same case as the other exercise, the labels were cut off
    var width = 800 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g") // Group for the chart area
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([height, 0]);

    svg.selectAll("rect") //Create the buildingds
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.height))
        .attr("fill", "steelblue");

    // Add rotated labels
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr("x", d => x(d.name) + x.bandwidth() / 2) // Center text under the buildings
        .attr("y", d => y(d.height) - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("transform", d => `
            rotate(-45, ${x(d.name) + x.bandwidth() / 2}, ${y(d.height) - 10})
        `); // Rotate the labels 45 degrees so they fit :'D

}).catch((error) => {
    console.error("Error loading data:", error);
});