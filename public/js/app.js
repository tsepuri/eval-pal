$(document).ready(function() {
    new WOW().init();
    });

    let httprequest = new XMLHttpRequest();
    if(document.currentScript.getAttribute('data')){
    let usersInput = document.currentScript.getAttribute('data');
    httprequest.open('GET', '../api/professor/' + usersInput, true); 
    httprequest.onload = function(){
        var i = 0;
        var colOne;
        var colTwo;
        data = JSON.parse(this.response);
        var loggedData = new Array(0);
        if (httprequest.status >= 200 && httprequest.status < 400) {
            let classes = new Map();
            for (i = 0; i < data.length; i++){

                    if(!classes.has(data[i].instructor_name+data[i].subject+data[i].catalog_nbr)){
                    row = document.createElement('a');
                    row.setAttribute("style", "width: 100%; padding: 2%");
                    row.setAttribute("class", "row rounded-lg");

                    colOne = document.createElement('a');
                    colTwo = document.createElement('a');
                   
                    colOne.setAttribute("class", "col result-option subject-hover");
                    colTwo.setAttribute("class", "col result-option prof-hover");
                    colOne.setAttribute("style", "width: 100%; text-align: center; line-height: inherit; padding: 2%; border-radius: 5px;");
                    colTwo.setAttribute("style", "width: 100%; text-align: center; line-height: inherit; padding: 2%; border-radius: 5px;");
                    colTwo.innerText = data[i].subject + data[i].catalog_nbr;
                    colOne.innerText = data[i].instructor_name;
                    profName = data[i].instructor_name;
                    profName = hyphenate(profName);
                    colTwo.setAttribute("href", "../professor/"+profName+"?subject="+data[i].subject+"&catalog_nbr="+data[i].catalog_nbr);
                    colOne.setAttribute("href", "../professor/"+profName);
                    row.appendChild(colOne);
                    row.appendChild(colTwo);
                    document.getElementById("results-main").appendChild(row);
                    classes.set(data[i].instructor_name+data[i].subject+data[i].catalog_nbr, "");
                }
            }
            
        }
        if(document.body.scrollHeight > document.getElementById("section1").offsetHeight){
                div = document.createElement('div');
                div.setAttribute("style", "overflow-y: auto; height: " + (document.body.scrollHeight - document.getElementById("section1").offsetHeight) + "px");
                div.setAttribute("id", "section2");
                document.body.appendChild(div);
                window.scrollTo(0, 0);
            }
    }
    }
    window.addEventListener("resive", function(event){
        if(document.body.scrollHeight > document.getElementById("section1").offsetHeight){
                div = document.createElement('div');
                div.setAttribute("style", "overflow-y: auto; height: " + (document.body.scrollHeight - document.getElementById("section1").offsetHeight) + "px");
                div.setAttribute("id", "section2");
                document.body.appendChild(div);
                window.scrollTo(0, 0);
            }
    });

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

    searchBarInput = document.getElementById("user-search-input");
    let count = 0;
    let optionsArr;
    let filteredArr = [];
    let firstSuggestion = document.getElementById("first-suggestion");
    let secondSuggestion = document.getElementById("second-suggestion");
    let thirdSuggestion = document.getElementById("third-suggestion");
    let suggestionsArr = [firstSuggestion, secondSuggestion, thirdSuggestion];
    let newFilteredArr;
    let searchUniques = [];
    let itemsFound = {};

    searchBarInput.addEventListener("input", async function(event){
        if(event.target.value.length == 1){
            optionsArr = await fetch(`../api/professor/${event.target.value}`);
            optionsArr = await optionsArr.json();
            console.log(optionsArr)
            for(i = 0; i < optionsArr.length; i++){
                filteredArr.push(optionsArr[i].instructor_name);
            }
        }
        if(event.target.value.length == 0){
            for(let i = 0; i < 3; i++){
            suggestionsArr[i].style.visibility = 'hidden';
        }
        }
        else{
            newFilteredArr = filteredArr.filter(option => option.toLowerCase().includes(event.target.value.toLowerCase()));
            searchUniques = [];
            itemsFound = {};
            for(i = 0; i < newFilteredArr.length; i++) {
                var stringified = JSON.stringify(newFilteredArr[i]);
                if(itemsFound[stringified]) { continue; }
                searchUniques.push(newFilteredArr[i]);
                itemsFound[stringified] = true;
            }
    
        for(i = 0; i < searchUniques.length && i < 3; i++){
            suggestionsArr[i].innerHTML = "<i class='fa fa-search'></i>  " + searchUniques[i];
            suggestionsArr[i].setAttribute("style", "visibility: visible; border-radius: 0px");
        }
        for(let i = searchUniques.length; i < 3; i++){
            suggestionsArr[i].setAttribute("style", "visibility: hidden");
        }
    }
    });
    for(var i = 0; i < suggestionsArr.length; i++){
        
        suggestionsArr[i].addEventListener("click", function(event){
            if(event.target.getAttribute("style").includes("visible")){
                searchBarInput.value = event.target.innerText.trim();
                var form = document.getElementById("try-again-form");
                form.submit();
            }
        });
    }
    if(document.currentScript.getAttribute('data')){
    httprequest.send(); 
    }