/*Feature Evaluation,[Feature/Result] Scatter Plots*/

//set dataset to be forestfire data
var dataset = JSON.parse(JSON.stringify(forestfire_data))

//convert labeled data into numerical data
var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
var days = ['mon','tue','wed','thu','fri','sat','sun'];

dataset.forEach(d=>d.day = days.indexOf(d.day))
dataset.forEach(d=>d.month = months.indexOf(d.month))

//(2**index).toString(2)
//dataset.forEach(d=>d.day = (2**days.indexOf(d.day)).toString(2)  )
//dataset.forEach(d=>d.month = (2**months.indexOf(d.month)).toString(2) )

//set of inputs and outputs for this dataset
var inputs = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
var outputs = ['area'];

//x-axis labels
var labels =
{
  'X':     'X COORD OF PARK MAP',
  'Y':     'Y COORD OF PARK MAP',
  'month': 'MONTH',
  'day':   'DAY',
  'FFMC':  'FINE FUEL MOISTURE CODE',
  'DMC':   'DUFF MOISTURE CODE',
  'DC':    'DROUGHT CODE',
  'ISI':   'INITIAL SPREAD INDEX',
  'temp':  'TEMPERATURE (C)',
  'RH':    'RELATIVE HUMIDITY',
  'wind':  'WIND SPEED (km/h)',
  'rain':  'RAIN (mm/m^2)',
  'area':  'BURNED AREA (ha)'
}

//xCat = inputs[11]
//yCat = 'area'


class ScatterPlot
{
  //Construct new instance of Scatter Plot
  constructor(html_id, x, y)
  {
    //Get X/Y min & max values
    this.maxX = d3.max(dataset, d => d[x] );
    this.minX = d3.min(dataset, d => d[x] );
    this.maxY = d3.max(dataset, d => d[y] );
    this.minY = d3.min(dataset, d => d[y] );

    // dimensions and margins
    this.svg = d3.select(html_id);
    this.width  = +this.svg.attr("width")  * 0.7;
    this.height = +this.svg.attr("height") * 0.7;
    this.margin = {
                    top:    (0.2*this.width), 
                    right:  (0.2*this.height), 
                    bottom: (0.2*this.height), 
                    left:   (0.25*this.width)
                  };

    // create a clipping region 
    this.svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width",  this.width)
      .attr("height", this.height);


    // create scale objects
    this.xScale = d3.scaleLinear()
      .domain([this.minX, this.maxX])
      .range([0, this.width]).nice();

    this.yScale = d3.scaleLinear()
      .domain([this.minY, this.maxY])
      .range([this.height, 0]).nice();

    // create axis objects
    switch(x)
    {
      case 'month':
          this.xAxis = d3.axisBottom(this.xScale)
          .ticks(10, "s")
          .tickSize(-this.width)
          .tickFormat( m => months[m] );
          break;
      case 'day':
          this.xAxis = d3.axisBottom(this.xScale)
          .ticks(10, "s")
          .tickSize(-this.width)
          .tickFormat( d => days[d] );
          break;
      default:
          this.xAxis = d3.axisBottom(this.xScale)
          .ticks(10, "s")
          .tickSize(-this.width)
    }//end switch

    this.yAxis = d3.axisLeft(this.yScale)
    .ticks(10, "s")
    .tickSize(-this.height);

    // Draw Axis
    this.gX = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top + this.height) + ')')
      .call(this.xAxis);

    this.gY = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .call(this.yAxis);

    // Draw Datapoints
    this.points_g = this.svg.append("g")
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr("clip-path", "url(#clip)")
      .classed("points_g", true);

    this.data = this.getFeatureData (x, y);
    this.points = this.points_g.selectAll("circle").data(this.data);
    this.points = this.points.enter().append("circle")
          .attr('cx', function(d) {return this.xScale(d.x)}.bind(this) )
          .attr('cy', function(d) {return this.yScale(d.y)}.bind(this) )
          .attr('r', 5)
          .style("fill", function(d) { return 'rgba(255,0,0,0.3)'; });
        
    // Pan and zoom
    this.zoom = d3.zoom()
        .scaleExtent([.5, 1000])
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", this.zoomed());

    this.svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('class','axisLine')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        .call(this.zoom); 

    //Setup Axis objects withs CSS classnames
    this.gY.attr('class', 'axis')
    this.gX.attr('class', 'axis xaxis')

    // now rotate text on x axis
    // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
    // first move the text left so no longer centered on the tick
    // then rotate up to get 45 degrees.
    this.svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
      .attr("transform", function(d) {
         return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
     });

    // now add titles to the axes
    this.svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (12 + this.width*0.025) +","+(this.height*1.2)/2+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text(labels[y])
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("fill", "gray")
        .attr("font-size",12);

    this.svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (this.width*1.5)/2 +","+(this.height*1.4 - this.height*0.025) +")")  // centre below axis
        .text(labels[x])
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("fill", "gray")
        .attr("font-size",12);


    //Set initial zoom
    //svg.call(zoom.transform, d3.zoomIdentity.translate(10, 0).scale(0.98))
    this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(10, 10).scale(0.9))

  }//end constructor

  getFeatureData (feature, result){
    let data = [];
    let datapoint = {};
    for (let row of dataset){
      datapoint = {};
      datapoint["x"] = row[feature];
      datapoint["y"] = row[result];
      data.push(datapoint);
    }
    return data
  }//end getFeatureData

  zoomed() {
    return function(){
      //console.log(this);
      // create new scale ojects based on event\
        let new_xScale = d3.event.transform.rescaleX(this.xScale);
        let new_yScale = d3.event.transform.rescaleY(this.yScale);
      // update axes
        this.gX.call(this.xAxis.scale(new_xScale));
        this.gY.call(this.yAxis.scale(new_yScale));
        this.points.data(this.data)
         .attr('cx', function(d) {return new_xScale(d.x)})
         .attr('cy', function(d) {return new_yScale(d.y)});
      // rotate new axis tick labeing by 45 degrees
        this.svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
              .attr("transform", function(d) {
                 return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
             });
    }.bind(this);
    
  };//end zoomed

}


