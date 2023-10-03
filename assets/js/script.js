$( document ).ready(function() {

    //fetch animal facts data
    var name = 'cheetah'
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/animals?name=${name}`,
        headers: { 'X-Api-Key': 'oTN7ebBgxdYdqmlR9XhgKQ==pV5wYqLywbggwlPb'},
        contentType: 'application/json',
        success: function(result) {
            console.log(result);
            console.log(name);
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
        
    });
    
    console.log("Animal is "  + name);
    
    
    });