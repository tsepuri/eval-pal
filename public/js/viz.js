$(document).ready(function() {
    new WOW().init();
    });
    let data = document.currentScript.getAttribute('data');
    let request = new XMLHttpRequest();
    let userInput = data;
   
    request.open('GET', userInput, true); ;
    
        request.onload = function(){
            let i = 0;
            let colOne;
            let colTwo;
            data = JSON.parse(this.response);
            let jsonData = data;
            let teachingLine = document.querySelector('.teachingLine');
            let userDisplay ="";
            let ratingType="";
            let activeRatings="", compData=[];
            if(userInput.includes("professor")||userInput.includes("instructor_name")){
                sentence(jsonData);
                 userDisplay = "Results for "+data[0].instructor_name;
                 let circle = document.querySelector('.circle-with-text');
                fillCircle(jsonData, circle, "Your overall rating of the instructor");
                circle.style.display = 'flex';
                document.querySelector('.circle-2').style.display= 'flex';
                fillCircle(jsonData, document.querySelector('#courseRating'), document.querySelector('#courseRating').getAttribute("value"));
                fillCircle(jsonData, document.querySelector('#fairGrading'), document.querySelector('#fairGrading').getAttribute("value"));
                activeRatings = ["Your overall rating of the instructor", "Your overall rating of the course", "Grading is done fairly"];
                if(userInput.includes("subject")){
                    userDisplay = userDisplay + " teaching "+data[0].subject;
                    if(userInput.includes("catalog_nbr")){
                        userDisplay = userDisplay +data[0].catalog_nbr;
                        compData = compareWithCourse(data[0].subject+data[0].catalog_nbr, activeRatings, jsonData);
                    }
                    document.querySelector('.circle-2').innerHTML = `View full page of ${data[0].instructor_name}`
                    document.querySelector('#view_more').setAttribute("href", "../professor/"+hyphenate(data[0].instructor_name));
                    let professorButton = document.querySelector('.professor');
                     professorButton.innerHTML = 'Browse results for '+data[0].instructor_name;
                    professorButton.setAttribute("href", "../professor/"+hyphenate(data[0].instructor_name));
                    professorButton.setAttribute("display", null);
                    
                }
                else{
                    document.querySelector('.circle-2').innerHTML = `View subject-wise comparisons for ${data[0].instructor_name}`;
                    document.querySelector('.circle-2-button').setAttribute("id", "under-construction");
                }
                if(!(userInput.includes("catalog_nbr"))){
                    compData = compareWithCourse(data[0].subject, activeRatings, jsonData);
                }
                ratingType = hyphenate("Your overall rating of the instructor");
                //compGraph(compData, 2010);
            }
            else{
                
                let circle = document.querySelector('.circle-with-text');
                circle.style.display = 'flex';
                let avg = average(jsonData, "Your_overall_rating_of_the_course");
                 circle.innerHTML = `<span class="rating-number">${Math.round(avg[0]*100) / 100} <br /> <small style="font-size:30%;">Overall Rating of the Course<br/><small style="font-size:50%">Based on ${avg[1]} responses</small></small>`;
                 document.querySelector('.button-rating').value = "Your overall rating of the course"
                 ratingType = hyphenate("Your overall rating of the course");
                d3.select('.title')
                .text("Your overall rating of the course");
                let select = document.querySelector('#opts');
                select.value = "Your overall rating of the course";
                userDisplay = "Results for "+data[0].subject;
                var matches = userInput.match(/\d+/g);
                if (matches != null) {
                            userDisplay+=data[0].catalog_nbr;
                    }
            }
            teachingLine.innerText = userDisplay;
            
            if (request.status >= 200 && request.status < 400) {
                
                let yearMap = new Map();
                parsedData = parseData(data, ratingType, yearMap);
                data = parsedData[0];
                //console.log(data.sum('value'));
                yearMap = parsedData[1];
                data.sort(sortNumber);
               function underConstruction(){
                d3.selectAll("svg > *").remove();
                d3.select(".title")
                    .style("margin-top", "20%")
                    .text("This graph is still being coded");
   

               }
               function compGraph(data, year){
                   let divTooltip = d3.select("div.tooltip-comp");
                   let svg = d3.select("svg"),
                   margin = {
                       top: 20,
                       right: 20,
                       bottom: 30,
                       left: 40
                   },
                   width = +svg.attr("width") - margin.left - margin.right,
                   height = +svg.attr("height") - margin.top - margin.bottom
                   let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                   let x0 = d3.scale.ordinal()
                            .rangeRoundBands([0, width], .1)
                            .paddingInner(0.1);

                   let x1  = d3.scale.ordinal()
                   .padding(0.05);

                   let y = d3.scaleLinear()
                   .rangeRound([height, 0]);

                   let z = d3.scaleOrdinal()
                   .range(['#66c2a5','#fc8d62']);

                   var keys = data.columns.slice(1)
        // setting up domain for x0 as a list of all the names of months
        x0.domain(data.map(function(d) {
            //console.log(d.Month);
            return d.Month;
        }));
        // setting up domain for x1 as a list of all the names of days
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        // setting up domain for y which will be from 0 to max day of week for any month
        y.domain([0, d3.max(data, function(d) {
            return d3.max(keys, function(key) {
                return d[key];
            });
        })]).nice()
        // binding data to svg group elements
        g.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d) {
                //console.log(x0(d.Month));
                return "translate(" + x0(d.Month) + ",0)";
            })
            .attr("class", "days")
            // binding days of week data to rectangles
            .selectAll("rect")
            .data(function(d) {
                return keys.map(function(key) {
                    //console.log({ key: key, value: d[key] });
                    return {
                        key: key,
                        value: d[key]
                    };
                });
            })
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                //console.log(x1(d.key));
                return x1(d.key);
            })
            .attr("width", x1.bandwidth())
            .attr("fill", function(d) {
                //console.log(z(d.key));
                return z(d.key);
            })
            // setting up y coordinates and height position to 0 for transition
            .attr("y", function(d) {
                return y(0);
            })
            .attr("height", function(d) {
                return height - y(0);
            })
            // setting up tooltip and interactivity
            .on("mouseover", function(d) {
                divTooltip.style("left", d3.event.pageX + 10 + "px")
                divTooltip.style("top", d3.event.pageY - 25 + "px")
                divTooltip.style("display", "inline-block")
                divTooltip.style("opacity", "0.9");
                var x = d3.event.pageX,
                    y = d3.event.pageY;
                var elements = document.querySelectorAll(":hover");
                var l = elements.length - 1;
                var elementData = elements[l].__data__;
                //console.log(elementData)
                divTooltip.html(elementData.key + "<br>" + elementData.value);
                d3.select(this)
                    .attr("fill", "#F8786B")
                    //.style("opacity", "0.7")
                    .style("stroke", "Black")
                    .style("stroke-width", "1.8px")
                    .style("stroke-opacity", "1");

            })
            .on("mouseout", function(d) {
                divTooltip.style("display", "none")
                d3.select(this).transition().duration(250)
                    .attr("fill", z(d.key))
                    //.style("opacity", "1")
                    .style("stroke-opacity", "0");
            })
            // setting up transition, delay and duration
            .transition()
            .delay(function(d) {
                return Math.random() * 250;
            })
            .duration(1000)
            // setting up normal values for y and height
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
            });

        // setting up x axis    
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            // setting up x axis opacity to 0 before transition
            .style("opacity", "0")
            .call(d3.axisBottom(x0));
        // setting up transiton for x axis
        g.select(".x")
            .transition()
            .duration(500)
            .delay(800)
            // setting up full opacity after transition 
            .style("opacity", "1")

        // setting up y axis    
        g.append("g")
            .attr("class", "y axis")
            // setting up y axis opacity to 0 before transition
            .style("opacity", "0")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.90em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .text("Cancellations");
        // setting up y axis transition    
        g.select(".y")
            .transition()
            .duration(500)
            .delay(1300)
            // setting up full opacity after transition
            .style("opacity", "1")

        // setting a legend and binding legend data to group    
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice())
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 13 + ")";
            })
            // setting up opacity to 0 before transition
            .style("opacity", "0");

        // setting up rectangles for the legend    
        legend.append("rect")
            .attr("x", width - 19)
            .attr("y", -22)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", z);
        // setting up legend text    
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", -15)
            .attr("dy", "0.32em")
            .text(function(d) {
                return d;
            });
        // setting transition delay and duration for all individual elements for the legend    
        legend.transition()
            .duration(500)
            .delay(function(d, i) {
                return 1300 + 100 * i;
            })
            // setting up opacity back to full
            .style("opacity", "1");


               }
                function update(data, ratingType, yearMap){
                    d3.selectAll("svg > *").remove();
                    d3.select(".title")
                    .style("margin-top", "1em")
                    .style("margin-left", "1em")
                        .html(`<i>${ratingType}</i> over the years`);
                        d3.select("svg")
                            .attr("display", "block");
       let svg = d3.select("svg"),
margin = {top: 20, right: 70, bottom: 30, left: 70},
padding = {left: 20},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom
;

let parseTime = d3.timeParse("%Y")
bisectDate = d3.bisector(function(d) { return d.year; }).left;

let x = d3.scaleTime().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

let line = d3.line()
.x(function(d) { return x(d.year); })
.y(function(d) { return y(d.value); });

let g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data.forEach(function(d) {
  d.oldYear = d.year;
  d.year = parseTime(d.year);
  d.value = +d.value;
});
//[parseTime(2010), parseTime(2019)]

x.domain(d3.extent(data, function(d) { return d.year; }));
y.domain([1, 5]);

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return parseFloat(d); }))
  .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(ratingType);

