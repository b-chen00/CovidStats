window.onload = function(){
  lineGraphCountries()
  lineGraphAggregated()
  mapWorld()
  rankedCircle()
  percentGrowth()
}

var margin = {top: 10, right: 30, bottom: 30, left: 100},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    innerRadius = 45,
    outerRadius = Math.min(width, height) / 2;

var lineGraphCountries = function(e){
  var filteredData = []//new data array with only the specified country data
  //needs a separate checker for United States because US is part of different csv
  var allDates = []
  d3.csv("static/data/key-countries-pivoted.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      filteredData.push({Date : d3.timeParse("%Y-%m-%d")(data[i].Date),
                        China : data[i].China, US : data[i].US,
                        United_Kingdom : data[i].United_Kingdom,
                        Italy : data[i].Italy, France : data[i].France,
                        Germany: data[i].Germany, Spain: data[i].Spain,
                        Iran : data[i].Iran})
      allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
    }
    var svg = d3.select("#lineGraphCountries")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + 2 * (margin.top + margin.bottom))
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top * 2 + ")");

    var x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, function(d) { return +d.US; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
     .datum(filteredData)
     .attr("fill", "none")
     .attr("stroke", "red")
     .attr("stroke-width", 1.5)
     .attr("d", d3.line()
       .x(function(d) { return x(d.Date) })
       .y(function(d) { return y(d.China) })
     )
   svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Date) })
      .y(function(d) { return y(d.US) })
    )
  svg.append("path")
   .datum(filteredData)
   .attr("fill", "none")
   .attr("stroke", "purple")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.United_Kingdom) })
   )
   svg.append("path")
   .datum(filteredData)
   .attr("fill", "none")
   .attr("stroke", "yellow")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
   .x(function(d) { return x(d.Date) })
   .y(function(d) { return y(d.Italy) })
   )
   svg.append("path")
   .datum(filteredData)
   .attr("fill", "none")
   .attr("stroke", "orange")
   .attr("stroke-width", 1.5)
   .attr("d", d3.line()
   .x(function(d) { return x(d.Date) })
   .y(function(d) { return y(d.France) })
  )
  svg.append("path")
  .datum(filteredData)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.Date) })
  .y(function(d) { return y(d.Germany) })
  )
  svg.append("path")
  .datum(filteredData)
  .attr("fill", "none")
  .attr("stroke", "pink")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.Date) })
  .y(function(d) { return y(d.Spain) })
  )
  svg.append("path")
  .datum(filteredData)
  .attr("fill", "none")
  .attr("stroke", "gray")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.Date) })
  .y(function(d) { return y(d.Iran) })
  )

  svg.append("circle")
    .attr("cx",60).attr("cy",25).attr("r",8).style("fill", "red")
  svg.append("text").attr("x", 70).attr("y", 30).text("China").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",45).attr("r",8).style("fill", "blue")
  svg.append("text").attr("x", 70).attr("y", 50).text("United States").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",65).attr("r",8).style("fill", "purple")
  svg.append("text").attr("x", 70).attr("y", 70).text("United Kingdom").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",85).attr("r",8).style("fill", "yellow")
  svg.append("text").attr("x", 70).attr("y", 90).text("Italy").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",105).attr("r",8).style("fill", "orange")
  svg.append("text").attr("x", 70).attr("y", 110).text("France").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",125).attr("r",8).style("fill", "green")
  svg.append("text").attr("x", 70).attr("y", 130).text("Germany").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",145).attr("r",8).style("fill", "pink")
  svg.append("text").attr("x", 70).attr("y", 150).text("Spain").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("circle")
    .attr("cx",60).attr("cy",165).attr("r",8).style("fill", "gray")
  svg.append("text").attr("x", 70).attr("y", 170).text("Iran").style("font-size", "15px").attr("alignment-baseline","middle")

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("text-decoration", "underline")
    .text("Total Cases Over Time of Eight Countries with the Most Cases");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", height + margin.bottom + 5)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Date");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", -65)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Number of Cases");
  })

}

var lineGraphAggregated = function(e){
  var width = 1000
  var filteredData = []
  var allDates = []
  d3.csv("static/data/worldwide-aggregated.csv").then(function(data){
    for (var i = 0; i < data.length; i++){
      filteredData.push({Date : d3.timeParse("%Y-%m-%d")(data[i].Date),
                        Confirmed : data[i].Confirmed, Recovered : data[i].Recovered,
                        Deaths : data[i].Deaths})
      allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
    }
    var svg = d3.select("#lineGraphAggregated")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 55)
        .attr("height", height + 2 * (margin.top + margin.bottom))
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + 2 * margin.top + ")");
    var x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      var y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, function(d) { return +d.Confirmed; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("path")
     .datum(filteredData)
     .attr("fill", "none")
     .attr("stroke", "blue")
     .attr("stroke-width", 1.5)
     .attr("d", d3.line()
       .x(function(d) { return x(d.Date) })
       .y(function(d) { return y(d.Confirmed) })
     )

     svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Date) })
      .y(function(d) { return y(d.Recovered) })
    )

    svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
     .x(function(d) { return x(d.Date) })
     .y(function(d) { return y(d.Deaths) })
    )

    svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(Number(filteredData[filteredData.length -1].Confirmed)) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "blue")
      .text("Confirmed");

    svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(Number(filteredData[filteredData.length -1].Recovered)) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "green")
      .text("Recovered");

    svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(Number(filteredData[filteredData.length -1].Deaths)) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "red")
      .text("Deaths");

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("text-decoration", "underline")
      .text("Total Cases Aggregated Worldwide Over Time");

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", height + margin.bottom + 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Date");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", -65)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Number of Cases");

  })
}

