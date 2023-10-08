var fetchButton = document.getElementById("fetch-breed");
var breedSelectBox = document.getElementById("breed-select");
var cardOne = document.getElementById("card-1-content");
var cardTwo = document.getElementById("card-2-content");
var cardThree = document.getElementById("card-3-content");

//cards container and default hide
var cardsContainer = document.querySelector('#cards-container-outer');
cardsContainer.style.display = 'none';

var errorMessage = document.getElementById("error-message");
var errorFound = false;

var breedTitle = document.getElementById("cat-breed-name")

var errorModalCloseButton = document.getElementById("error-modal-close-button");

errorModalCloseButton.addEventListener("click", closeErrorModal);

fetchButton.addEventListener("click", fetchBreedImages);
fetchButton.addEventListener("click", fetchBreedFacts);
fetchButton.addEventListener("click", fetchandDisplayRandomCatFact);

cardOne.addEventListener("click", flipCard);
cardTwo.addEventListener("click", flipCard);
cardThree.addEventListener("click", flipCard);

var searchHistory = document.getElementById("search-history");

// BEGIN: calling local storage
var previousUserSearch1 = JSON.parse(localStorage.getItem("previousUserSearch1"));
var previousUserSearch2 = JSON.parse(localStorage.getItem("previousUserSearch2"));

// console.log(document.getElementById("breed-select").children[1].value);
function initiation() {
    console.log(previousUserSearch1, previousUserSearch2);
    if (!previousUserSearch1) {
        previousUserSearch1 = [];
        previousUserSearch2 = [];
        localStorage.setItem("previousUserSearch1",  JSON.stringify(previousUserSearch1));
        localStorage.setItem("previousUserSearch2",  JSON.stringify(previousUserSearch2));
    }
    console.log(previousUserSearch2.length);
    displayPreviousSearches();
}

initiation();
// END: calling local storage


async function fetchBreedImages(){
    
    //show cards container and hide banner
    var heroContainer = document.querySelector('#cat-hero');
    heroContainer.style.display = 'none';
    cardsContainer.style.display = 'block';

    imageURLs = [];

    var fetchAttempts = 0;

    breedTitle.classList.remove("is-hidden");
    breedTitle.classList.remove("is-block");

    var breedDescription = breedDescriptions.find(breed => breed.name === breedSelectBox.options[breedSelectBox.selectedIndex].text);

    document.getElementById("cat-breed-description").textContent = breedDescription.description;
    breedTitle.textContent = "Breed: " + breedDescription.name;

    var counter1 = 0;

    /* This while loop makes certain the system fetches three images.*/
    while (counter1 < 3){

        var duplicateImage = false;

        var fetchURL = "https://api.thecatapi.com/v1/images/search?&limit=1&breed_ids=" + breedSelectBox.value + ","

        // Here is the API call to retrieve an image.
        await fetch(fetchURL).then(async function(response){

            var data = await checkForBadFetch(response);

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
                
                    /* This if statement compares the current image to the previous images to make sure they are unique.  Unfortunately, pictures Hb2N6tYTJ.jpg, uvt2Psd9O.jpg, MJWtDz75E.jpg, 
                    and g1j3wRjgx.jpg (a picture of an orange tabby cat laying on a bed or couch, looking rather sad and looking up, toward the camera) are the same actual images
                    but have four different IDs.  As such, the normal method of comparing the IDs to elminiate duplicates doesn't work for those four images, so I filtered them out manually.
                    Additionally, two of the aforementioned images are returned when searching for Abyssinian cats, and the other two are returned when searching for Agean cats. 
                    I have no idea why this is, other than it being a fault of the Cat API.  */
                    if(imageURLs[counter1] === imageURLs[counter2] || imageURLs[0] === "assets/images/black-screen.JPG" || 
                    (imageURLs[counter1] === "https://cdn2.thecatapi.com/images/Hb2N6tYTJ.jpg" && imageURLs[counter2] === "https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg") || 
                    (imageURLs[counter2] === "https://cdn2.thecatapi.com/images/Hb2N6tYTJ.jpg" && imageURLs[counter1] === "https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg") || 
                    (imageURLs[counter1] === "https://cdn2.thecatapi.com/images/MJWtDz75E.jpg" && imageURLs[counter2] === "https://cdn2.thecatapi.com/images/g1j3wRjgx.jpg") || 
                    (imageURLs[counter2] === "https://cdn2.thecatapi.com/images/MJWtDz75E.jpg" && imageURLs[counter1] === "https://cdn2.thecatapi.com/images/g1j3wRjgx.jpg")) {
                        
                        imageURLs.splice(imageURLs.length - 1, 1);
                        duplicateImage = true;
                        fetchAttempts++;

                        /* There are a couple of cat breeds that only have one image available without using the API key, so for those, I decided
                        to put a black image on each of the other image cards in place of each of the other images. */
                        if(fetchAttempts === 15){

                            document.getElementById("img-" + (counter1 + 1)).src = "assets/images/black-screen.JPG"
                            imageURLs.push("assets/images/black-screen.JPG")
                            fetchAttempts = 0;
                            counter1++;

                        }

                        break;
                    }
                }

                //If the program gets through the second 'for' loop successfully, the latest tested image will be added to the page.
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
        });
    }
    // if (!breedSelectBox.value === previousUserSearch1[0] || )
    if (breedSelectBox.value ===  previousUserSearch1[0] || breedSelectBox.value ===  previousUserSearch1[1] || breedSelectBox.value ===  previousUserSearch1[2] || breedSelectBox.value ===  previousUserSearch1[3] || breedSelectBox.value ===  previousUserSearch1[4]) {
        return;
    }
    else {
        previousUserSearch1.unshift(breedSelectBox.value);
        localStorage.setItem("previousUserSearch1", JSON.stringify(previousUserSearch1));
    }
}