g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);
const tooltip = g.append("g")
    .attr("class", "focus")
    .style("display", "none");
    tooltip.append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

tooltip.append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", width)
    .attr("x2", width);
    svg.on("mousemove", function() {
        var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        tooltip.select(".x-hover-line").attr("y2", height - y(d.value));
  tooltip.select(".y-hover-line").attr("x2", width + width);
      tooltip
          .attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")")
          .call(callout, `Rating = ${d.value.toLocaleString(undefined, {style: "decimal"})} 
          Responses = ${yearMap.get(d.oldYear).responses}
          Semester = ${yearMap.get(d.oldYear).semester}
          Year = ${d.year.toLocaleString(undefined, {year: "numeric"})}`);
    });
  
    svg.on("mouseleave", () => tooltip.call(callout, null));
/*var focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");
*/


/*focus.append("circle")
    .attr("r", 6);


focus.append("text")
    .attr("class", "ticker")
    .attr("x", 15)
    .attr("dy", ".31em")

*/
svg.append("rect")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", mousemove);

function mousemove() {
  var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;
  //focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
  //focus.select("text").text(function() { return d.value; })
  //                                  .style("fill","#fff")

 tooltip.select(".x-hover-line").attr("y2", height - y(d.value));
  tooltip.select(".y-hover-line").attr("x2", width + width);
}