/* Function-based implementation */
/*
function make_scatter_plot(html_id, xCat, yCat)
{

  //Get X/Y min & max values
  let maxX = d3.max(dataset, d => d[xCat] );
  let minX = d3.min(dataset, d => d[xCat] );
  let maxY = d3.max(dataset, d => d[yCat] );
  let minY = d3.min(dataset, d => d[yCat] );

  // dimensions and margins
  let svg = d3.select(html_id);
  let width = +svg.attr("width");
  let height = +svg.attr("height");
  width = 0.7*width;
  height = 0.7*height;
  let margin = {top: (0.2*width), right: (0.2*height), bottom: (0.2*height), left: (0.25*width)};

  // create a clipping region 
  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);
   
  // create scale objects
  var xScale = d3.scaleLinear()
    .domain([minX, maxX])
    .range([0, width]).nice();

  var yScale = d3.scaleLinear()
    .domain([minY, maxY])
    .range([height, 0]).nice();

  // create axis objects
  switch(xCat)
  {
    case 'month':
        var xAxis = d3.axisBottom(xScale)
        .ticks(10, "s")
        .tickSize(-width)
        .tickFormat( m => months[m] );
        break;
    case 'day':
        var xAxis = d3.axisBottom(xScale)
        .ticks(10, "s")
        .tickSize(-width)
        .tickFormat( d => days[d] );
        break;
    default:
        var xAxis = d3.axisBottom(xScale)
        .ticks(10, "s")
        .tickSize(-width)
  }

  let yAxis = d3.axisLeft(yScale)
    .ticks(10, "s")
    .tickSize(-height);

  // Draw Axis
  let gX = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')')
    .call(xAxis);

  let gY = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(yAxis);

  // Draw Datapoints
  let points_g = svg.append("g")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr("clip-path", "url(#clip)")
    .classed("points_g", true);

  let data = getFeatureData (xCat, yCat);
  let points = points_g.selectAll("circle").data(data);
  points = points.enter().append("circle")
        .attr('cx', function(d) {return xScale(d.x)})
        .attr('cy', function(d) {return yScale(d.y)})
        .attr('r', 5)
        .style("fill", function(d) { return 'rgba(255,0,0,0.3)'; });
      
  // Pan and zoom
  let zoom = d3.zoom()
      .scaleExtent([.5, 1000])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('class','axisLine')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom); 

  //Setup Axis objects withs CSS classnames
  gY.attr('class', 'axis')
  gX.attr('class', 'axis xaxis')

  // now rotate text on x axis
  // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
  // first move the text left so no longer centered on the tick
  // then rotate up to get 45 degrees.
  svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
    .attr("transform", function(d) {
       return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
   });

  // now add titles to the axes
  svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (12 + width*0.025) +","+(height*1.2)/2+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
      .text(labels[yCat])
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("fill", "gray")
      .attr("font-size",12);

  svg.append("text")
      .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "translate("+ (width*1.5)/2 +","+(height*1.4 - height*0.025) +")")  // centre below axis
      .text(labels[xCat])
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("fill", "gray")
      .attr("font-size",12);


  //Set initial zoom
  //svg.call(zoom.transform, d3.zoomIdentity.translate(10, 0).scale(0.98))
  svg.call(zoom.transform, d3.zoomIdentity.translate(10, 10).scale(0.9))

}

function getFeatureData (feature, result){
  var data = [];
  var datapoint = {};
  for (let row of dataset){
    datapoint = {};
    datapoint["x"] = row[feature];
    datapoint["y"] = row[result];
    data.push(datapoint);
  }
  return data
}

function zoomed() {
  // create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
  // update axes
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));
    points.data(data)
     .attr('cx', function(d) {return new_xScale(d.x)})
     .attr('cy', function(d) {return new_yScale(d.y)});
  // rotate new axis tick labeing by 45 degrees
    svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
         });
    
}

*/

//make_scatter_plot('#X-Area', 'X', 'area');
new ScatterPlot('#X-Area', 'X', 'area')
new ScatterPlot('#Y-Area', 'Y', 'area')
new ScatterPlot('#Month-Area', 'month', 'area')
new ScatterPlot('#Day-Area', 'day', 'area')
new ScatterPlot('#FFMC-Area', 'FFMC', 'area')
new ScatterPlot('#DMC-Area', 'DMC', 'area')
new ScatterPlot('#DC-Area', 'DC', 'area')
new ScatterPlot('#ISI-Area', 'ISI', 'area')
new ScatterPlot('#Temp-Area', 'temp', 'area')
new ScatterPlot('#RH-Area', 'RH', 'area')
new ScatterPlot('#Wind-Area', 'wind', 'area')
new ScatterPlot('#Rain-Area', 'rain', 'area')







