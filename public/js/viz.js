
    if($(window).width() < 600){
        
        d3.select("svg")
                    .attr("height", 200)
                    .attr("width", 480);
        d3.select("#container-rating-options")
            .attr("class", ".shrink");
                
    }
    $(window).on('resize', function() {
        if($(window).width() < 600){
            d3.select("svg")
                        .attr("height", 250)
                        .attr("width", 450);
           
        }
        else if($(window).width() > 600){
            d3.select("svg")
                        .attr("height", 500)
                        .attr("width", 900);
           
        }
      });
      $(document).ready(function() {
        new WOW().init();
       
        });
    let data = document.currentScript.getAttribute('data');
    let request = new XMLHttpRequest();
    let userInput = data;
   
    request.open('GET', userInput, true); 
       
        request.onload = async function(){
            let i = 0;
            let colOne;
            let colTwo;
            data = JSON.parse(this.response);
            let jsonData = data;
            let teachingLine = document.querySelector('.teachingLine');
            let userDisplay ="";
            let ratingType="";
            let profData="";
            let activeRatings="", compData=[], comparison="", requiredTextForComp="";
            if(userInput.includes("professor")||userInput.includes("instructor_name")){
                sentence(jsonData);
                 userDisplay = "Results for "+data[0].instructor_name;
                 let circle = document.querySelector('.circle-with-text');
                fillCircle(jsonData, circle, "Your overall rating of the instructor");
                circle.style.display = 'flex';
                circle.parentElement.style.display = 'flex';
                document.querySelector('.compareWithProf').style.display = 'flex';
                document.querySelector('.circle-2').style.display= 'flex';
                document.querySelector('.compareWithProf').parentElement.style.display = 'flex';
                document.querySelector('.circle-2').parentElement.style.display= 'flex';
                activeRatings = ["Your overall rating of the instructor", "Your overall rating of the course", "Grading is done fairly"];
                fillCircle(jsonData, document.querySelector('#courseRating'), document.querySelector('#courseRating').getAttribute("value"));
                if(fillCircle(jsonData, document.querySelector('#fairGrading'), document.querySelector('#fairGrading').getAttribute("value")) == -1){
                    
                    document.querySelector('#fairGrading').parentElement.style.display = 'none';
                    document.querySelector('#fairGrading').style.display = 'none';
                    $('#grading_fairly').prop("checked", false);
                    activeRatings.splice(activeRatings.indexOf("Grading is done fairly", 1));
                }
                
                if(userInput.includes("subject")){
                    userDisplay = userDisplay + " teaching "+data[0].subject;
                    if(userInput.includes("catalog_nbr")){
                        userDisplay = userDisplay +data[0].catalog_nbr;
                        comparison =data[0].subject+data[0].catalog_nbr;
                        compData = await compareWithCourse(comparison , activeRatings, jsonData);
                        
                        d3.select('.title')
                .text(`${data[0].instructor_name} teaching in ${data[0].subject}${data[0].catalog_nbr} compared to the course as a whole`.toUpperCase())
                requiredTextForComp = `${data[0].instructor_name} teaching in ${data[0].subject}${data[0].catalog_nbr} compared to the course as a whole`;
                    }
                    document.querySelector('.circle-2').innerHTML = `View full page of ${data[0].instructor_name}`
                    document.querySelector('#view_more').setAttribute("href", "../professor/"+hyphenate(data[0].instructor_name));
                    let professorButton = document.querySelector('.professor');
                     professorButton.innerHTML = 'Browse results for '+data[0].instructor_name;
                    professorButton.setAttribute("href", "../professor/"+hyphenate(data[0].instructor_name));
                    professorButton.setAttribute("display", "none");
                    
                }
                else{
                    document.querySelector('.circle-2').innerHTML = `View subject-wise comparisons for ${data[0].instructor_name}`;
                    document.querySelector('.circle-2-button').setAttribute("id", "subject-wise");
                }
                if(!(userInput.includes("catalog_nbr"))){
                    comparison = data[0].subject;
                    compData = await compareWithCourse(comparison, activeRatings, jsonData);
                    
                    d3.select('.title')
                .text(`${data[0].instructor_name} teaching in ${data[0].subject} compared to the department as a whole`.toUpperCase())
                    requiredTextForComp = `${data[0].instructor_name} teaching in ${data[0].subject} compared to the department as a whole`;
                }
                d3.select('.title')
                .style("margin-top", "1em")
                .style("margin-left", "1em")
                ratingType = hyphenate("Your overall rating of the instructor");
               
                compGraph(compData, "compData");
                
                
            }
            else{
                
                let circle = document.querySelector('.circle-with-text');
                circle.style.display = 'flex';
                circle.parentElement.style.display = 'flex';
                let avg = average(jsonData, "Your_overall_rating_of_the_course");
                 circle.innerHTML = `<span class="rating-number">${Math.round(avg[0]*100) / 100} <br /> <small style="font-size:30%;">Overall Rating of the Course<br/><small style="font-size:50%">Based on ${avg[1]} responses out of ${avg[2]} students</small></small>`;
                 document.querySelector('.button-rating').value = "Your overall rating of the course"
                 ratingType = hyphenate("Your overall rating of the course");
                d3.select('.title')
                .text("Your overall rating of the course".toUpperCase());
                let select = document.querySelector('#opts');
                select.value = "Your overall rating of the course";
                userDisplay = "Results for "+data[0].subject;
                let matches = userInput.match(/\d+/g);
                if (matches != null) {
                            userDisplay+=data[0].catalog_nbr;
                    }
            }
            teachingLine.innerText = userDisplay;
            
            if (request.status >= 200 && request.status < 400) {
                
                let yearMap = new Map();
                parsedData = parseData(data, ratingType, yearMap);
                data = parsedData[0];
                
                yearMap = parsedData[1];
                data.sort(sortNumber);
               function underConstruction(){
                d3.selectAll("svg > *").remove();
                d3.select(".title")
                    .style("margin-top", "20%")
                    .text("This graph is still being coded");
   

               }
               
                function update(data, ratingType, yearMap, ratingName){

                    if(!ratingName){
                        ratingName = ratingType;
                    }
                 
                    d3.selectAll("svg > *").remove();
                    d3.select(".title")
                    .style("margin-top", "1em")
                    .style("margin-left", "1em")
                        .html(`<i>${ratingName}</i> over the years`.toUpperCase());
                    
                        d3.select("svg")
                            .attr("display", "block");
       let svg = d3.select("svg"),
margin = {top: +svg.attr("height")/25, right: +svg.attr("width")/12.86, bottom: +svg.attr("height")/16.67, left: +svg.attr("width")/12.86},
padding = {left: +svg.attr("width")/45},
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
    .text(ratingName);

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
        const x0 = x.invert(d3.mouse(this)[0]),
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
        Semester = ${yearMap.get(d.oldYear).semester}`);
          //Year = ${d.year.toLocaleString(undefined, {year: "numeric"})
    });
  
    svg.on("mouseleave", () => tooltip.call(callout, null));
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
        let ratingName = d3.select(this).property('name');
        if(ratingName == null){
            ratingName = newRating;
        }
  d3.select('.title')
    .text(ratingName);
    let yearMap = new Map();
     parsedData = parseData(jsonData, hyphenate(newRating), yearMap);
      data = parsedData[0];
      yearMap = parsedData[1];
      
        data.sort(sortNumber); 
            update(data, newRating, yearMap, ratingName);
        
    });
    $(".compareProf").click(async function(){
       
  d3.select('.title')
    .text(`${jsonData[0].instructor_name} compared to similar professors`.toUpperCase());
     parsedData = await compareWithProfessors(comparison, "", activeRatings, jsonData);
      
            compGraph(parsedData, "profWise");
        
    });

    $("#subject-wise").click(async function(){
    compData = await compareWithSubjects(activeRatings, jsonData)
    d3.select(".title")
        .text("Subject wise comparison".toUpperCase())
    
    compGraph(compData, "subjectWise");
       
    })

            $("#view-more").click(function() {
                $("#hidden-ratings").fadeToggle();
                
            });
       
            $('input[type="checkbox"]').click(async function(){
                let value = $(this).attr("value");
                let notAvaialble = false;
                if($(this).is(":checked")){
                    
                    let circle = document.querySelector(`#${value}`);
                    if(circle.getAttribute("name")){
                    if(fillCircle(jsonData, circle, circle.getAttribute("value"), circle.getAttribute("name")) == -1){
                        
                        $(this).prop("checked", false);
                        alert("This rating is not available for this professor");
                        notAvaialble = true;

                    }
                    }
                    else{
                    if(fillCircle(jsonData, circle, circle.getAttribute("value")) == -1){
                        
                        $(this).prop("checked", false);
                        alert("This rating is not available for this professor");
                        notAvaialble = true;
                    }
                    }
                    if(!notAvaialble){
                    activeRatings.push(circle.getAttribute("value"));
                    compData = await compareWithCourse(comparison, activeRatings, jsonData);
                    compGraph(compData, "compData");
                    d3.select(".title")
                        .text(requiredTextForComp.toUpperCase());
                    }
                }
                else if($(this).is(":not(:checked)")){
                    
                    let circle = document.querySelector(`#${value}`)
                    circle.style.display="none";
                    circle.parentElement.style.display = 'none';
                    activeRatings.splice(activeRatings.indexOf(circle.getAttribute("value")), 1);
                    compData = await compareWithCourse(comparison, activeRatings, jsonData);
                    compGraph(compData, "compData");
                    d3.select(".title")
                    .text(requiredTextForComp.toUpperCase());
                }
        });