function callout(g, value) {
    if (!value) return g.style("display", "none");
  
    g
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");
  
    const path = g.selectAll("path")
      .data([null])
      .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");
  
    const text = g.selectAll("text")
      .data([null])
      .join("text")
      .call(text => text
        .selectAll("tspan")
        .data((value + "").split(/\n/))
        .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => `${i * 1.1}em`)
          .style("font-weight", (_, i) => i ? null : "bold")
          .text(d => d));
  
    const {x, y, width: w, height: h} = text.node().getBBox();
  
    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }        
}
$(".button-rating").click(function(){

        let newRating = d3.select(this).property('value');
  d3.select('.title')
    .text(newRating);
    let yearMap = new Map();
     parsedData = parseData(jsonData, hyphenate(newRating), yearMap);
      data = parsedData[0];
      yearMap = parsedData[1];
        data.sort(sortNumber);
  update(data, newRating, yearMap);
    });

    $("#under-construction").click(function(){
        underConstruction();
    })

            $("#view-more").click(function() {
                $("#hidden-ratings").fadeToggle();
                
            });
       
            $('input[type="checkbox"]').click(function(){
                let value = $(this).attr("value");
                if($(this).is(":checked")){
                    let circle = document.querySelector(`#${value}`);
                    fillCircle(jsonData, circle, circle.getAttribute("value"));
                }
                else if($(this).is(":not(:checked)")){
                    console.log(value);
                    document.querySelector(`#${value}`).style.display="none";
                }
        });

