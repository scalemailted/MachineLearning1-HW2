/*Model Evaluation,[Model/Error] line plots*/

//var error_plots_list = [];

class MultiScatterPlot
{
  //Construct new instance of Scatter Plot
  constructor(html_id, dataset)
  {
    this.dataset = dataset;
    this.xlabel = 'model order';
    this.ylabel = 'error'

    //let x = dataset.map( data => data['x'] );
    //let y = dataset.map( data => data['y'] );
    let x = 'x';
    let y = 'y';

    //Get X/Y min & max values
    this.maxX = d3.max(this.dataset, d => d[x] );
    this.minX = 0//d3.min(dataset, d => d[x] );
    this.maxY = d3.max(this.dataset, d => d[y] );
    this.minY = 0//d3.min(dataset, d => d[y] );

    // dimensions and margins
    this.svg = d3.select(html_id);
    this.width  = +this.svg.attr("width")  * 0.7;
    this.height = +this.svg.attr("height") * 0.7;
    this.margin = {
                    top:    (0.2*this.height), 
                    right:  (0.2*this.width), 
                    bottom: (0.2*this.height), 
                    left:   (0.25*this.width)
                  };

    // create a clipping region 
    
    this.svg.append("defs").append("clipPath")
      .attr("id", "clip"+html_id)
      .append("rect")
      .attr("width",  this.width)
      .attr("height", this.height);

    // create scale objects
    
    this.xScale = d3.scaleLinear()
      .domain([this.minX, +this.maxX+1])
      .range([0, this.width]) //.nice();

    this.yScale = d3.scaleLinear()
      .domain([this.minY, this.maxY*1.05])
      .range([this.height, 0])//.nice();

    // create axis objects
    this.xAxis = d3.axisBottom(this.xScale)
    //.ticks(10, "s")
    .tickSize(-this.width)
    .tickFormat( (d) => (d % 1) ? null : d )
    .tickValues(d3.range(this.xScale.domain()[0], this.xScale.domain()[1] + 1, 1));

    this.yAxis = d3.axisLeft(this.yScale)
    //.ticks(10, "s")
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
      .attr("clip-path", "url(#clip"+html_id+")")
      .classed("points_g", true);

    this.data = this.getFeatureData (x, y);
    this.points = this.points_g.selectAll("circle").data(this.data);
    this.points = this.points.enter().append("circle")
          .attr('cx', function(d) {return this.xScale(d.x)}.bind(this) )
          .attr('cy', function(d) {return this.yScale(d.y)}.bind(this) )
          .attr('r', 5)
          .style("fill", function(d) { return 'rgba(255,0,0)'; });

    //draw line
    /*
    this.line = this.svg.append("line")             // attach a line
      .style("stroke", "rgb(255,0,0)")       // colour the line
      .attr("stroke-width", 2)           // colour the line
      .attr("x1", this.data[0].x)     // x position of the first end of the line
      .attr("y1", this.data[0].y)      // y position of the first end of the line
      .attr("x2", this.data[1].x)     // x position of the second end of the line
      .attr("y2", this.data[1].y);    // y position of the second end of the line
      console.log(this.line)*/

    this.plotline = d3.line()
      .x(function(d) {return this.xScale(d.x)}.bind(this) ) 
      .y(function(d) {return this.yScale(d.y)}.bind(this))
      .curve(d3.curveLinear);  

      // Add the valueline path.

      this.line = this.points_g.append("path")
      .datum(this.data)
      .attr("class", "line")
      .attr("d", this.plotline)
      .attr("stroke", "rgba(255,0,0,0.3)")
      .attr("stroke-width", 2)
      .attr("fill", "none");


    //this.svg.append("svg:path").attr("d", this.line(this.data));
    //end test

        
    // Pan and zoom
    this.zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [this.width, this.height]])
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
    //this.svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
    //  .attr("transform", function(d) {
    //     return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
    // });

    // now add titles to the axes
    this.svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (12 + this.width*0.025) +","+(this.height*1.2)/2+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text(this.ylabel)
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("fill", "gray")
        .attr("font-size",12);

    this.svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (this.width*1.5)/2 +","+(this.height*1.4 - this.height*0.025) +")")  // centre below axis
        .text(this.xlabel)
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("fill", "gray")
        .attr("font-size",12);


    //Set initial zoom
    //svg.call(zoom.transform, d3.zoomIdentity.translate(10, 0).scale(0.98))
    //this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(10, 10).scale(0.9))

  }//end constructor

  getFeatureData (feature, result){
    let data = [];
    let datapoint = {};
    for (let row of this.dataset){
      datapoint = {};
      datapoint["x"] = row[feature];
      datapoint["y"] = row[result];
      data.push(datapoint);
    }
    return data
  }//end getFeatureData

  zoomed() {
    return function(){

      // create new scale ojects based on event\
        let new_yScale = d3.event.transform.rescaleY(this.yScale);
      // update axes
        this.gY.call(this.yAxis.scale(new_yScale));
        this.points.data(this.data)
         .attr('cy', function(d) {return new_yScale(d.y)});
        this.plotline.y( function(d) {return new_yScale(d.y)} );
        this.line
          .datum(this.data)
          .attr("d", this.plotline)
    }.bind(this);
    
  };//end zoomed

}

