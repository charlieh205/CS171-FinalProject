
class sec06_barchart {

    // constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }

    initVis() {

        let vis = this;

        vis.margin = {top: 40, right: 10, bottom: 40, left: 150};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .range([0, vis.height])
            .padding(0.1);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis")


        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
     * Data wrangling
     */
    wrangleData() {
        let vis = this;
        console.log("wrangledata", sec06_button_value);

        if (sec06_button_value == "base_rate") {
            vis.bardata = [vis.data[0]]
        }
        else if (sec06_button_value == "before_1900") {
            vis.bardata = vis.data.slice(0,2);
        }
        else if (sec06_button_value == "after_1900") {
            vis.bardata = vis.data;
        }
        else {
            vis.bardata = vis.data;
        };


        // Update the visualization
        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        console.log('update_vis', sec06_button_value, vis.bardata)

        // Update scales domains
        vis.x.domain([0, d3.max(vis.bardata, function(d) { return d.values;})]);
        vis.y.domain(vis.bardata.map( function(d) { return d.labels;}));

        // Data join
        vis.bars = vis.svg.selectAll("rect")
            .data(vis.bardata);

        vis.bars.enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d) { return vis.y(d.labels); })
            .attr("height", vis.y.bandwidth() )
            .attr("width", function(d) { return vis.x(d.values); })
            .attr("fill", "#69b3a2")
            .attr("class", "bar")
            .merge(vis.bars)
            .transition()
            .duration(2500)
            .attr("x", 0)
            .attr("y", function(d) { return vis.y(d.labels); })
            .attr("height", vis.y.bandwidth() )
            .attr("width", function(d) { return vis.x(d.values); })

        // Exit
        vis.bars.exit().remove();

        // Call axis functions with the new domain
        // TODO: add transition to axes
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}

