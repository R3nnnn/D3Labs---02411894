d3.json("data/buildings.json").then((data) => {
    // Parse height values as numbers
    data.forEach((d) => {
        d.height = +d.height;
    });

    console.log(data); // Verify the parsed data

    // Create SVG canvas
    var svg = d3.select("body").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    // Bind data to rectangles and create rectangles
    var rectangles = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 80) // Stagger rectangles horizontally
        .attr("y", (d) => 600 - d.height) // Align rectangles to the bottom
        .attr("width", 50) // Fixed width for each rectangle
        .attr("height", (d) => d.height) // Height based on building height
        .attr("fill", "steelblue"); // Default fill color

    // Add labels for each building
    var labels = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text((d) => d.name) // Display the building name
        .attr("x", (d, i) => i * 80 + 10) // Position text near the rectangles
        .attr("y", (d) => 600 - d.height - 5) // Position text above the rectangles
        .attr("font-size", "12px")
        .attr("fill", "black");
}).catch((error) => {
    console.error("Error loading the data:", error); // Log the error
});