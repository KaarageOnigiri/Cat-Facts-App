var animalfactapi = "Glyzsc6nvC0nRER4bq2KyA==C6zMqRl90Kuj6Jnx";

  /*var cheetah = ("#cheetah")
  var blackbear = ("#blackbear")
  var tiger = ("#bengaltiger")
  var lion = ("#capelion")

    fetch("https://api.api-ninjas.com/v1/animals?name=" + (animalfactapi))

    .then(function(response){
      return response.json();
    })
      

    var cheetah = ("#cheetah")
    var blackbear = ("#blackbear")
    var tiger = ("#bengaltiger")
    var lion = ("#capelion")

  console.log(response); */

var animalfacts = function(animals) {

  fetch("https://api.api-ninjas.com/v1/animals?name=" + (animalfactapi))
  
  var name = '#cheetah'
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/animals?name=' + name,
    headers: { 'X-Api-Key': $(animalfactapi)},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});

var name = '#blackbear'
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/animals?name=' + name,
    headers: { 'X-Api-Key': $(animalfactapi)},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});

var name = '#bengaltiger'
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/animals?name=' + name,
    headers: { 'X-Api-Key': $(animalfactapi)},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});

var name = '#capelion'
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/animals?name=' + name,
    headers: { 'X-Api-Key': $(animalfactapi)},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
})
};