var random = [
    'one',
    'two',
]

// trying to use geonames.api to get all city names for a pretext function but am struggling if you can think of another api lets do that
$(function () {
    cityApiUrl = 'http://api.geonames.org/searchJSON?&username=hypnoticwolf987';

    fetch(cityApiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.geonames)
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