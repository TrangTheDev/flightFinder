
//   date picker Jquery Ui Added but needs styling
  $( function() {
    $( "#toDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
  } );

  $( function() {
    $( "#fromDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
  } );

var $carrierList = $(".carrier");
var $flightTimes = $(".time");
var $priceList = $(".price");
var $destination = $("#toDestination");
var $origin = $("#fromDestination");
var $findButton = $(".button");
var $departureDate = $("#fromDate");
var $returnDate = $("#toDate");

var originCityID;
var destinationCityID;
var originCityRequest;
var destinationCityRequest;

//SkyScanner API
var cURL_quotes = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/AU/AUD/en-GB/";
var placeList = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/AU/AUD/en-GB/?query=";

function getQuotes() {

  //Get inputs from user
  var originCity = $origin.val().charAt(0).toUpperCase() + $origin.val().slice(1);
  var destinationCity = $destination.val().charAt(0).toUpperCase() + $destination.val().slice(1);

  var originCityRequest = placeList + originCity;
  var destinationCityRequest = placeList + destinationCity;

  pleaseWait();
  
  console.log(originCityID);

  var requestQuote = cURL_quotes + originCityID + "/" + destinationCityID + "/" + $departureDate.val() + "?inboundpartialdate=" + $returnDate.val();
  console.log(requestQuote);

  fetch(requestQuote, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  .then(function(response){
    return response.json();
  })
  .then(function(data){
  
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
}

async function pleaseWait() {
  await getOriginCityId();
  getDestinationCityId();
}

async function getOriginCityId(){
  var originCity;

  fetch(originCityRequest, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    //Get origin city ID to be used searching for quotes
    originCity = data.Places[0].PlaceId;
    console.log(originCity);
    originCityID = originCity;
    return;
  })
}

function getDestinationCityId(){
  var destCity;
  fetch(destinationCityRequest, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    //Get destination city ID to be used searching for quotes
    destCity = data.Places[0].PlaceId;
    console.log(destCity);
    destinationCityID = destCity;
  })
}

$findButton.on("click", getQuotes);



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
 
