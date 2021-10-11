var margin = { top: 10, right: 30, bottom: 30, left: 100 },
    width = 650 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var chosenCountry1 = document.getElementById("country1")
chosenCountry1.addEventListener('input', function (e) { check1(this) })

var chosenCountry2 = document.getElementById("country2")
chosenCountry2.addEventListener('input', function (e) { check2(this) })

var list = document.getElementById("allCountries")

var country1;
var country2;

var clear = function (e) {
    d3.select('#timeGraph').selectAll('svg').remove();
    d3.select('#barGraph').selectAll('svg').remove();
}

var check1 = function (e) {
    for (var i = 0; i < list.childElementCount; i++) {
        if (list.children[i].value.localeCompare(e.value) == 0) {
            if (e.value.localeCompare("United States") == 0) {
                country1 = "United States"
                clear()
                draw()
            }
            else {
                country1 = e.value
                clear()
                draw()
            }
        }
    }

}

var check2 = function (e) {
    for (var i = 0; i < list.childElementCount; i++) {
        if (list.children[i].value.localeCompare(e.value) == 0) {
            if (e.value.localeCompare("United States") == 0) {
                country2 = "United States"
                clear()
                draw()
            }
            else {
                country2 = e.value
                clear()
                draw()
            }
        }
    }
}

var draw = function (e) {
    if (country1 != undefined && country2 != undefined) {
        if (country1.localeCompare("United States") == 0 || country2.localeCompare("United States") == 0) {
            lineGraphUS()
            barGraphUS()
        }
        else {
            lineGraph()
            barGraph()
        }
    }
}


var lineGraph = function (e) {
    var filteredData1 = []//new data array with only the specified country data
    //needs a separate checker for United States because US is part of different csv
    var filteredData2 = []
    var allDates1 = []
    var allDates2 = []
    var c1 = country1;
    var c2 = country2;

    d3.csv("static/data/countries-aggregated.csv").then(function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Country.localeCompare(c1) == 0) {
                filteredData1.push(data[i])
                allDates1.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
            }
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i].Country.localeCompare(c2) == 0) {
                filteredData2.push(data[i])
                allDates2.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
            }
        }
        //console.log(filteredData)
        //console.log(allDates)
        for (i = 0; i < filteredData1.length; i++) {
            filteredData1[i].Date = allDates1[i]
        }
        for (i = 0; i < filteredData2.length; i++) {
            filteredData2[i].Date = allDates2[i]
        }

        if (parseInt(filteredData1[filteredData1.length - 1].Confirmed) < parseInt(filteredData2[filteredData2.length - 1].Confirmed)) {
            //filteredData1 will always be the one with the highest number of cases so the graph won't cut off some data
            var temp = filteredData1
            filteredData1 = filteredData2
            filteredData2 = temp
            var temp2 = allDates1
            allDates1 = allDates2
            allDates2 = temp2
        }
        var svg = d3.select("#timeGraph")
            .append("svg")
            .attr("width", width + margin.left + margin.right + 60)
            .attr("height", height + 2 * (margin.top + margin.bottom))
            .attr("id", "gSelect")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + 2 * margin.top + ")");

        var x = d3.scaleTime()
            .domain(d3.extent(allDates1))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0, d3.max(filteredData1, function (d) { return +d.Confirmed; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(filteredData1)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.Date) })
                .y(function (d) { return y(d.Confirmed) })
            )

        svg.append("path")
            .datum(filteredData2)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.Date) })
                .y(function (d) { return y(d.Confirmed) })
            )

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration", "underline")
            .text("Total Cases of " + c1 + " and " + c2 + " over Time");

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
            .text("Number of Cases");

        var curtain = svg.append("rect")
            .attr('x', -1 * width)
            .attr('y', -1 * height)
            .attr('height', height)
            .attr('width', width - (width / 59))
            .attr('id', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#FFFFFF');

        d3.select("rect").transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("x", width * -2 - 100)
            .on("end", label);

        function label() {
            svg.append("text")
            .attr("transform", "translate(" + (width + 3) + "," + y(Number(filteredData1[filteredData1.length - 1].Confirmed)) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "blue")
            .text(filteredData1[0].Country);

        svg.append("text")
            .attr("transform", "translate(" + (width + 3) + "," + y(Number(filteredData2[filteredData2.length - 1].Confirmed)) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "red")
            .text(filteredData2[0].Country);
        }
    })
    //console.log(filteredData)
}

