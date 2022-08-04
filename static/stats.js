// graph variables
var margin = { top: 10, right: 30, bottom: 30, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// animation variables
var timeCounter;
var id;
var now, then, elapsed, fpsInterval;
var fps = 20;

// adds EventListener to search bar.
var chosenCountry = document.getElementById("country")
chosenCountry.addEventListener('input', function (e) { check(this) })

var list = document.getElementById("allCountries")


// Checks if input is a valid country.
function check(e) {
    for (var i = 0; i < list.childElementCount; i++) {
        if (list.children[i].value.localeCompare(e.value) == 0) {
            if (e.value.localeCompare("United States") == 0) {
                clear()
                initTimeGraphUS()
                createPopulationPieUS("US")
                createBarGraphUS("US")
            }
            else {
                // clears any previous graphs.
                clear()
                // creates the line graph showing confirmed cases over time.
                // e.value is the chosen country.
                initTimeGraph(e.value)
                // creates the population relative to confirmed cases pie graph.
                createPopulationPie(e.value)
                // creates the bar graph showing confirmeed, recovered, and death cases.
                createBarGraph(e.value)
            }
        }
    }
}

/**
 *  Clears the page of all graphs.
 */
var clear = function (e) {
    timeCounter = 1;
    window.cancelAnimationFrame(id);
    d3.select('#timeGraph').selectAll('svg').remove();
    d3.select('#populationPie').selectAll('svg').remove();
    d3.select('#barGraph').selectAll('svg').remove();
}


// time graph variables
var initTimeDate = [];
var timeData;
var formatTimeData;
d3.csv("static/data/countries-aggregated.csv").then(function (data) {
    timeData = data;
});

/**
 * Initializes and creates animated confirm cases over time graph.
 * Controlling animation fps using source https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe.
 */
function initTimeGraph(country) {
    formatTimeData = getTimeGraphData(country);
    fpsInterval = 1000 / fps;
    // then variable stores time of last drawn frame
    then = Date.now();
    // requests a frame
    id = window.requestAnimationFrame(animTimeGraph);
}

/**
 * Draws a frame of the time graph and recursively calls itself until all frames are drawn in the graph, thus completed.
 */
var animTimeGraph = function (e) {
    // if all frames/data are drawn/animated then theres nothing left to animate, thus closing the loop by returning.
    if (timeCounter > timeData[1].length) return;
    // calculates the elapsed time since last loop/frame
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        //removes previous frame and draws a new one with an updated time.
        d3.select('#timeGraph').selectAll('svg').remove();
        createTimeGraph(timeCounter++);
        then = now - (elapsed % fpsInterval);
    }
    // calls itself to continue animating until all data/frames are animated
    id = window.requestAnimationFrame(animTimeGraph);
}

/**
 * Gets and returns the data of a specified country for the time graph.
 */
function getTimeGraphData(country) {
    var data = timeData;
    var filteredData = [] // new data array with only the specified country data
    var allDates = []
    var allCountries = []
    var allConfirmed = []
    var allRecovered = []
    var allDeaths = []

    for (var i = 0; i < data.length; i++) {
        // finds the data of the specified country.
        if (data[i].Country.localeCompare(country) == 0) {
            filteredData.push(data[i])
            // Only timeparse the data on the first loop.
            // Will timeparse already parsed time if not done.
            if (initTimeDate.includes(country)) {
                allDates.push((data[i].Date))
            }
            else {
                allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
            }
            allCountries.push({ Country: data[i].Country })
            allConfirmed.push({ Confirmed: data[i].Confirmed })
            allRecovered.push({ Recovered: data[i].Recovered })
            allDeaths.push({ Deaths: data[i].Deaths })
        }
    }
    if (! initTimeDate.includes(country)) initTimeDate.push(country);
    return [filteredData, allDates, allCountries, allConfirmed, allRecovered, allDeaths];
}

/**
 * Creates the time graph.
 */