// This function fetchs the facts about the various cat breeds from the Cats API.
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

            /* This for loop goes through all the relevant facts from the returned data and displays them or else sets variables so then
            they can be displayed later.*/
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

    if (doctoredSelectedBreed ===  previousUserSearch2[0] || doctoredSelectedBreed ===  previousUserSearch2[1] || doctoredSelectedBreed ===  previousUserSearch2[2] || doctoredSelectedBreed ===  previousUserSearch2[3] || doctoredSelectedBreed ===  previousUserSearch2[4]) {
        return;
    }
    else {
        previousUserSearch2.unshift(doctoredSelectedBreed);
        localStorage.setItem("previousUserSearch2", JSON.stringify(previousUserSearch2));
        displayPreviousSearches();
    }
}

/* There were a few cat facts I decided to remove from the returned Cats API data.
This function helps to accomplish that.*/
function removefromResults(catFacts, propertyNameToRemove){

    for (let counter = 0; counter < catFacts.length; counter++) {
        
        if (catFacts[counter][0] === propertyNameToRemove) {

          catFacts.splice(counter, 1);
        }
    }
}

// This function flips a card when the card is clicked.
function flipCard(event){

    switch(event.currentTarget){

        case cardOne:
            var toggleOne = document.getElementById("toggle-1");
            toggleOne.checked = !toggleOne.checked;
            break;
        case cardTwo:
            var toggleTwo = document.getElementById("toggle-2");
            toggleTwo.checked = !toggleTwo.checked;
            break;
        case cardThree:
            var toggleThree = document.getElementById("toggle-3");
            toggleThree.checked = !toggleThree.checked;
            break;
        default:
            break;
    }
}

// This function changes the numbers in the returned data from the Cats API from (1 to 5) to ('very low' to 'very high')
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

