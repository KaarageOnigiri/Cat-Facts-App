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
//cards container and default hide
var cardsContainer = document.querySelector('#cards-container');
cardsContainer.style.display = 'none';

var errorMessage = document.getElementById("error-message");
var errorFound = false;

var breedTitle = document.getElementById("cat-breed-name")

var errorModalCloseButton = document.getElementById("error-modal-close-button");

errorModalCloseButton.addEventListener("click", closeErrorModal);

fetchButton.addEventListener("click", fetchBreedImages);
fetchButton.addEventListener("click", fetchBreedFacts);

async function fetchBreedImages(){
    
    
    //show cards container and hide banner
    var heroContainer = document.querySelector('#cat-hero');
    heroContainer.style.display = 'none';
    cardsContainer.style.display = 'block';

    var imageURLs = [];

    var fetchAttempts = 0;

    breedTitle.classList.remove("is-hidden");
    breedTitle.classList.remove("is-block");

    var breedDescription = breedDescriptions.find(breed => breed.name === breedSelectBox.options[breedSelectBox.selectedIndex].text);

    document.getElementById("cat-breed-description").textContent = breedDescription.description;
    breedTitle.textContent = "Breed: " + breedDescription.name;

    var counter1 = 0;

    while (counter1 < 3){






        /* Unfortunately, pictures Hb2N6tYTJ.jpg and uvt2Psd9O.jpg are the same pictures but have two different IDs.  This is causing duplicate pictures
        because I have no way of filtering out one of the above, since the IDs are the same!!*/

        var duplicateImage = false;
        var fetchURL = "https://api.thecatapi.com/v1/images/search?&limit=1&breed_ids=" + breedSelectBox.value + ","

        await fetch(fetchURL).then(async function(response){

            var data = checkForBadFetch(response);

            if(data !== null){
    
                return data;
            }

        }).then(function(data){

            var imageURL = data[0].url;

            imageURLs.push(imageURL);

            if(counter1 > 0){

                var counter2 = 0

                /* The purpose of this for loop is to eliminate duplicate images. */
                for(counter2 = 0; counter2 < counter1; counter2++){
                
                    /* Unfortunately, pictures Hb2N6tYTJ.jpg, uvt2Psd9O.jpg, MJWtDz75E.jpg, and g1j3wRjgx.jpg (a picture of an orange tabby cat laying on a bed or couch, 
                    looking rather sad and looking up, toward the camera) are the same actual images but have four different IDs.  As such, the normal method of comparing the IDs to 
                    elminiate duplicates doesn't work for those four images, so I filtered them out manually. Additionally, two of the aforementioned images are returned when searching for
                    Abyssinian cats, and the other two are returned when searching for Agean cats. I have no idea why this is, other than it being a fault of the Cat API.*/
                    if(imageURLs[counter1] === imageURLs[counter2] || imageURLs[0] === "assets/images/black-screen.JPG" || 
                    (imageURLs[counter1] === "https://cdn2.thecatapi.com/images/Hb2N6tYTJ.jpg" && imageURLs[counter2] === "https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg") || 
                    (imageURLs[counter2] === "https://cdn2.thecatapi.com/images/Hb2N6tYTJ.jpg" && imageURLs[counter1] === "https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg") || 
                    (imageURLs[counter1] === "https://cdn2.thecatapi.com/images/MJWtDz75E.jpg" && imageURLs[counter2] === "https://cdn2.thecatapi.com/images/g1j3wRjgx.jpg") || 
                    (imageURLs[counter2] === "https://cdn2.thecatapi.com/images/MJWtDz75E.jpg" && imageURLs[counter1] === "https://cdn2.thecatapi.com/images/g1j3wRjgx.jpg")) {
                        
                        imageURLs.splice(imageURLs.length - 1, 1);
                        duplicateImage = true;
                        fetchAttempts++;

                        /* There are a couple of cat breeds that only have one image available without using the API key, so for those, I decided
                        to put a solid black image on each other image card in place of each of the other images. */
                        if(fetchAttempts === 15){

                            document.getElementById("img-" + (counter1 + 1)).src = "assets/images/black-screen.JPG"
                            imageURLs.push("assets/images/black-screen.JPG")
                            fetchAttempts = 0;
                            counter1++;

                        }

                        break;
                    }
                }

                if(counter2 === counter1){

                    document.getElementById("img-" + (counter1 + 1)).src = imageURL;   
                }

            } else {

                document.getElementById("img-" + (counter1 + 1)).src = imageURL;
            }

            if(duplicateImage === false){
                counter1++;
            }

        }).catch(function(error){

            catchError(error);
            errorFound = true;
            
        });

        if(errorFound === true){
            break;
        }
    }
}

