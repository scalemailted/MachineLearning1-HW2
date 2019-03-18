


//TODO: Dispose of this!



/*Bar Chart*/


// Define some sample data
/*
var bartest =function() 
{


            //Width and height
            var w = 500;
            var h = 100;
            var barPadding = 1;
            
            var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                            11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
            
            //Create SVG element
            svg = d3.select('#mae-plot-container')
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

            svg.selectAll("rect")
               .data(dataset)
               .enter()
               .append("rect")
               .attr("x", function(d, i) { return i * (w / dataset.length); })
               .attr("y", function(d) { return h - (d * 4); })
               .attr("width", w / dataset.length - barPadding)
               .attr("height", function(d) { return d * 4; })
               .attr("fill", function(d) {
                    return "rgb(0, 0, " + (d * 10) + ")";
               });

            svg.selectAll("text")
               .data(dataset)
               .enter()
               .append("text")
               .text(function(d) {
                    return d;
               })
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) {
                    return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
               })
               .attr("y", function(d) {
                    return h - (d * 4) + 14;
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "white");


            
        
}
          
bartest();
*/

/*Bar Chart*/





/*Bar Graph*/
class BarChart
{
  //Construct new instance of Scatter Plot
  constructor(html_id, dataset)
  {
    /*
    let div = document.getElementById(html_id);
    div.innerHTML += 
      `<div id=${"update-"+html_id}>
          <input name="updateButton" 
           type="button" 
           value="log" 
           onclick="updateData()" />
      </div>`*/

    this.dataset = dataset;
    //this.dataset.forEach(d => d.y = Math.log(d.y))
    ///this.dataset.forEach(d => d.y = Math.exp(d.y))
    this.xlabel = 'model order';
    this.ylabel = 'error'
    //this.active = d3.select(null);

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
      .attr("class", 'clipframe')
      .attr("width",  this.width)
      .attr("height", this.height)

    // create scale objects
    this.xScale = d3.scaleBand()
        //.domain([this.minX, +this.maxX+1])
        .domain( (dataset.map(d=>d.x)).sort() )
        .range([0, this.width])
        .padding(0.1);

    this.yScale = d3.scaleLinear()
      .domain([this.minY, this.maxY*1.05])
      .range([this.height, 0])//.nice();

    // create axis objects
    this.xAxis = d3.axisBottom(this.xScale)
    //.ticks(10, "s")
    .tickSize(-this.width)
    .tickFormat( (d) => (d % 1) ? null : d )
    //.tickValues(d3.range(this.xScale.domain()[0], this.xScale.domain()[1] + 1, 1));

    this.yAxis = d3.axisLeft(this.yScale)
    //.ticks(10, "s")
    .tickSize(-this.height);

    // Draw Axis
    this.gX = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top + this.height) + ')')
      .call(this.xAxis);

    this.gY = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('class','yAxis')
      .call(this.yAxis);

    // Draw Datapoints
    this.points_g = this.svg.append("g")
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr("clip-path", "url(#clip"+html_id+")")
      .classed("points_g", true);

    this.data = this.getFeatureData (this.dataset, x, y);


    this.points = this.points_g.selectAll("circle").data(this.data);
    this.points = this.points.enter().append("circle")
          .attr('cx', function(d) {return this.xScale(d.x) + this.xScale.bandwidth()/2 }.bind(this) )
          .attr('cy', function(d) {return this.yScale(d.y)}.bind(this) )
          .attr('r', 5)
          .style("fill", function(d) { return 'rgba(255,0,0)'; })
      




    

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
      .x(function(d) {return this.xScale(d.x) + this.xScale.bandwidth()/2 }.bind(this) ) 
      .y(function(d) {return this.yScale(d.y)}.bind(this))
      .curve(d3.curveLinear);  

      // Add the valueline path.

      this.line = this.points_g.append("path")
      .datum(this.data)
      .attr("class", "line")
      .attr("d", this.plotline)
      .attr("stroke", "rgba(255,0,0,1)")
      .attr("stroke-width", 2)
      .attr("fill", "none");


    /*this.svg.selectAll("rect")
    .data(this.points)
    .enter().append("rect")*/

    // append the rectangles for the bar chart
    
    this.rects = this.points_g.selectAll("rect")
     .data(this.data)
      .enter()
      .append("rect")
      //.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return this.xScale(d.x)}.bind(this) )
      .attr("width", this.xScale.bandwidth() )
      .attr("y", function(d) { return this.yScale(d.y)}.bind(this) )
      .attr("height", function(d) { return this.height - this.yScale(d.y); }.bind(this) )
      .attr('style','opacity:'+0.3)
      .attr('fill', 'rgb(255,0,0)')
      
  
    for (let rect of this.rects._groups[0]){
      let search = rect.getAttribute('x')
      let count = this.rects._groups[0].filter((val) => val.getAttribute('x') === search).length
      rect.setAttribute('style', `opacity:${0.3 * 1/count}`)
    }

    
    
    
      /*
      this.rects
      .on("mouseover", function(d,i){ this.zoomTo(d,i)}.bind(this) )
      .on("mouseout",function(){
        //code for transition
        console.log('out')
      })*/


      /*this.svg
      .on("mouseover",function(){
        //code for transition
        console.log('in')
      })
      .on("mouseout",function(){
        //code for transition
        console.log('out')
      })*/

    /*this.rects = this.points_g.append("rect")
      .data(this.data)
      //.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return this.xScale(d.x)}.bind(this) )
      .attr("width", this.xScale.bandwidth() )
      .attr("y", function(d) { return this.yScale(d.y)}.bind(this) )
      .attr("height", function(d) { return this.height - this.yScale(d.y); }.bind(this) )
      .attr('fill', 'rgba(0,0,255,0.3)');
    console.log(this.rects)
    */

    /*
    this.active_link = "0"; //to control legend selections and hover
    this.legendClicked; //to control legend selections
    this.legendClassArray = []; //store legend classes to select bars in plotSingle()
    this.colors = ['rgb(255,0,0)', 'rgb(0,0,255)'];

    this.legend = this.svg.selectAll(".legend")
      .data(this.colors)
    .enter().append("g")
      //.attr("class", "legend")
      .attr("class", function (d) {
        this.legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
        return "legend";
      }.bind(this))
      .attr("transform", function(d, i) { return "translate(" + i * -50 + ",0)"; });

      this.legend.append("rect")
          .attr("x", this.width - 10)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", this.colors.pop())//function(d,i){this.colors[i]; console.log(this.colors[i]) }.bind(this) )
          .attr("id", function (d, i) { return "id" + d.replace(/\s/g, ''); })
    */


      // add the blue line legend
      this.svg.append("text")
         //.attr("x", 0)             
         //.attr("y", this.height + this.margin.top + 35)  
         .attr("x", 50)
         .attr("y", this.height + this.margin.top + 55)   
         .attr("class", "legend")
         .style("fill", "steelblue")   
         .on("click", function(){
            /*
             // determine if current line is visible
             var active   = this.blueLine.active ? false : true,
             newOpacity = active ? 0 : 1;
             // hide or show the elements
             d3.select("#blueLine").style("opacity", newOpacity);
             // update whether or not the elements are active
             this.blueLine.active = active;
            */
            let log_dataset = JSON.parse(JSON.stringify(this.dataset));
            log_dataset.forEach(d => d.y = Math.log(d.y))
            this.updateData(log_dataset,'rgb(0,0,255)')
            console.log('log it');
         }.bind(this))
         .text("log(error)");

      // add the red line legend
      this.svg.append("text")
         //.attr("x", 0)             
         //.attr("y", this.height + this.margin.top + 55)
         .attr("x",0)  
         .attr("y", this.height + this.margin.top + 55)  
         .attr("class", "legend")
         .style("fill", "red")        
         .on("click", function(){
            /*
             // determine if current line is visible
             var active   = this.redLine.active ? false : true,
             newOpacity = active ? 0 : 1;
             // hide or show the elements
             d3.select("#redLine").style("opacity", newOpacity);
             // update whether or not the elements are active
             this.redLine.active = active;
             */
      
             this.updateData(this.dataset,'rgb(255,0,0)')
             console.log('unlog it')
         }.bind(this))
         .text("error");

    



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
    this.gY.attr('class', 'axis yaxis')
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

  getFeatureData (dataset, feature, result){
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
        //this.points_g
          this.points_g.selectAll("rect")
          .data(this.data)
          .attr("y", function(d) { return new_yScale(d.y)}.bind(this) )
          .attr("height", function(d) { return Math.abs(this.height - new_yScale(d.y))  }.bind(this) )
          //.attr("transform", d3.event.transform)
     
    }.bind(this);
    
  };//end zoomed

  /*zoomTo = function(d,i){
        console.log(d)
        console.log(i)
        console.log(this)
        //console.log(Object.keys( this.zoom))
        //this.zoom.translateTo(this.svg,-d.x,-d.y)
        //this.zoom.scaleTo([0,d.y*1.05])
        //if (this.active.node() === this) return this.reset();
        //this.active.classed("active", false);
        console.log(this.maxX)
        console.log(this.rects[i])
        this.active = d;// d3.select( this.rects[i]).classed("active", true);

        let dx = d.x,
            dy = d.y,
            x = d.x,
            y = d.y * 1.05,
            scale = dy/this.maxY,// Math.max(1, Math.min(8, 0.9 / Math.max(dx / this.width, dy / this.height))),
            //scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / this.width, dy / this.height))),
            //translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];
            translate = [dx, dy ];

        console.log('scale:' + scale)
        console.log('dy:' + dy);
        console.log('max Y:' + this.maxY)
        console.log(Math.abs(dy - this.maxY));

        this.svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            //.call( this.zoom.transform, d3.zoomIdentity.translate(dx,translate[1]).scale(scale) ); // updated for d3 v4
            .call( this.zoom.transform, d3.zoomIdentity.scale(scale) );

       

  }*/

  /*zoomTo2 = function(location, scale) {
    var point = projection(location);
    zoom.scale(scale);
    zoom.translate([-point[0] * scale, -point[1] * scale]);
    return zoom;
  }*/

  // ** Update data section (Called from the onclick)
  updateData(dataset, color) {

    console.log(dataset)
     //Get X/Y min & max values
    this.maxY = d3.max(dataset, d => d['y'] );
    console.log(this.maxY)

    // Scale the range of the data again 
    this.yScale = d3.scaleLinear()
      .domain([this.minY, this.maxY*1.05])
      .range([this.height, 0])//.nice();

    // Make the changes
    /*this.svg.selectAll(".line")   // change the line
        .duration(750)
        .attr("d", line(this.data));*/
    this.data = this.getFeatureData (dataset, 'x', 'y');
    this.points_g.selectAll("circle")
          .data(this.data)
          .transition()
          .duration(750)
          .attr('cy', function(d) {return this.yScale(d.y)}.bind(this) )
          .style("fill", function(d) { return color; })

    this.plotline
        .y(function(d) {return this.yScale(d.y)}.bind(this))

    this.line
        .datum(this.data)
        .transition()
        .duration(750)
        .attr("d", this.plotline)
        .attr("stroke", color)

   this.rects
     .data(this.data)
     .transition()
      .duration(750)
      .attr("y", function(d) { return this.yScale(d.y)}.bind(this) )
      .attr("height", function(d) { return this.height - this.yScale(d.y); }.bind(this) )
      .attr('fill', color);      
  
    for (let rect of this.rects._groups[0]){
      let search = rect.getAttribute('x')
      let count = this.rects._groups[0].filter((val) => val.getAttribute('x') === search).length
      rect.setAttribute('style', 'opacity: '+ 0.3 * 1/count)
      //rect.setAttribute('fill', `rgba(0,0,255,${0.3 * 1/count})`)
    }
          

    
    this.svg.select(".yAxis") // change the y axis
        .transition()
        .duration(750)
        .call(this.yAxis);

    this.gY
      .transition()
      .delay(100)
      .duration(650)
      .call(this.yAxis.scale(this.yScale));

  }


}



