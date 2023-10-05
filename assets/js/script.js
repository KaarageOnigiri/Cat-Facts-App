// BEGIN: calling local storage
var previousUserSearch = localStorage.getItem("previousUserSearch");

// console.log(document.getElementById("breed-select").children[1].value);
function initiation() {
    console.log(previousUserSearch);
    if (!previousUserSearch) {
        previousUserSearch = "abys";
        localStorage.setItem("previousUserSearch", previousUserSearch);
    }
    // insert userinput here
    fetchPreviousBreedImages();
    fetchPreviousBreedFacts();
}

initiation();
// END: calling local storage

var fetchButton = document.getElementById("fetch-breed");
var breedSelectBox = document.getElementById("breed-select");

var imageURLs = []

fetchButton.addEventListener("click", fetchBreedImages);
fetchButton.addEventListener("click", fetchBreedFacts);

async function fetchBreedImages(){



    for (var counter = 0; counter < 3; counter++){
        var fetchURL = "https://api.thecatapi.com/v1/images/search?breed_ids=" + breedSelectBox.value

        await fetch(fetchURL).then(async function(response){

            return response.json();

        }).then(function(data){

            var imageURL = data[0].url;

            imageURLs.push(imageURL);

            for(var counter2 = 1; counter2 < imageURLs.length; counter2++){
                
                if(imageURLs[counter2] === imageURLs[counter2 - 1]){
                    
                    counter--;
                    imageURLs.splice(counter2, 1)
                    break;
                }
            }

            document.getElementById("img-" + (counter + 1)).src = imageURL;
        });
    }
}

async function fetchBreedFacts(){

    var maximumLifeExpectancy = "";
    var minimumLifeExpectancy = "";
    var maximumWeight = "";
    var minimumWeight = "";

    var APIKey = "+v2rPqjZgnuAusp2fgCqLQ==LL2wNNiBCErIm3Fj";
        await fetch('https://api.api-ninjas.com/v1/cats?name=abyssinian', {
            headers: {
            'X-Api-Key': APIKey
            }

        }).then(function(response){

            return response.json();

        }).then(function(data){

            console.log(data);

            var catFacts = Object.entries(data[0])

            removefromResults(catFacts, "image_link");
            removefromResults(catFacts, "name");
            removefromResults(catFacts, "general_health");

            var randomFact = "";

           

            

    

            for(var counter = 0; counter < 13; counter++){
                
                var propertyValue = catFacts[counter][1];

                var propertyValueWords = setPropertyValueWords(propertyValue);

                if(catFacts[counter][0] === "children_friendly"){

                    document.getElementById("children-friendly-span").textContent = propertyValueWords 
                }

                if(catFacts[counter][0] === "family_friendly"){

                    document.getElementById("family-friendly-span").textContent = propertyValueWords
                }

                if(catFacts[counter][0] === "grooming"){

                    document.getElementById("grooming-span").textContent = propertyValueWords
                }

                if(catFacts[counter][0] === "intelligence"){

                    document.getElementById("intelligence-span").textContent = propertyValueWords
                }

                if(catFacts[counter][0] === "length"){

                    document.getElementById("length-span").textContent = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "max_life_expectancy"){

                    maximumLifeExpectancy = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "max_weight"){

                    maximumWeight =  catFacts[counter][1];
                }

                if(catFacts[counter][0] === "min_life_expectancy"){

                    minimumLifeExpectancy = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "min_weight"){

                    minimumWeight = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "origin"){

                    document.getElementById("origin-span").textContent = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "other_pets_friendly"){

                    document.getElementById("other-pets-friendly-span").textContent = propertyValueWords;
                }

                if(catFacts[counter][0] === "playfulness"){

                    document.getElementById("playfulness-span").textContent = propertyValueWords;
                }

                if(catFacts[counter][0] === "shedding"){

                    document.getElementById("shedding-span").textContent = propertyValueWords 
                }
            }

            // randomFact = "The " + breedSelectBox.value + "breed "  + property

            // var funFact = document.getElementById("fun-fact-" + (counter + 1));

            // funFact.textContent = randomFact;
        });
    

    document.getElementById("weight-span").textContent = minimumWeight + " - " + maximumWeight + " pounds";
    document.getElementById("life-expectancy-span").textContent = minimumLifeExpectancy + " - " + maximumLifeExpectancy + " years";
}

function removefromResults(catFacts, propertyNameToRemove){

    for (let counter = 0; counter < catFacts.length; counter++) {
        
        if (catFacts[counter][0] === propertyNameToRemove) {

          catFacts.splice(counter, 1);
        }
    }
}

function setPropertyValueWords(value){

    switch(value){

        case 1: 
            return "very low";
        
        case 2: 
            return "low";

        case 3: 
            return "medium";

        case 4: 
            return "high";

        case 5: 
            return "very high";
    }
}

// BEGIN: random cat facts section
var factTitle3 = document.getElementById("fact-title-3");

var funFact3 = document.getElementById("fun-fact-3");