async function fetchBreedFacts(){

    var hasIntelligenceStatistic = false;
    var maximumLifeExpectancy = "";
    var minimumLifeExpectancy = "";
    var maximumWeight = "";
    var minimumWeight = "";

    var selectedBreed = breedSelectBox.options[breedSelectBox.selectedIndex].text;

   var doctoredSelectedBreed = selectedBreed.replace(new RegExp(" ", 'g'), '+');

    var APIKey = "+v2rPqjZgnuAusp2fgCqLQ==LL2wNNiBCErIm3Fj";

        await fetch('https://api.api-ninjas.com/v1/cats?name=' + doctoredSelectedBreed, {
            headers: {
            'X-Api-Key': APIKey
            }

        }).then(function(response){

            var data = checkForBadFetch(response, 1);

            if(data !== null){

                return data;
            }

        }).then(function(data){

            console.log(data);

            var catFacts = Object.entries(data[0])

            removefromResults(catFacts, "image_link");
            removefromResults(catFacts, "name");
            removefromResults(catFacts, "general_health");

            var randomFact = "";

            for(var counter = 0; counter < catFacts.length; counter++){
                
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

                    document.getElementById("intelligence-span").textContent = propertyValueWords;
                    hasIntelligenceStatistic = true;

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
        }).catch(function(error){

            catchError(error, 1);
        });
    

    document.getElementById("weight-span").textContent = minimumWeight + " - " + maximumWeight + " pounds";
    document.getElementById("life-expectancy-span").textContent = minimumLifeExpectancy + " - " + maximumLifeExpectancy + " years";

    var intelligenceRanking = document.getElementById("intelligence");
    if(hasIntelligenceStatistic === false){

        intelligenceRanking.classList.add("is-hidden");
        intelligenceRanking.classList.remove("is-block");

    } else {

        intelligenceRanking.classList.remove("is-hidden");
        intelligenceRanking.classList.add("is-block");
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


function openModal(){
    
    document.getElementById("error-modal").classList.add('is-active');
    document.getElementById("error-modal").classList.remove('is-hidden');
}

function closeErrorModal(){

    document.getElementById("error-modal").classList.remove('is-active');
    document.getElementById("error-modal").classList.add('is-hidden');
}

function catchError(error, flag = 0){

    document.getElementById("error-modal").classList.add('is-active');
    document.getElementById("error-modal").classList.remove('is-hidden');
    
    

    if(flag === 1){

        errorMessage.textContent = error.message + "!!  This happened when fetching cat facts.";

    } else {

        errorMessage.textContent = error.message + "!!  This happened when fetching cat images.";
    }
}

function checkForBadFetch(response, flag = 0){

    if(response.status !== 200){

        document.getElementById("error-modal").classList.add('is-active');
        document.getElementById("error-modal").classList.remove('is-hidden');
        
        if(flag === 1){

            errorMessage.textContent = error.message + "!!  This happened when fetching cat facts.";
    
        } else {
    
            errorMessage.textContent = error.message + "!!  This happened when fetching cat images.";
        }

        return null;

    } else {

        return response.json();
    }
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

            localStorage.setItem("previousUserSearch", previousUserSearch);

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

//Cat sound button 
 
const emitSound = () => {
    var Catfight = "assets/cat-sounds/Cat-fight.mp3";
    var Catgrowl = "assets/cat-sounds/Cat-growl.mp3";
    var Catpurr = "assets/cat-sounds/Cat-purr.mp3";
    var kittenmeow = "assets/cat-sounds/kitten-meow.mp3";

    const animalsound = new Audio(kittenmeow);
    animalsound.load();
    animalsound.play();

    console.log('test sound -> ', animalsound);
}

var speakerBtn = document.getElementById("animal-sound")
speakerBtn.addEventListener("click", emitSound);