d3.select('#opts')
.on('change', function() {
    console.log()
  let newRating = d3.select(this).property('value');
  d3.select('.title')
    .text(newRating);
    let yearMap = new Map();
     parsedData = parseData(jsonData, hyphenate(newRating), yearMap);
      data = parsedData[0];
      yearMap = parsedData[1];
        data.sort(sortNumber);
  update(data, newRating, yearMap);
    
});
            }
            

            if(document.body.scrollHeight > document.getElementById("section1").offsetHeight){
                div = document.createElement('div');
                div.setAttribute("style", "overflow-y: auto; height: " + (document.body.scrollHeight - document.getElementById("section1").offsetHeight) + "px");
                div.setAttribute("id", "section2");
                document.body.appendChild(div);
                window.scrollTo(0, 0);
            }
        } 
        function parseData(data, ratingType, yearMap) { 

            let arr = []; 
           
            for (let i = 0; i < data.length; i++) {      
                if(data[i][ratingType]){
                let yearAndMonth =  yearOf(data[i].term_name);   
                if(yearMap.has(yearAndMonth)){
                    let id = yearMap.get(yearAndMonth);
                    
                    let newRating = ((id.rating*id.responses) + (data[i][ratingType]*data[i].responses))/(data[i].responses + id.responses);
                    newRating = Math.round(newRating*100) / 100.0;
                    arr[id.arrayID].value = newRating;
                    yearMap.set(yearAndMonth, {arrayID:id.arrayID, semester : data[i].term_name, rating:newRating, responses:(id.responses+data[i].responses)});
                    
                }
                else{
                arr.push(         {      
                      
                    year: yearAndMonth, 
                    value: +data[i][ratingType]
                    
                }); 
                yearMap.set(yearAndMonth, {arrayID:(arr.length-1), rating : +data[i][ratingType], semester : data[i].term_name, responses : data[i].responses});
            }
           }

            }   
                return [arr, yearMap];}
        function fillCircle(data, circle, name){
            circle.style.display= 'flex';
            let avg = average(data, hyphenate(name));
                 circle.innerHTML = `<span class="rating-number">${Math.round(avg[0]*100) / 100} <br /> <small style="font-size:30%;">${name} <br /><small style="font-size:50%">Based on ${avg[1]} responses</small></small>`;
        }
                function yearOf(data) {
                
                let year="";
                for(let i = 0;i < data.length; i++){
                    if(data[i]>='0'&data[i]<='9')
                        year = year+data[i];
                }
                return year;
            }
        
       
        function hyphenate(profName){
            let hyphenatedName = "";
            for(let index = 0; index < profName.length; index++){
                if(profName[index]==' '){
                    hyphenatedName = hyphenatedName + "_"
                }
                else
                    hyphenatedName = hyphenatedName + profName[index];
            }
            return hyphenatedName;
        }
        function unhyphenate(profName){
            let unhyphenatedName = "";
            for(let index = 0; index < profName.length; index++){
                if(profName[index]=='_'){
                    unhyphenatedName = unhyphenatedName + " "
                }
                else
                    unhyphenatedName = unhyphenatedName + profName[index];
            }
            return unhyphenatedName;
        }
        
        function sortNumber(a, b){
            return a.year - b.year;
        }
        function average(array, property){
            
            let count = 0.0;
            let sum = 0;
            console.log("Hi");
            for(let index = 0; index < array.length; index++){
                if(array[index][property]){
                    console.log("Hi");
                    let rating = +array[index][property];
                    let responses = array[index].responses;
                    sum = sum + (rating*responses);
                    count = count + responses;
                }
            }
            if(count > 0)
                return [sum/count, count];
            else
                return [-1, -1];
        }
        async function compareWithCourse(subjectCode, activeRatings, data){
            
            compArray = []
            subjectData = await fetch(`../api/subject/${subjectCode}`);
            subjectData = await subjectData.json();
            for(let index = 0; index < activeRatings.length && index<=4; index++){
                compArray.push({
                    Professor: average(data, hyphenate(activeRatings[index])),
                    Comparative: average(subjectData, hyphenate(activeRatings[index])),
                    Rating: activeRatings[index]
                })

            }
            return compArray;

        }
        function sentence(array){
            let greatest= [0];
            let pros = [];
            let cons = [];
            //arr = (Object.values(array[0]));
            let names = [...array.reduce((s, o) => (Object.keys(o).forEach(k => s.add(k)), s), new Set)];
            for(let index1 = 10; index1 <= 27; index1++){
                
                let count = 0.0;
                let sum = 0;
                for(let index = 0; index < array.length; index++){
                    let arr = (Object.values(array[index]));
                    if(arr[index1]){
                    
                    
                    let rating = +arr[index1];
                    let responses = +arr[9];
                    sum = sum + (rating*responses);
                    count = count + responses;
                }
            }
                
            if((sum/count)>greatest[0]){

               
                greatest[0] = sum/count;
                greatest[1] = names[index1];
            }
            else if((sum/count)==greatest[0]){
                greatest[2] = names[index1];
            }
            if((sum/count)>=4.5){
                pros.push({
                    rating: (sum/count),
                    name: names[index1]
                })
            }
            if((sum/count)<3){
                cons.push({
                    rating: (sum/count),
                    name: names[index1]
                })
            }
            sum = 0;
            count = 0;
            }
            console.log(greatest, pros, cons);
            let sentence="Greatest strength is "+unhyphenate(greatest[1])+". The strengths include"

            for(let index = 0; index < pros.length && index < 5; index++){
                if(index < pros.length-1 && index < 4)
                sentence = sentence + ", "+unhyphenate(pros[index]);
                else
                sentence = sentence + "and "+unhyphenate(pros[index]);
            }
            console.log(sentence);
        }

       
    
    
    request.send(); 