var lineGraphUS = function (e) {
    var c1;
    var c2;
    if (country2.localeCompare("United States") == 0) {
        c1 = country2
        c2 = country1
    }
    else {
        c1 = country1
        c2 = country2
    }
    var filteredData1 = []//new data array with only the specified country data
    //needs a separate checker for United States because US is part of different csv
    var allDates1 = []
    var allUSConfirmed1 = []
    d3.csv("static/data/key-countries-pivoted.csv").then(function (data) {

        for (var i = 0; i < data.length; i++) {
            allDates1.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
            allUSConfirmed1.push({ Date: data[i] }.US)
            filteredData1.push(data[i])
        }

        //console.log(filteredData)
        //console.log(allDates)
        for (var i = 0; i < filteredData1.length; i++) {
            filteredData1[i].Date = allDates1[i]
        }
        //console.log(filteredData)
        var svg = d3.select("#timeGraph")
            .append("svg")
            .attr("width", width + margin.left + margin.right + 70)
            .attr("height", height + 2 * (margin.top + margin.bottom))
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + 2 * margin.top + ")");

        var x = d3.scaleTime()
            .domain(d3.extent(allDates1))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0, d3.max(filteredData1, function (d) { return +d.US; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(filteredData1)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.Date) })
                .y(function (d) { return y(d.US) })
            )

        svg.append("text")
            .attr("transform", "translate(" + (width + 3) + "," + y(Number(filteredData1[filteredData1.length - 1].US)) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "steelblue")
            .text("United States");

        if (c2.localeCompare("United States") != 0) {
            d3.csv("static/data/countries-aggregated.csv").then(function (data2) {
                var filteredData2 = []
                var allDates2 = []
                for (var i = 0; i < data2.length; i++) {
                    if (data2[i].Country.localeCompare(c2) == 0) {
                        filteredData2.push(data2[i])
                        //console.log(data2[i])
                        allDates2.push(d3.timeParse("%Y-%m-%d")(data2[i].Date))
                    }
                }
                for (i = 0; i < filteredData2.length; i++) {
                    filteredData2[i].Date = allDates2[i]
                }

                svg.append("path")
                    .datum(filteredData2)
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.Date) })
                        .y(function (d) { return y(d.Confirmed) })
                    )

                svg.append("text")
                    .attr("transform", "translate(" + (width + 3) + "," + y(Number(filteredData2[filteredData2.length - 1].Confirmed)) + ")")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "start")
                    .style("fill", "red")
                    .text(filteredData2[0].Country);
            })
        }

        var curtain = svg.append("rect")
            .attr('x', -1 * width)
            .attr('y', -1 * height)
            .attr('height', height)
            .attr('width', width - (width / 59))
            .attr('id', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#FFFFFF');

        d3.select("rect").transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("x", width * -2 - 100);
        
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration", "underline")
            .text("Total Cases of " + c1 + " and " + c2 + " over Time");

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
            .text("Number of Cases");
    })
}

var barGraph = function (e) {
    var svg = d3.select("#barGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + 2 * (margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + 2 * margin.top + ")");

    d3.csv("static/data/countries-aggregated.csv").then(function (data) {
        var allCategories = []//country names will be the group of bars name
        var allSubCategories = []//confirmed, recovered, deaths
        var filteredData1 = []
        var filteredData2 = []
        for (var i = 0; i < data.length; i++) {
            if (data[i].Country.localeCompare(country1) == 0) {
                filteredData1.push(data[i])
            }
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i].Country.localeCompare(country2) == 0) {
                filteredData2.push(data[i])
            }
        }
        if (parseInt(filteredData1[filteredData1.length - 1].Confirmed) < parseInt(filteredData2[filteredData2.length - 1].Confirmed)) {
            //filteredData1 will always be the one with the highest number of cases so the graph won't cut off some data
            var temp = filteredData1
            filteredData1 = filteredData2
            filteredData2 = temp
        }

        var refilteredData = []
        refilteredData.push(filteredData1[filteredData1.length - 1])
        refilteredData.push(filteredData2[filteredData2.length - 1])

        console.log(filteredData1)
        console.log(filteredData2)

        var subgroups = data.columns.slice(2)
        var groups = d3.map(refilteredData, function (d) { return (d.Country) }).keys()

        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        var y = d3.scaleLinear()
            .domain([0, d3.max(refilteredData, function (d) { return +d.Confirmed; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

        svg.append("g")
            .selectAll("g")
            .data(refilteredData)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d.Country) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter().append("rect")
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("y", function (d) { return y(0); })
            .attr("width", xSubgroup.bandwidth())
            .attr("fill", function (d) { return color(d.key); });
        svg.selectAll("rect").transition()
            .duration(1000)
            .attr("height", function (d) { return height - y(d.value); })
            .attr("y", function (d) { return y(d.value); })
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration", "underline")
            .text("Comparison between the Types of Cases of the Two Countries");

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", height + margin.bottom + 1)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Country");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Number of Cases");


        var c = ["Confirmed", "Recovered", "Deaths"]
        var legend = svg.selectAll(".legend")
            .data(c)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity", "100");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) { return color(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d, i) { return c[i]; });
    })

}

