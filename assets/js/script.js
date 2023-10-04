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

    for(var counter = 0; counter < 3; counter++){

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
            

            var randomFactIndex = Math.floor(Math.random() * catFacts.length);

            var randomFact = "";

            var propertyValue = catFacts[randomFactIndex][1];

            var propertyValueWords = setPropertyValueWords(propertyValue)

            

            if(catFacts[randomFactIndex][0] === "children_friendly"){

                property = "has a " + propertyValueWords + "amount of friendliness towards children." 
            }

            if(catFacts[randomFactIndex][0] === "family_friendly"){

                property = "has a " + propertyValueWords + "amount of affection towards its owners" 
            }

            if(catFacts[randomFactIndex][0] === "grooming"){

                property = "requires a " + propertyValueWords + "amount of grooming work." 
            }

            if(catFacts[randomFactIndex][0] === "intelligence"){

                property = "has a " + propertyValueWords + "level of intelligence." 
            }

            if(catFacts[randomFactIndex][0] === "length"){

                property = "has a length of " + data[randomFactIndex] + "." 
            }

            if(catFacts[randomFactIndex][0] === "max_life_expectancy"){

                property = "has a maximum life expectancy of " + data[randomFactIndex] + " years."
            }

            if(catFacts[randomFactIndex][0] === "max_weight"){

                property = " has a maximum weight of  " + data[randomFactIndex] + "pounds." 
            }

            if(catFacts[randomFactIndex][0] === "min_life_expectancy"){

                property = "has a minimum life expectancy of " + data[randomFactIndex] + " years."
            }

            if(catFacts[randomFactIndex][0] === "min_weight"){

                property = "has a minimum weight of " + data[randomFactIndex] + " pounds." 
            }

            if(catFacts[randomFactIndex][0] === "origin"){

                property = "originates from  " + data[randomFactIndex] + "." 
            }

            if(catFacts[randomFactIndex][0] === "other_pets_friendly"){

                property = "has a" + propertyValueWords + "amount of friendliness towards other pets." 
            }

            if(catFacts[randomFactIndex][0] === "playfulness"){

                property = "has a" + propertyValueWords + "level of playfulness." 
            }

            if(catFacts[randomFactIndex][0] === "shedding"){

                property = "sheds a " + propertyValueWords + "amount of hair." 
            }

            randomFact = "The " + breedSelectBox.value + "breed "  + property

            var funFact = document.getElementById("fun-fact-" + (counter + 1));

            funFact.textContent = randomFact;
        });
    }
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

// below are random cat facts section

var factTitle3 = document.getElementById("fact-title-3");

var funFact3 = document.getElementById("fun-fact-3");

animalFactsApiUrl = "https://cat-fact.herokuapp.com/facts";

fetch(animalFactsApiUrl, {
    method: "GET",
})
.then(function(response) {
    if (response.ok) {
        response.json().then(function(data) {
            console.log(data);
            displayRandomCatFactsData(data);
        })
    }
    else {
        alert("Error: " + response.status);
    }
})

function displayRandomCatFactsData(data) {
    console.log(Math.floor(Math.random() * data.length));
    var randomNumber = Math.floor(Math.random() * data.length)
    funFact3.textContent = data[randomNumber].text;
}

//function for Cat Hero image
//function initialCatImg() {
    var heroContainer = document.querySelector('#cat-hero');
    //heroContainer.styled.display = 'none';
    var heroImg = document.createElement('i');
    heroImg.setAttribute('src', "./assets/cat-imgs/catimg2.jpg");
    heroImg.setAttribute('alt', "Cat Image from https://unsplash.com/s/photos/cat");
    heroContainer.appendChild(heroImg);
//

initialCatImg();