$(document).ready(function() {
    new WOW().init();
    });
    let data = document.currentScript.getAttribute('data');
    var request = new XMLHttpRequest();
   var userInput = data;
   
    request.open('GET', '..' + userInput, true); ;
    
        request.onload = function(){
            var i = 0;
            var colOne;
            var colTwo;
            data = JSON.parse(this.response);
            let jsonData = data;
            let teachingLine = document.querySelector('.teachingLine');
            let userDisplay ="";
            if(userInput.includes("professor")||userInput.includes("instructor_name")){
                 userDisplay = "Results for "+data[0].instructor_name;
                if(userInput.includes("subject")){
                    userDisplay = userDisplay + " teaching "+data[0].subject;
                    if(userInput.includes("catalog_nbr"))
                        userDisplay = userDisplay +data[0].catalog_nbr;
                
                
                    let professorButton = document.querySelector('.professor');
                     professorButton.innerHTML = 'Browse results for '+data[0].instructor_name;
                    professorButton.setAttribute("href", "../professor/"+hyphenate(data[0].instructor_name));
                    professorButton.setAttribute("display", null);
                }
            }
            else{
                userDisplay = "Results for "+data[0].subject+""+data[0].catalog_nbr;
            }
            teachingLine.innerText = userDisplay;
            
            if (request.status >= 200 && request.status < 400) {
                data = parseData(data);
                
                data.sort(sortNumber);
                
                
    
       var svg = d3.select("svg"),
margin = {top: 20, right: 50, bottom: 30, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y")
bisectDate = d3.bisector(function(d) { return d.year; }).left;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
.x(function(d) { return x(d.year); })
.y(function(d) { return y(d.value); });

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


data.forEach(function(d) {
  d.year = parseTime(d.year);
  d.value = +d.value;
});

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
    .text("Overall rating of the instructor");

g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

var focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");

focus.append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

focus.append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", width)
    .attr("x2", width);

focus.append("circle")
    .attr("r", 6);

focus.append("text")
    .attr("class", "ticker")
    .attr("x", 15)
    .attr("dy", ".31em")


svg.append("rect")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

function mousemove() {
  var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;
  focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
  focus.select("text").text(function() { return d.value; });
  focus.select(".x-hover-line").attr("y2", height - y(d.value));
  focus.select(".y-hover-line").attr("x2", width + width);
}

                //parsedData = drawChart(parsedData);
            }
            

            if(document.body.scrollHeight > document.getElementById("section1").offsetHeight){
                div = document.createElement('div');
                div.setAttribute("style", "overflow-y: auto; height: " + (document.body.scrollHeight - document.getElementById("section1").offsetHeight) + "px");
                div.setAttribute("id", "section2");
                document.body.appendChild(div);
                window.scrollTo(0, 0);
            }
        } 
        function parseData(data) { 

            let arr = []; 
            let yearMap = new Map();
            for (let i = 0; i < data.length; i++) {      
                if(data[i].Your_overall_rating_of_the_instructor){
                let yearAndMonth =  yearOf(data[i].term_name);   
                if(yearMap.has(yearAndMonth)){
                    let id = yearMap.get(yearAndMonth);
                    
                    let newRating = ((id.rating*id.responses) + (data[i].Your_overall_rating_of_the_instructor*data[i].responses))/(data[i].responses + id.responses);
                    newRating = Math.round(newRating*100) / 100.0;
                    arr[id.arrayID].value = newRating;
                    yearMap.set(yearAndMonth, {arrayID:id.arrayID, rating:newRating, responses:(id.responses+data[i].responses)});
                    
                }
                else{
                arr.push(         {      
                      
                    year: yearAndMonth, 
                    value: +data[i].Your_overall_rating_of_the_instructor
                    
                }); 
                yearMap.set(yearAndMonth, {arrayID:(arr.length-1), rating : +data[i].Your_overall_rating_of_the_instructor, responses : data[i].responses});
            }
           }

            }   
                return arr;}
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
        function sortNumber(a, b){
            return a.year - b.year;
        }
    
    
    request.send(); 