function createTimeGraph(timeCounter) {
    var filteredData = formatTimeData[0];
    filteredData = filteredData.slice(0, timeCounter);
    var allDates = formatTimeData[1];
    allDates = allDates.slice(0, timeCounter);
    for (i = 0; i < filteredData.length; i++) {
        filteredData[i].Date = allDates[i]
    }

    // creates the graph and draws the axises.
    var svg = d3.select("#timeGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right + 55)
        .attr("height", height + (2 * (margin.top + margin.bottom)))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + (2 * margin.top) + ")");
    var xAxis = d3.scaleTime()
        .domain(d3.extent(allDates))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));

    var yAxis = d3.scaleLinear()
        .domain([0, d3.max(filteredData, function (d) { return +d.Confirmed; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));

    // draws the line
    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(d.Date) })
            .y(function (d) { return yAxis(d.Confirmed) })
        )

    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(d.Date) })
            .y(function (d) { return yAxis(d.Recovered) })
        )

    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(d.Date) })
            .y(function (d) { return yAxis(d.Deaths) })
        )

    // adds a label to the confirmed cases line.
    svg.append("text")
        .attr("transform", "translate(" + (width + 3) + "," + yAxis(Number(filteredData[filteredData.length - 1].Confirmed)) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "blue")
        .text("Confirmed");

    // adds a label to the recovered cases line.
    svg.append("text")
        .attr("transform", "translate(" + (width + 3) + "," + yAxis(Number(filteredData[filteredData.length - 1].Recovered)) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("Recovered");

    // adds a label to the death cases line.
    svg.append("text")
        .attr("transform", "translate(" + (width + 3) + "," + yAxis(Number(filteredData[filteredData.length - 1].Deaths)) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "red")
        .text("Deaths");

    // adds a title to the graph.
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "underline")
        .text("Number of Cases Over Time");

    // adds a label to the x axis.
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + margin.bottom + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Date");

    // adds a label to the y axis.
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Total Number of Cases");
}

var initTimeUS = true;
var timeDataUS;
var formatTimeDataUS;
d3.csv("static/data/key-countries-pivoted.csv").then(function (data) {
    timeDataUS = data;
});

/**
 * Gets and returns the data of US for the time graph.
 * Operates similarly to initTimeGraph().
 */
function initTimeGraphUS() {
    if (initTimeUS) {
        formatTimeDataUS = getTimeGraphDataUS();
        initTimeUS = false;
    }

    fpsInterval = 1000 / fps;
    then = Date.now();

    id = window.requestAnimationFrame(animTimeGraphUS);
}

/**
 * Draws a frame of the time graph and recursively calls itself until all frames are drawn in the graph, thus completed.
 * Operates similarly to animTimeGraph() except for the US.
 */
function animTimeGraphUS() {
    if (timeCounter > timeDataUS[1].length) return;
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        d3.select('#timeGraph').selectAll('svg').remove();
        createTimeGraphUS(timeCounter++);
        then = now - (elapsed % fpsInterval);
    }
    id = window.requestAnimationFrame(animTimeGraphUS);
}

/**
 * Draws a frame of the time graph and recursively calls itself until all frames are drawn in the graph, thus completed.
 * Operates similarly to getTimeGraphData().
 */
function getTimeGraphDataUS() {
    // needs a separate checker for United States because US is part of different csv
    var data = timeDataUS;
    var filteredData = []
    var allDates = []
    var allUSConfirmed = []
    for (var i = 0; i < data.length; i++) {
        allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
        allUSConfirmed.push({ Date: data[i] }.US)
        filteredData.push(data[i])
    }
    return [filteredData, allDates, allUSConfirmed];
}

/**
 * Creates the time graph for US.
 * Operates similarly to createTimeGraph().
 */