async function fetchandDisplayRandomCatFact(){

    var funFact3 = document.getElementById("fun-fact-3");

    animalFactsApiUrl = "https://cat-fact.herokuapp.com/facts";

    await fetch(animalFactsApiUrl, {

        method: "GET",

    }).then(async function(response) {
        
        var data = await checkForBadFetch(response);

        if(data !== null){

            var randomNumber = Math.floor(Math.random() * data.length)
            funFact3.textContent = data[randomNumber].text;
        }

    }).catch(function(error){

        catchError(error, 2);
    });
}

// This function closes the error modal if it is displayed after an error is thrown or returned.
function closeErrorModal(){

    document.getElementById("error-modal").classList.remove('is-active');
    document.getElementById("error-modal").classList.add('is-hidden');
}

// This function displays the error modal if an error is returned from a fetch call.
function catchError(error, flag = 0){

    document.getElementById("error-modal").classList.add('is-active');
    document.getElementById("error-modal").classList.remove('is-hidden');
    
    

    if(flag === 1){

        errorMessage.textContent = error.message + "!!  This happened when fetching cat statistics.";

    } else if(flag === 2){

        errorMessage.textContent = error.message + "!! This happened when fetching a random cat fact."

    } else {

        errorMessage.textContent = error.message + "!!  This happened when fetching cat images."
    }

    errorMessage.textContent += "This tends to happen when submitting large numbers of requests at once.  Please wait a few moments and try again.";
}

// If there is a bad fetch response (I defined that to mean something other than 200), the system displays the error modal.
function checkForBadFetch(response, flag = 0){

    if(response.status !== 200){

        document.getElementById("error-modal").classList.add('is-active');
        document.getElementById("error-modal").classList.remove('is-hidden');
        
        if(flag === 1){

            errorMessage.textContent = response.status + "!!  This happened when fetching cat statistics.";
    
        } else if(flag === 2){

            errorMessage.textContent = response.status + "!! This happened when fetching a random cat fact."

        } else {
    
            errorMessage.textContent = response.status + "!!  This happened when fetching cat images.";
        }

        return null;

    } else {

        return response.json();
    }
}

// END: random cat facts section

// this function displayed the previous 5 cats that user selected
function displayPreviousSearches() {
    if (previousUserSearch2.length < 6) {
        for (i = 0; i < previousUserSearch2.length; i++) {
            
            var searchHistoryLists = document.createElement("li");

            if (previousUserSearch2[i].split("+")[1] === undefined) {
                searchHistoryLists.textContent = previousUserSearch2[i].split("+")[0];
    
            }
            else {
                searchHistoryLists.textContent = previousUserSearch2[i].split("+")[0] + " " + previousUserSearch2[i].split("+")[1];
            }
            appendChildrenElements(searchHistoryLists, i);

        }
        
        if (previousUserSearch2.length === 2) {
            if (searchHistory.children.length === 2) {
                return;
            }
            searchHistory.children[2].remove();
        }
        if (previousUserSearch2.length === 3) {
            if (searchHistory.children.length === 3) {
                return;
            }
            searchHistory.children[4].remove();
            searchHistory.children[3].remove();
        }
        if (previousUserSearch2.length === 4) {
            if (searchHistory.children.length === 4) {
                return;
            }
            searchHistory.children[6].remove();
            searchHistory.children[5].remove();
            searchHistory.children[4].remove();
        }
        if (previousUserSearch2.length === 5) {
            if (searchHistory.children.length === 5) {
                return;
            }
            searchHistory.children[8].remove();
            searchHistory.children[7].remove();
            searchHistory.children[6].remove();
            searchHistory.children[5].remove();
        }
        return;
    }

    for (x = 0; x < 5 && x < previousUserSearch2.length; x++) {
        var searchHistoryLists = document.createElement("li");

        if (previousUserSearch2[x].split("+")[1] === undefined) {
            searchHistoryLists.textContent = previousUserSearch2[x].split("+")[0];

        }
        else {
            searchHistoryLists.textContent = previousUserSearch2[x].split("+")[0] + " " + previousUserSearch2[x].split("+")[1];
        } 
        appendChildrenElements(searchHistoryLists, x);
    }
    
    console.log(searchHistory.children.length);
    if (searchHistory.children.length >= 10) {
        for (y = 4; y >= 0; y--) {
            searchHistory.children[y].remove();
        }
    }
}