/*TEST*/



/*END TEST*/








/*
Site Visitors:
Mahdi Abdelguerfi
Zibran Minhaz



undergraduate certificate programs:
-> comparable: 3000/4000-level material, 
-> 6 classes and you get a certificate
-> 18 credit hours (Software Engineering)
     [3] CSI1583: Software Dev I, 
     [3] CSCI2121: Software Dev II, 
     [3] CSCI2125: Data Structures, 
     [3] CSCI4210: Software Engineering,
     [3] CSCI: Web Frameworks  
     [3] CSCI: Mobile Development

-> 18 credit hours (Cyber Security)
     [3] CSI1583: Software Dev I, 
     [3] CSCI2121: Software Dev II, 
     [3] CSCI2125: Systems Programming, 
     [3] CSCI : Intro Cyber Security
     [3] CSCI:  
     [3] CSCI: 

-> 18 credit hours (Dev Ops)
     [3] CSI1583: Software Dev I, 
     [3] CSCI2121: Software Dev II, 
     [3] CSCI2125: Systems programming, 
     [3] CSCI4210: OS,
     [3] CSCI: Comptuer Networking  
     [3] CSCI: 



AWS Training update with Vassil
Tina Chang Cell: 206-852-3637
*/

//This bar chart uses D3’s zoom behavior on the *x*-axis. 
//Double-click on the bar chart below or use the mouse wheel (or pinch) to zoom. 
//This example is contrived—you don’t need zooming if you can easily display all the bars at once.`