d3.select('#opts')
.on('change', function() {
  let newRating = d3.select(this).property('value');
  d3.select('.title')
    .text(newRating.toUpperCase());
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
        
        function compGraph(data, dataType){
            d3.selectAll("svg > *").remove();
            d3.select("svg")
            .attr("display", "block");
            let svg = d3.select("svg"),
margin = {top: +svg.attr("height")/25, right: +svg.attr("width")/12.86, bottom: +svg.attr("height")/16.67, left: +svg.attr("width")/12.86},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom
let divTooltip = d3.select("div.tooltip-comp")
let groupKey = "Rating"
let keys = d3.keys(data[0]).filter(function(key){return key!=="Rating";});
      let x0 = d3.scaleBand()
    .domain(data.map(d => d[groupKey]))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.15)
    .paddingInner(0.4)
    
    let x1 = d3.scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05)
    let y = d3.scaleLinear()
    //d3.max(data, d => d3.max(keys, key => d[key]))
    .domain([0, 5]).nice()
    .rangeRound([height - margin.bottom, margin.top])
    let color;
    if(dataType === "compData"){
    color = d3.scaleOrdinal()
    .range(["#8B3928", "#3B87B6"]);
    }
    else{
        color = d3.scaleOrdinal()
    .range(["#9C2EC8", "#2D993F", "rgb(36, 184, 228)", "rgb(170, 218, 219)"]);
    }
    let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .attr("font-size", 12)
    .call(g => g.selectAll(".tick")
        .call(g => g.select("text")
        .call(wrap, 150))
        );
        
    

    let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Overall Rating"));
        
      
     let legend = svg => {
            const g = svg
                .attr("transform", `translate(${width},0)`)
                .attr("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("fill", "#fff")
              .selectAll("g")
              .data(color.domain().slice().reverse())
              .join("g")
                .attr("transform", (d, i) => `translate(0,${i * 20})`);
          
            g.append("rect")
                .attr("x", -19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", color);
          
            g.append("text")
                .attr("x", -24)
                .attr("y", 9.5)
                .attr("dy", "0.35em")
                .text(d => d)
                .attr("color", "#fff");
          }
          svg.append("g")
          .selectAll("g")
          .data(data)
          .join("g")
            .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
          .selectAll("rect")
          .data(d => keys.map(key => ({key, value: d[key]})))
          .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => y(0) - y(d.value))
            .attr("fill", d => color(d.key))
            .on('mouseover ', function(d) {
                d3.select(this).transition()
                    .style("opacity", "0.5")
                    .style("stroke", "Black")
                    .style("stroke-width", "2px")
                    .style("stroke-opacity", "1")
                .duration('50');
               
                divTooltip.style("display", "block")
                divTooltip.transition().duration(200).style('opacity', 0.9);
                if(dataType == 'profWise' && !(d3.select(".title").text().includes(d.key.toUpperCase()))){
                let href = `../professor/${hyphenate(d.key)}`;
                divTooltip.html(`<span><a href=${href}>${(d.key)}</a></span><br>Rating: <span>${Math.round(d.value*100)/100}</span>`)
                }
                else{
                    divTooltip.html(`<span>${(d.key)}</span><br>Rating: <span>${Math.round(d.value*100)/100}</span>`)
                }
                  divTooltip.style('left', `${d3.event.layerX}px`)
                  .style('top', `${(d3.event.layerY - 50)}px`);
              })
              
              .on("mouseout", function(d) {
                if(dataType == 'profWise'){
                divTooltip.on("mouseover", function(d){
                    divTooltip.style("display", "block")
                divTooltip.transition().duration(200).style('opacity', 0.9);
                })
                    .on("mouseout", function(d){
                        divTooltip.style("display", "none")
                divTooltip.transition().duration(500).style('opacity', 0)
                    });
                }
                divTooltip.style("display", "none")
                divTooltip.transition().duration(500).style('opacity', 0)
                d3.select(this).transition().duration(250)
                    .attr("fill", color(d.key))
                    .style("opacity", "1")
                    .style("stroke-opacity", "0");
                
            })
            // setting up transition, delay and duration
            .transition()
            .delay(function(d) {
                return Math.random() * 250;
            })
            .duration(1000);
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
      
        svg.append("g")
            .call(legend);
          
               

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
                    yearMap.set(yearAndMonth, {arrayID:id.arrayID, semester : data[i].term_name, rating:newRating, responses:(id.responses+data[i].responses), enrollment:(id.enrollment+data[i].enrollment)});
                    
                }
                else{
                arr.push(         {      
                      
                    year: yearAndMonth, 
                    value: +data[i][ratingType]
                    
                }); 
                yearMap.set(yearAndMonth, {arrayID:(arr.length-1), rating : +data[i][ratingType], semester : data[i].term_name, responses : data[i].responses, enrollment : data[i].enrollment});
            }
           }

            }   
                return [arr, yearMap];}
                function fillCircle(data, circle, value){
                    circle.style.display= 'flex';
                    circle.parentElement.style.display = 'flex';
                    let avg = average(data, hyphenate(value));
                    
                circle.innerHTML = `<span class="rating-number">${Math.round(avg[0]*100) / 100} <br /> <small style="font-size:30%;">${value} <br /><small style="font-size:50%">Based on ${avg[1]} responses<br /><small style="font-size:100%"> out of ${avg[2]} students</small></small></small>`;
                    
                }
        function fillCircle(data, circle, value, name){
            
            let avg = average(data, hyphenate(value));
            if(avg[0] == -1){
                return -1;
            }
            else{
            circle.style.display= 'flex';
            circle.parentElement.style.display = 'flex';
            
            if(name){
                circle.innerHTML = `<span class="rating-number">${Math.round(avg[0]*100) / 100} <br /> <small style="font-size:30%;">${name} <br /><small style="font-size:50%">Based on ${avg[1]} responses<br /><small style="font-size:100%"> out of ${avg[2]} students</small></small></small>`;
            }
            else{
                circle.innerHTML = `<span class="rating-number">${Math.round(avg[0]*100) / 100} <br /> <small style="font-size:30%;">${value} <br /><small style="font-size:50%">Based on ${avg[1]} responses<br /><small style="font-size:100%"> out of ${avg[2]} students</small></small></small>`;
            }
        }
        }
                function yearOf(data) {
                
                let year="";
                for(let i = 0;i < data.length; i++){
                    if(data[i]>='0'&data[i]<='9')
                        year = year+data[i];
                }
                return year;
            }
        
       //function to hyphenate a name
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
        //function to unhyphenate a name
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
        //function to find the average of a rating
        function average(array, property, instructor){
            
            let count = 0.0;
            let sum = 0;
            let enrollmentCount = 0;
            for(let index = 0; index < array.length; index++){
                if((array[index][property])){
                    if(!(instructor != null && array[index].instructor_name != instructor)){
                    let rating = +array[index][property];
                    let responses = array[index].responses;
                    enrollmentCount = enrollmentCount + array[index].enrollment;
                    sum = sum + (rating*responses);
                    count = count + responses;
                    }
                }
            }
            if(count > 0)
                return [sum/count, count, enrollmentCount];
            else
                return [-1, -1, -1];
        }
        //function to compare the subjects that the instructor teaches
        async function compareWithSubjects(activeRatings, data){
            subjectArray = []
            compArray = []
            for(let index = 0; index < data.length; index++){
                if(!subjectArray.includes(`${data[index].subject+data[index].catalog_nbr}`)){
                    subjectArray.push(data[index].subject+data[index].catalog_nbr);
                }
            }
           
            for(let index = 0; index < subjectArray.length && index <=3; index++){
                subjectData = await fetch(`../api/subject/${subjectArray[index]}`);
                subjectData = await subjectData.json();
                compArray[index] = {};
                for(let index1 = 0; index1 < activeRatings.length && index1<=3;index1++){
                        compArray[index][activeRatings[index1]] = average(subjectData, hyphenate(activeRatings[index1]), data[0].instructor_name)[0];
                }
                compArray[index]["Rating"] = subjectArray[index];
            }
           
            
            return compArray;
        }
        //function to compare the instructor with similar professors
        async function compareWithProfessors(subjectCode, subject, activeRatings, data){
            let responses = new Map();
            let compArray = []
            let profArray = [data[0].instructor_name]
            let subjectData = await fetch(`../api/subject/${subjectCode}`);
            subjectData = await subjectData.json();
            let count = 1;
            for(let index = 0; count <= 2 && index < data.length; index++){
                if(subjectData[index].instructor_name){
                if(!profArray.includes(subjectData[index].instructor_name)){
                    profArray[count++] = (subjectData[index].instructor_name);
                    
                }
            }
            }
            for(let index = 0; index < activeRatings.length && index<=3; index++){


                compArray[index]= {};
                for(let index1 = 0; index1 < profArray.length; index1++){

                    let profData = await fetch(`../api/professor/${profArray[index1]}`)
                    profData = await profData.json();
                    
                    compArray[index][profArray[index1]] = average(profData, hyphenate(activeRatings[index]))[0];
                }
                compArray[index]["Rating"] = activeRatings[index];
            }
            
                return compArray;
        }
        //function to compare the instructor with the entire department or the course teachers
        async function compareWithCourse(subjectCode, activeRatings, data){
            
            let responses = new Map();
            compArray = []
            subjectData = await fetch(`../api/subject/${subjectCode}`);
            subjectData = await subjectData.json();
            let comparison = "";
            if(subjectCode[4] && (subjectCode[4]>='0'&&subjectCode[4]<='9'))
                comparison = `All ${subjectCode} professors`;
            else
                comparison = `All ${subjectCode} department professors`
            for(let index = 0; index < activeRatings.length && index<=3; index++){
                compArray[index] = {};
                compArray[index][data[0].instructor_name] = average(data, hyphenate(activeRatings[index]))[0];
                compArray[index][comparison] = average(subjectData, hyphenate(activeRatings[index]))[0];
                compArray[index]["Rating"] = activeRatings[index];
                responses.set(activeRatings[index], {ProfResponses:average(data, hyphenate(activeRatings[index]))[1], CompResponses:average(subjectData, hyphenate(activeRatings[index]))[1]})

            }
            return compArray;

        }
        //function to wrap the text beneath a graph when it's too long
        function wrap(text, width) {
            text.each(function() {
            let text = d3.select(this),
                  words = text.text().split(/\s+/).reverse(),
                  word,
                  line = [],
                  lineNumber = 0,
                  lineHeight = 1.1, // ems
                  y = text.attr("y"),
                  dy = parseFloat(text.attr("dy")),
                  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
              while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                  line.pop();
                  tspan.text(line.join(" "));
                  line = [word];
                  tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
              }
            });
          }
        //function to see the pros and cons of a professor: still under construction
        function sentence(array){
            let greatest= [0];
            let pros = [];
            let cons = [];
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
           
            let sentence="Greatest strength is "+unhyphenate(greatest[1])+". The strengths include"

            for(let index = 0; index < pros.length && index < 5; index++){
                if(index < pros.length-1 && index < 4)
                sentence = sentence + ", "+unhyphenate(pros[index]);
                else
                sentence = sentence + "and "+unhyphenate(pros[index]);
            }
           
        }

       
        
    
    request.send(); 
        