function appendChildrenElements(searchHistoryLists, x) {

    searchHistoryLists.setAttribute("value", previousUserSearch1[x]);
    // add css styling here.
    searchHistoryLists.setAttribute("class", "custom-search-history-button button my-1"); 
    searchHistoryLists.addEventListener("click", assignPreviousSearches);
    searchHistory.appendChild(searchHistoryLists);
}

function assignPreviousSearches(event) {
    console.log(previousUserSearch1[0], previousUserSearch2[0]);
    var catName = event.target.textContent;
    var catNameValue = event.target.getAttribute("value");

    fetchBreedClickedImages(catNameValue, catName);
    fetchBreedClickedFacts(catName);
}

// this function is the same as the ones above, the only difference is that
// I changed the bring in the clicked value and replace the one searched value
async function fetchBreedClickedImages(catNameValue, catName){
    
    //show cards container and hide banner
    var heroContainer = document.querySelector('#cat-hero');
    heroContainer.style.display = 'none';
    cardsContainer.style.display = 'block';

    var imageURLs = [];

    var fetchAttempts = 0;

    breedTitle.classList.remove("is-hidden");
    breedTitle.classList.remove("is-block");
    
    var breedDescription = breedDescriptions.find(breed => breed.name === catName);

    document.getElementById("cat-breed-description").textContent = breedDescription.description;
    breedTitle.textContent = "Breed: " + breedDescription.name;

    var counter1 = 0;

    while (counter1 < 3){
        /* Unfortunately, pictures Hb2N6tYTJ.jpg and uvt2Psd9O.jpg are the same pictures but have two different IDs.  This is causing duplicate pictures
        because I have no way of filtering out one of the above, since the IDs are the same!!*/

        var duplicateImage = false;
        var fetchURL = "https://api.thecatapi.com/v1/images/search?&limit=1&breed_ids=" + catNameValue + ","

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
    // if (!breedSelectBox.value === previousUserSearch1[0] || )
    if (breedSelectBox.value ===  previousUserSearch1[0] || breedSelectBox.value ===  previousUserSearch1[1] || breedSelectBox.value ===  previousUserSearch1[2] || breedSelectBox.value ===  previousUserSearch1[3] || breedSelectBox.value ===  previousUserSearch1[4]) {
        return;
    }
    else {
        previousUserSearch1.unshift(breedSelectBox.value);
        localStorage.setItem("previousUserSearch1", JSON.stringify(previousUserSearch1));
    }
}

async function fetchBreedClickedFacts(catName){

    var hasIntelligenceStatistic = false;
    var maximumLifeExpectancy = "";
    var minimumLifeExpectancy = "";
    var maximumWeight = "";
    var minimumWeight = "";

    var selectedBreed = breedSelectBox.options[breedSelectBox.selectedIndex].text;

   var doctoredSelectedBreed = selectedBreed.replace(new RegExp(" ", 'g'), '+');

    var APIKey = "+v2rPqjZgnuAusp2fgCqLQ==LL2wNNiBCErIm3Fj";

        await fetch('https://api.api-ninjas.com/v1/cats?name=' + catName, {
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



        intelligenceRanking.classList.remove("is-hidden");
        intelligenceRanking.classList.add("is-block");
    }
    if (doctoredSelectedBreed ===  previousUserSearch2[0] || doctoredSelectedBreed ===  previousUserSearch2[1] || doctoredSelectedBreed ===  previousUserSearch2[2] || doctoredSelectedBreed ===  previousUserSearch2[3] || doctoredSelectedBreed ===  previousUserSearch2[4]) {
        return;
    }
    else {
        previousUserSearch2.unshift(doctoredSelectedBreed);
        localStorage.setItem("previousUserSearch2", JSON.stringify(previousUserSearch2));
        displayPreviousSearches();
    }
}