/*
const setupSVG = function(width, height, xAxis, yAxis){
  const svg = d3.select(DOM.svg(width, height))
      .call(zoom);
  
  svg.append("g")
      .attr("class", "bars")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth());
  
  svg.append("g")
      .attr("class", "x-axis")
      .call(xAxis);
  
  svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);
  
  return svg.node();
}

const zoom = {
    name: "zoom",
    inputs: ["margin","width","height","d3","x","xAxis"],
    value: (function(margin,width,height,d3,x,xAxis){ return(
      function zoom(svg) {
        const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];
      
        svg.call(d3.zoom()
          .scaleExtent([1, 8])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", zoomed));
      
        function zoomed() {
          x.range([margin.left, width - margin.right].map(d => d3.event.transform.applyX(d)));
          svg.selectAll(".bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
          svg.selectAll(".x-axis").call(xAxis);
        }
      })})
}

  
    {  
      value: (async function(d3){return(
        (await d3.csv("https://gist.githubusercontent.com/mbostock/81aa27912ad9b1ed577016797a780b2c/raw/3a807eb0cbb0f5904053ac2f9edf765e2f87a2f5/alphabet.csv", ({letter, frequency}) => ({name: letter, value: +frequency}))).sort((a, b) => b.value - a.value)
      )})
    },

    {
      name: "x",
      inputs: ["d3","data","margin","width"],
      value: (function(d3,data,margin,width){return(
        d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1)
        )})
    },
    {
      name: "y",
      inputs: ["d3","data","height","margin"],
      value: (function(d3,data,height,margin){return(
        d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top])
        )})
    },
    {
      name: "xAxis",
      inputs: ["height","margin","d3","x"],
      value: (function(height,margin,d3,x){return(
        g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
        )})
    },
    {
      name: "yAxis",
      inputs: ["margin","d3","y"],
      value: (function(margin,d3,y){return(
        g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
)})
    },
    {
      name: "height",
      value: (function(){return(
        500
        )})
    },
    {
      name: "margin",
      value: (function(){return(
        {top: 20, right: 0, bottom: 30, left: 40}
        )})
    },
  ]
};

*/