function createTimeGraphUS(timeCounter) {
    var filteredData = formatTimeDataUS[0];
    filteredData = filteredData.slice(0, timeCounter);
    var allDates = formatTimeDataUS[1];
    allDates = allDates.slice(0, timeCounter);
    var allUSConfirmed = formatTimeDataUS[2]

    for (i = 0; i < filteredData.length; i++) {
        filteredData[i].Date = allDates[i]
    }

    // create svg.
    var svg = d3.select("#timeGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + 2 * (margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + 2 * margin.top + ")");

    // create and add axises to graph.
    var xAxis = d3.scaleTime()
        .domain(d3.extent(allDates))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));

    var yAxis = d3.scaleLinear()
        .domain([0, d3.max(filteredData, function (d) { return +d.US; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));

    // add lines.
    svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return xAxis(d.Date) })
            .y(function (d) { return yAxis(d.US) })
        )

    // add labels.
    svg.append("text")
        .attr("transform", "translate(" + (width + 3) + "," + yAxis(Number(parseInt(filteredData[filteredData.length - 1].US))) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "blue")
        .text("Confirmed");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "underline")
        .text("Number of Cases in the United States Over Time");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + margin.bottom + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Date");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Total Number of Cases");
}

/**
 * Creates the population pie chart.
 */
function createPopulationPie(e) {
    var width = 450
    var height = 450
    var margin = 40

    var radius = Math.min(width, height) / 2 - margin

    // creates the graph svg.
    var svg = d3.select("#populationPie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // adds a title to the graph.
    svg.append("text")
        .attr("x", 0)
        .attr("y", 0 - height / 2.25)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Confirmed Cases Vs. Healthy Cases");


    var population = 0
    var latestNumOfConfirmed = 0
    var allConfirmedDays = []

    // extract the data from the CSV files.
    d3.csv("static/data/reference.csv").then(function (data) {
        //reference.csv includes state/province population so we only need the first match which is total population
        // gets total population data.
        var found = false;
        for (var i = 0; i < data.length; i++) {
            if (e.localeCompare(data[i].Country_Region) == 0 && !found) {
                population = data[i].Population
                found = true
            }
        }

        // gets confirmed cases data.
        d3.csv("static/data/countries-aggregated.csv").then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Country.localeCompare(e) == 0) {
                    allConfirmedDays.push(data[i].Confirmed)
                }
            }
            latestNumOfConfirmed = allConfirmedDays[allConfirmedDays.length - 1]
            var pieData = { Healthy: population - latestNumOfConfirmed, Confirmed: parseInt(latestNumOfConfirmed) }

            // creates the pie chart from the data using the two specified colors.
            var color = d3.scaleOrdinal()
                .domain(pieData)
                .range(["#73c378", "#f9694c"]);
            var pie = d3.pie()
                .value(function (d) { return d.value; })
            var data_ready = pie(d3.entries(pieData))
            var arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', function (d) { return (color(d.data.key)) })
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .enter()
                .append('text')
                .text(function (d) { return d.data.key })
                .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
                .style("text-anchor", "middle")
                .style("font-size", 17)
        })
    })
}

/**
 * Creates the population pie chart for the US.
 * Operates similarly to createPopulationPie().
 */
