d3.json("data/ages.json")
    .then((data) => {
        // Parse the age values as numbers
        data.forEach((d) => {
            d.age = +d.age;
        });

        console.log(data); // Verify the data

        // Create SVG canvas
        var svg = d3.select("body").append("svg")
            .attr("width", 400)
            .attr("height", 200);

        // Bind data to circles and create them
        var circles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => 50 + i * 80) // Space circles
            .attr("cy", 100) // Center circles vertically
            .attr("r", (d) => d.age * 2) // Set radius based on the age
            .attr("fill", (d) => (d.age > 10 ? "#77DD77" : "#87CEEB"));
    })
    .catch((error) => {
        console.error("Error loading the data:", error); //Shows the error in console
    });