var rankedCircle = function(e){
  var svg = d3.select("#rankedCircle")
  .append("svg")
    .attr("width", 400 + margin.left + margin.right)
    .attr("height", 1100 + margin.top + margin.bottom + 500)
  .append("g")
    .attr("transform", "translate(" + (300 / 2 + margin.left) + "," + (700 + margin.top) + ")");

  d3.csv("static/data/countries-aggregated.csv").then(function(data){
    data = data.splice(17945)
    data.splice(50)
    console.log(data)
    data.push({Country : "United States", Confirmed : 1360000})
    data = data.sort(function (a, b) {
      return parseInt(b.Confirmed) - parseInt(a.Confirmed)
    });
    //console.log(data)
    var x = d3.scaleBand()
     .range([0, 2 * Math.PI])
     .align(0)
     .domain(data.map(function(d) { return d.Country; }));
    var y = d3.scaleRadial()
     .range([innerRadius, outerRadius])
     .domain([0, 14000]);


    svg.append("g")
     .selectAll("path")
     .data(data)
     .enter()
     .append("path")
       .attr("fill", "#69b3a2")
       .attr("d", d3.arc()
           .innerRadius(innerRadius)
           .outerRadius(function(d) { return y(d['Confirmed']);})
           .startAngle(function(d) { return x(d.Country); })
           .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
           .padAngle(0.01)
           .padRadius(innerRadius))

   svg.append("g")
       .selectAll("g")
       .data(data)
       .enter()
       .append("g")
         .attr("text-anchor", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
         .attr("transform", function(d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(parseInt(d['Confirmed']))+10) + ",0)"; })
       .append("text")
         .text(function(d){return(d.Country)})
         .attr("transform", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
         .style("font-size", "11px")
       .attr("alignment-baseline", "middle")

    svg.append("text")
       .attr("x", 0)
       .attr("y", 0 - (1.30 * height))
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .style("text-decoration", "underline")
       .text("Bar Graph of 50 Coutries with the Least Amount of Cases");
  })
}

var mapWorld = function(e){
  Promise.all([
  d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
  d3.csv('static/data/countries-aggregated.csv')
  ]).then(
  d => ready(null, d[0], d[1], d)
  );
  // var promises = [
  // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  // d3.csv("static/data/countries-aggregated.csv").then(function(d) {
  //   //d = d.splice(17945)
  //   mapData.set(d.Country, +d.Confirmed);
  // })
  // ]
}

function ready(error, data, confirmed, something){
  confirmed = confirmed.splice(17945)
  var confirmedByCountry = {}
  confirmed.forEach(d => { confirmedByCountry[d.Country] = + d.Confirmed})
  data.features.forEach(d => {d.Confirmed = confirmedByCountry[d.Country]})

  console.log(confirmedByCountry)
  confirmedByCountry["United States"] = 1000000
  var projection = d3.geoRobinson()
    .scale(148)
    .rotate([352, 0, 0])
    .translate( [width / 2, height / 2]);
  var path = d3.geoPath().projection(projection);
  var color = d3.scaleThreshold()
    .domain([
      0, 1000, 10000, 100000, 1000000, 10000000
    ])
    .range(d3.schemeReds[5]);

  var svg = d3.select("#map")
    .append("svg")
      .attr("width", width + margin.left + margin.right )
      .attr("height", height + margin.top + margin.bottom )
    .append("g")
      .attr("transform",
            "translate(" + 68.035 + "," + 2 * margin.top + ")")
    .attr('class','map');

  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
      .attr('d', path)
      .style('fill', function(d){
        var value = confirmedByCountry[d.properties.name] || 0
      //  console.log(d.properties.name)
        if (d.properties.name.localeCompare("USA") == 0){
          value = 1240000
        }
        return color(value)})
      .style('stroke', 'white')
      .style('opacity', 0.8)
      .style('stroke-width', 0.3)
  svg.append('path')
    .datum(topojson.mesh(data.features, (a, b) => a.Confirmed !== b.Confirmed))
    .attr('class', 'names')
    .attr('d', path);

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("text-decoration", "underline")
    .text("World Map Scaled by the Amount of Confirmed Cases");
}


var percentGrowth = function(e){
  var filteredData = []
  var allDates = []
  d3.csv("static/data/worldwide-aggregated.csv").then(function(data){
  //console.log(data)
    for (var i = 0; i < data.length; i++){
      filteredData.push({Date : d3.timeParse("%Y-%m-%d")(data[i].Date),
                        Growth : data[i]["Increase rate"]})
      allDates.push(d3.timeParse("%Y-%m-%d")(data[i].Date))
    }
  filteredData = filteredData.splice(1)
  //console.log(filteredData)
    var svg = d3.select("#percentGrowth")
      .append("svg")
        .attr("width", width + margin.left + margin.right + 50)
        .attr("height", height + 2 * (margin.top + margin.bottom))
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + 2 * margin.top + ")");
    var x = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

     svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.Date) })
      .y(function(d) { return y(d.Growth) })
    )

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("text-decoration", "underline")
      .text("Percent Growth of Total Cases Worldwide (measured by Week) Over Time");

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", height + margin.bottom + 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Date");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", -65)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Percentage (%)");

  })
}
