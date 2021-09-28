var options = {
    method: 'GET',
    url: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/',
    params: {query: 'Stockholm'},
    headers: {
      'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'x-rapidapi-key': '6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370'
    }
  };

// trying to use geonames.api to get all city names for a pretext function but am struggling if you can think of another api lets do that
$(function () {
    fetch(options)
    
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                console.log(data.Places[0])
                $( "#toDestination" ).autocomplete({
                    source: data.Places[0]
                  });
            })
        } else {
            console.log("error: " + response.status)
        }
    });
  });


//   date picker Jquery Ui Added but needs styling
  $( function() {
    $( "#toDate" ).datepicker({ dateFormat: 'dd-mm-yy' });
  } );

  $( function() {
    $( "#fromDate" ).datepicker({ dateFormat: 'dd-mm-yy' });
  } );