function createPopulationPieUS(e) {
    var width = 450
    var height = 450
    var margin = 40

    var radius = Math.min(width, height) / 2 - margin

    var svg = d3.select("#populationPie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var population = 0
    var latestNumOfConfirmed = 0
    var allConfirmedDays = []

    d3.csv("static/data/reference.csv").then(function (data) {
        var found = false;
        for (var i = 0; i < data.length; i++) {
            if (e.localeCompare(data[i].Country_Region) == 0 && !found) {
                population = data[i].Population
                found = true
            }
        }


        d3.csv("static/data/key-countries-pivoted.csv").then(function (data) {
            for (var i = 0; i < data.length; i++) {
                allConfirmedDays.push(data[i].US)
            }
            latestNumOfConfirmed = allConfirmedDays[allConfirmedDays.length - 1]
            var pieData = { Healthy: population - latestNumOfConfirmed, Confirmed: parseInt(latestNumOfConfirmed) }

            var color = d3.scaleOrdinal()
                .domain(pieData)
                .range(["#73c378", "#f9694c"]);

            var pie = d3.pie()
                .value(function (d) { return d.value; })
            var data_ready = pie(d3.entries(pieData))
            var arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', function (d) { return (color(d.data.key)) })
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .enter()
                .append('text')
                .text(function (d) { return d.data.key })
                .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
                .style("text-anchor", "middle")
                .style("font-size", 17)

            svg.append("text")
                .attr("x", 0)
                .attr("y", 0 - height / 2.25)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Confirmed Cases Vs. Healthy Cases in the United States");

        })
    })
}


/**
 * Creates a bar graph for a specified country showing number of confirmed, recovered, and death cases.
 */
function createBarGraph(e) {
    // creates the graph svg.
    var width = 550
    var height = 450
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);
    var svg = d3.select("#barGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + (2 * (margin.top + margin.bottom)))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + (2 * margin.top) + ")");

    d3.csv("static/data/countries-aggregated.csv").then(function (data) {
        //gets all rows related the specified country.
        var filteredData = []
        for (var i = 0; i < data.length; i++) {
            if (data[i].Country.localeCompare(e) == 0) {
                filteredData.push(data[i])
            }
        }
        filteredData = [filteredData[filteredData.length - 1]]
        filteredData = [{ Category: "Confirmed", number: filteredData[0].Confirmed },
        { Category: "Recovered", number: filteredData[0].Recovered },
        { Category: "Deaths", number: filteredData[0].Deaths }]
        var allCategory = []
        var allNumbers = []
        for (var i = 0; i < filteredData.length; i++) {
            allCategory.push({ Category: filteredData[i].Category })
            allNumbers.push({ number: filteredData[i].number })
        }

        x.domain(filteredData.map(function (d) { return d.Category; }));
        y.domain([0, d3.max(filteredData, function (d) { return +d.number; })]);

        // draws the axises.
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));

        // draws the bars.
        svg.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "#88cd87")
            .attr("x", function (d) { return x(d.Category); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(0); })
        svg.selectAll("rect").transition()
            .duration(1000)
            .attr("y", function (d) { return y(Number(d.number)); })
            .attr("height", function (d) { return height - y(Number(d.number)); });

        // adds a title to the graph.
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Comparison between the Types of Cases in " + e);

        // adds a label to the x axis.
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", height + margin.bottom + 1)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Types of Cases");

        // adds a label to the y axis.
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Total Number of Cases");
    })
}

/**
 * Creates a bar graph for the US showing number of confirmed, recovered, and death cases.
 * Operates similarly to createBarGraph().
 */
function createBarGraphUS(e) {
    var width = 550
    var height = 450
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select("#barGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + 2 * (margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + 2 * margin.top + ")");

    d3.csv("static/data/key-countries-pivoted.csv").then(function (data) {
        var filteredData = [data[data.length - 1]]
        filteredData = [{ Category: "Confirmed", number: filteredData[0].US },
        { Category: "Recovered", number: 164000 },
        { Category: "Deaths", number: 72023 }]

        var allCategory = []
        var allNumbers = []
        for (var i = 0; i < filteredData.length; i++) {
            allCategory.push({ Category: filteredData[i].Category })
            allNumbers.push({ number: filteredData[i].number })
        }

        x.domain(filteredData.map(function (d) { return d.Category; }));
        y.domain([0, d3.max(filteredData, function (d) { return +d.number; })]);

        console.log(filteredData[0].number)

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "#88cd87")
            .attr("x", function (d) { return x(d.Category); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(0); })
        svg.selectAll("rect").transition()
            .duration(1000)
            .attr("y", function (d) { return y(Number(d.number)); })
            .attr("height", function (d) { return height - y(Number(d.number)); });
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Comparison between the Types of Cases in the United States");

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", height + margin.bottom + 1)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Types of Cases");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Total Number of Cases");

    })
}