/*
let mae_data = [{x:0, y:0},{x:1, y:19.63},{x:2, y:21.89}]
let rmse_data = [{x:0, y:0},{x:1, y:47.25},{x:2, y:55.59}]

new MultiScatterPlot('#model-mae', mae_data);
new MultiScatterPlot('#model-rmse', rmse_data);
*/


/*
const plot_errors = function(model_errors){

    let mae_data = []
    let rmse_data = []
    for (let m of model_errors){
        mae_data.push(  {'x':m.order, 'y':m.mae}  );
        rmse_data.push( {'x':m.order, 'y':m.rmse} );
    }
    //mae_data.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
    //rmse_data.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
    //sort_by_key(mae_data, 'x')
    //sort_by_key(rmse_data, 'x')
    sort_by_keys(mae_data, 'x', 'y')
    sort_by_keys(rmse_data, 'x', 'y')
    clear_plots();
    new MultiScatterPlot('#model-mae', mae_data);
    new MultiScatterPlot('#model-rmse', rmse_data);
}*/

const clear_plots = function(){
    let mae_plot = document.getElementById('mae-plot-container');
    let rmse_plot = document.getElementById('rmse-plot-container');
    mae_plot.innerHTML = '';
    rmse_plot.innerHTML = '';
}

/*
const sort_by_key = function(array, key){
    array.sort((a,b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
}
*/

/*
const sort_by_key = function(array, key){
    array.sort((a,b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
}*/

const sort_by_keys = function(array, key1, key2){
    array.sort( (a,b) => complex_compare(a,b,key1, key2)  );
}


const complex_compare = function(a,b,key1,key2){
    if (a[key1] > b[key1]) return  1;
    if (a[key1] < b[key1]) return -1;
    if (a[key2] > b[key2]) return  1;
    if (a[key2] < b[key2]) return -1;
    return 0;  
}



const plot_errors = function(error_plots_list){
    for(let key of Object.keys(error_plots_list) ){ 
        let mae_data = []
        let rmse_data = []
        //console.log(key)
        //console.log(error_plots_list[key] )
        for (let m of error_plots_list[key]){
            mae_data.push(  {'x':m.order, 'y':m.mae}  );
            rmse_data.push( {'x':m.order, 'y':m.rmse} );
        }
        //mae_data.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
        //rmse_data.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
        //sort_by_key(mae_data, 'x')
        //sort_by_key(rmse_data, 'x')
        sort_by_keys(mae_data, 'x', 'y')
        sort_by_keys(rmse_data, 'x', 'y')
        
        //console.log(mae_data);
        //new MultiScatterPlot('#model-mae'+key, mae_data);
        //new MultiScatterPlot('#model-rmse'+key, rmse_data);
        new BarChart('#model-mae'+key, mae_data);
        new BarChart('#model-rmse'+key, rmse_data);
        console.log('#model-mae'+key);
    }
}


const update_error_plots = function(model_errors){
    let error_plots_dict = {};
    clear_plots();
    for ( let model of model_errors){
        let key = model.features;
        key = replaceAll(key.toString(),',','-')
        if (!(key in error_plots_dict)){
            error_plots_dict[key] = [];
            let mae_div = document.getElementById('mae-plot-container');
            mae_div.innerHTML += `<svg id=${'model-mae'+key} width="500" height="500"></svg>`
            let rmse_div= document.getElementById('rmse-plot-container');
            rmse_div.innerHTML += `<svg id=${'model-rmse'+key} width="500" height="500"></svg>`
        }
        error_plots_dict[key].push(model);
    }
    plot_errors(error_plots_dict);
}

function replaceAll(str, find, replace) {
     return str.replace(new RegExp(find, 'g'), replace);
}