animalFactsApiUrl = "https://cat-fact.herokuapp.com/facts";

fetch(animalFactsApiUrl, {
    method: "GET",
})
.then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            displayRandomCatFactsData(data);
        })
    }
    else {
        alert("Error: " + response.status);
    }
})

function displayRandomCatFactsData(data) {
    var randomNumber = Math.floor(Math.random() * data.length)
    funFact3.textContent = data[randomNumber].text;
}
// END: random cat facts section

// BEGIN: display image from previous search (need to change the abys to user previous input)
async function fetchPreviousBreedImages(){

    // console.log(previousUserSearch);

    for (var counter = 0; counter < 3; counter++){
        var fetchURL = "https://api.thecatapi.com/v1/images/search?breed_ids=" + previousUserSearch;

        await fetch(fetchURL).then(async function(response){

            return response.json();

        }).then(function(data){

            var imageURL = data[0].url;

            imageURLs.push(imageURL);

            for(var counter2 = 1; counter2 < imageURLs.length; counter2++){
                
                if(imageURLs[counter2] === imageURLs[counter2 - 1]){
                    
                    counter--;
                    imageURLs.splice(counter2, 1)
                    break;
                }
            }

            document.getElementById("img-" + (counter + 1)).src = imageURL;
        });
    }
}
// END: display image from previous search 

// BEGIN: same as the function above (adding this just in case I want to modify something within it)
async function fetchPreviousBreedFacts(){

    var maximumLifeExpectancy = "";
    var minimumLifeExpectancy = "";
    var maximumWeight = "";
    var minimumWeight = "";

    var APIKey = "+v2rPqjZgnuAusp2fgCqLQ==LL2wNNiBCErIm3Fj";
    
    // test section, can be changed to match Gabriel's code
    var previousUserSearchData;
    if (previousUserSearch === "abys") {
        previousUserSearchData = "abyssinian";
    }
    if (previousUserSearch === "aege") {
        previousUserSearchData = "aegean";
    }
    if (previousUserSearch === "abob") {
        previousUserSearchData = "bobtail";
    }
    if (previousUserSearch === "acur") {
        previousUserSearchData = "curl";
    }
    if (previousUserSearch === "asho") {
        previousUserSearchData = "shorthair";
    }
    if (previousUserSearch === "awir") {
        previousUserSearchData = "wirehair";
    }

    // console.log(previousUserSearchData);


    // change abyssnian to variable
        await fetch('https://api.api-ninjas.com/v1/cats?name=' + previousUserSearchData, {
            headers: {
            'X-Api-Key': APIKey
            }

        }).then(function(response){

            return response.json();

        }).then(function(data){

            console.log(data);

            var catFacts = Object.entries(data[0])

            removefromResults(catFacts, "image_link");
            removefromResults(catFacts, "name");
            removefromResults(catFacts, "general_health");

            var randomFact = "";

           

            

    

            for(var counter = 0; counter < 13; counter++){
                
                var propertyValue = catFacts[counter][1];

                var propertyValueWords = setPropertyValueWords(propertyValue);

                if(catFacts[counter][0] === "children_friendly"){

                    document.getElementById("children-friendly-span").textContent = propertyValueWords 
                }

                if(catFacts[counter][0] === "family_friendly"){

                    document.getElementById("family-friendly-span").textContent = propertyValueWords
                }

                if(catFacts[counter][0] === "grooming"){

                    document.getElementById("grooming-span").textContent = propertyValueWords
                }

                if(catFacts[counter][0] === "intelligence"){

                    document.getElementById("intelligence-span").textContent = propertyValueWords
                }

                if(catFacts[counter][0] === "length"){

                    document.getElementById("length-span").textContent = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "max_life_expectancy"){

                    maximumLifeExpectancy = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "max_weight"){

                    maximumWeight =  catFacts[counter][1];
                }

                if(catFacts[counter][0] === "min_life_expectancy"){

                    minimumLifeExpectancy = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "min_weight"){

                    minimumWeight = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "origin"){

                    document.getElementById("origin-span").textContent = catFacts[counter][1];
                }

                if(catFacts[counter][0] === "other_pets_friendly"){

                    document.getElementById("other-pets-friendly-span").textContent = propertyValueWords;
                }

                if(catFacts[counter][0] === "playfulness"){

                    document.getElementById("playfulness-span").textContent = propertyValueWords;
                }

                if(catFacts[counter][0] === "shedding"){

                    document.getElementById("shedding-span").textContent = propertyValueWords 
                }
            }

            // randomFact = "The " + breedSelectBox.value + "breed "  + property

            // var funFact = document.getElementById("fun-fact-" + (counter + 1));

            // funFact.textContent = randomFact;
        });
    

    document.getElementById("weight-span").textContent = minimumWeight + " - " + maximumWeight + " pounds";
    document.getElementById("life-expectancy-span").textContent = minimumLifeExpectancy + " - " + maximumLifeExpectancy + " years";
}
// END: same as the function above 