var barGraphUS = function (e) {
    var svg = d3.select("#barGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + 2 * (margin.top + margin.bottom))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + 2 * margin.top + ")");

    d3.csv("static/data/key-countries-pivoted.csv").then(function (data) {
        var allCategories = []//country names will be the group of bars name
        var allSubCategories = []//confirmed, recovered, deaths
        var filteredData1 = []
        var filteredData2 = []
        var c1 = country1
        var c2 = country2
        if (c2.localeCompare("United States") == 0) {
            var temp = c1
            c1 = c2
            c2 = temp
        }

        filteredData1.push({
            Date: data[data.length - 1].Date, Country: "United States", Confirmed: data[data.length - 1].US,
            Recovered: 164000, Deaths: 72023
        })


        var refilteredData = []
        refilteredData.push(filteredData1[filteredData1.length - 1])

        if (c2.localeCompare("United States") == 0) {
            var subgroups = ['Confirmed', 'Recovered', 'Deaths']
            var groups = d3.map(refilteredData, function (d) { return (d.Country) }).keys()
            console.log(subgroups)
            console.log(groups)
            var x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0));

            var y = d3.scaleLinear()
                .domain([0, d3.max(refilteredData, function (d) { return +d.Confirmed; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8', '#4daf4a'])

            svg.append("g")
                .selectAll("g")
                .data(refilteredData)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + x(d.Country) + ",0)"; })
                .selectAll("rect")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter().append("rect")
                .attr("x", function (d) { return xSubgroup(d.key); })
                .attr("y", function (d) { return y(0); })
                .attr("width", xSubgroup.bandwidth())
                .attr("fill", function (d) { return color(d.key); });
            svg.selectAll("rect").transition()
                .duration(1000)
                .attr("height", function (d) { return height - y(d.value); })
                .attr("y", function (d) { return y(d.value); })
            var c = ["Confirmed", "Recovered", "Deaths"]
            var legend = svg.selectAll(".legend")
                .data(c)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
                .style("opacity", "100");

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function (d) { return color(d); });

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d, i) { return c[i]; });
        }
        else {
            d3.csv("static/data/countries-aggregated.csv").then(function (moreData) {
                for (var i = 0; i < moreData.length; i++) {
                    if (moreData[i].Country.localeCompare(c2) == 0) {
                        filteredData2.push(moreData[i])
                    }
                }
                refilteredData.push(filteredData2[filteredData2.length - 1])
                var subgroups = moreData.columns.slice(2)
                var groups = d3.map(refilteredData, function (d) { return (d.Country) }).keys()
                console.log(subgroups)
                console.log(groups)
                var x = d3.scaleBand()
                    .domain(groups)
                    .range([0, width])
                    .padding([0.2])
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).tickSize(0));

                var y = d3.scaleLinear()
                    .domain([0, d3.max(refilteredData, function (d) { return +d.Confirmed; })])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                var xSubgroup = d3.scaleBand()
                    .domain(subgroups)
                    .range([0, x.bandwidth()])
                    .padding([0.05])

                var color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(['#e41a1c', '#377eb8', '#4daf4a'])

                svg.append("g")
                    .selectAll("g")
                    .data(refilteredData)
                    .enter()
                    .append("g")
                    .attr("transform", function (d) { return "translate(" + x(d.Country) + ",0)"; })
                    .selectAll("rect")
                    .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                    .enter().append("rect")
                    .attr("x", function (d) { return xSubgroup(d.key); })
                    .attr("y", function (d) { return y(0); })
                    .attr("width", xSubgroup.bandwidth())
                    .attr("height", function (d) { return height - y(d.value); })
                    .attr("fill", function (d) { return color(d.key); });
                svg.selectAll("rect").transition()
                    .duration(1000)
                    .attr("height", function (d) { return height - y(d.value); })
                    .attr("y", function (d) { return y(d.value); })
                var c = ["Confirmed", "Recovered", "Deaths"]
                var legend = svg.selectAll(".legend")
                    .data(c)
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
                    .style("opacity", "100");

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", function (d) { return color(d); });

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d, i) { return c[i]; });
            })
        }
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration", "underline")
            .text("Comparison between the Types of Cases of the Two Countries");

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", height + margin.bottom + 1)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Country");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Number of Cases");
    })
}
