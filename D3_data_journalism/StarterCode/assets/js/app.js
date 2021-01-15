// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Parameters
// =================================
var chosenXAxis = "smokes";
var chosenYAxis = "age";




// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}


// function used for updating Circle Text group with a transition to
// new circles
function renderXCircleText(textCircles, newXScale, chosenXAxis) {

    textCircles.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return textCircles;
}

function renderYCircleText(textCircles, newYScale, chosenYAxis) {

    textCircles.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textCircles;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;

    if (chosenXAxis === "smokes") {
        xlabel = "Smokers:"
    }
    else if (chosenXAxis === "healthcare") {
        xlabel = "No Healthcare:"
    }
    else {
        xlabel = "Obese:";
    }


    if (chosenYAxis === "age") {
        ylabel = "Age:"
    }
    else if (chosenYAxis === "income") {
        ylabel = "Income:"
    }
    else {
        ylabel = "Poverty:"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([50, -80])
        .html(function (d) {
            return (`${d.state}
              <br>${xlabel} ${d[chosenXAxis]}
              <br>${ylabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data,this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

(async function () {
    var censusData = await d3.csv("assets/data/data.csv").catch(err => console.log(err))



    // parse data
    censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.id = +data.id;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
});
    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = xScale(censusData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 11)
        .attr("fill", 'blue')
        .attr("opacity", ".5");

    var textCircles = chartGroup.selectAll("mytext")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]-.2))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .style("fill", "white")
        .attr("font-weight", "bold");

    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 30})`);

    var smokeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")
        .classed("active", true)
        .text("Smokers (%)");

    var healthLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    var obesityLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obesity (%)");

    // Create group for three x-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var ageLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("value", "age")
        .classed("active", true)
        .text("Age (Median)");

    var incomeLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (height / 2))
        .attr("value", "income")
        .classed("inactive", true)
        .text("Houshold Income (Median)");

    var povertyLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - (height / 2))
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("Poverty (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var xValue = d3.select(this).attr("value");
            if (xValue !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = xValue;

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles and circle text with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                textCircles = renderXCircleText(textCircles, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                    .   classed("inactive", true);
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "healthcare") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
            }
        }
    });


// y axis labels event listener
yLabelsGroup.selectAll("text")
    .on("click", function () {
        // get value of selection
        var yValue = d3.select(this).attr("value");
        if (yValue !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = yValue;

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles and circle text with new y values
            circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
            textCircles = renderYCircleText(textCircles, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "income") {
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "poverty") {
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            else {
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    });
})()
