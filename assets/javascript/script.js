
//   date picker Jquery Ui Added but needs styling
  $( function() {
    $( "#toDate" ).datepicker({ dateFormat: 'dd-mm-yy' });
  } );

  $( function() {
    $( "#fromDate" ).datepicker({ dateFormat: 'dd-mm-yy' });
  } );

var $carrierList = $(".carrier");
var $flightTimes = $(".time");
var $priceList = $(".price");
var $destination = $("#toDestination");
var $fromCity = $("#fromDestination");
var $findButton = $(".button");

//SkyScanner API
var request = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/MAD-sky/DXB-sky/2021-11-20?inboundpartialdate=2019-12-01";
var placesList = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/AU/AUD/en-GB/?query=Sydney";
	
fetch(placesList, {
  "headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
	}
})
.then(function(response){
	return response.json();
})
.then(function(data){
  console.log(data);
})

fetch(request, {
  "headers": {
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
  }
})
.then(function(response){
  return response.json();
})
.then(function(data){
  //console.log(data);

  //Selecting a carrier
  var $par = $("<p>");
  $par.addClass("carrier-option");
  $par.text(data.Carriers[0].Name);
  $carrierList.append($par);

  var $takeOffTime = $("<p>");
  $takeOffTime.addClass("flight-times");
  var text = data.Quotes[0].OutboundLeg.DepartureDate;
  $takeOffTime.text(text);
  $flightTimes.append($takeOffTime);

  var $price = $("<p>");
  $price.addClass("flight-price");
  $price.text(data.Quotes[0].MinPrice);
  $priceList.append( $price);
})

$findButton.on("click", function(){
  console.log($fromCity.val());
  console.log($destination.val());
  request = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/MAD-sky/DXB-sky/2021-11-29?inboundpartialdate=2019-12-01";
  fetch(request, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data.Places.length)
    for (i = 0; i < data.Places.length; i++) {
      if (data.Places[i].Name == $destination.val() && data.Places[i].CityName==$fromCity.val()){
        console.log('success')
      } else if (data.Places[i].Name == $destination.val() || data.Places[i].CityName==$fromCity.val()) {
        console.log('missing value to run calculation')
      } else {
        console.log('please enter destination location and current location')
      }
    }
  })
})


// calculator 
var submitBtn = $('#calcSubmitBtn')
submitBtn.on('click', calculateCosts)

function calculateCosts() {
  var flightCost = $('.flight-price').text()
  var peopleValue = $('#people option:selected').val()
  var $flightDivision = $('#flightDivision')
  if (peopleValue != 0) {
    var $perPersonFlightCost = (flightCost)/(peopleValue)
    $flightDivision.text("Flight Cost Per Person= " + $perPersonFlightCost);
  } else {
    $flightDivision.text('Please Select The Amount Of People Going On This Trip')
  }
}
 
