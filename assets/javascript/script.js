
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


async function getQuotes() {

  //Remove previous search
  clearTable();

  //Get inputs from user
  var originCity = $origin.val().charAt(0).toUpperCase() + $origin.val().slice(1);
  var destinationCity = $destination.val().charAt(0).toUpperCase() + $destination.val().slice(1);

  var originCityRequest = placeList + originCity;
  var destinationCityRequest = placeList + destinationCity;

  await getOriginCityId(originCityRequest);
  await getDestinationCityId(destinationCityRequest);

  var requestQuote = cURL_quotes + originCityID + "/" + destinationCityID + "/" + $departureDate.val() + "?inboundpartialdate=" + $returnDate.val();

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
  
    //Getting all carriers available
    for(var i=0; i<data.Carriers.length; i++){
      //Display Carrier name
      var $carrier = $("<li>");
      $carrier.css("display","block");
      $carrier.addClass("carrier-option");
      $carrier.text(data.Carriers[i].Name);
      $carrierList.append($carrier);

      //Display flight time
      var $departureTime = $("<li>");
      $departureTime.css("display","block");
      $departureTime.addClass("flight-time");
      $departureTime.text(data.Quotes[i].OutboundLeg.DepartureDate);
      $flightTimes.append($departureTime);
  
      //Display price
      var $price = $("<li>");
      $price.css("display","block");
      $price.addClass("flight-price");
      $price.text(data.Currencies[0].Code + data.Currencies[0].Symbol + data.Quotes[i].MinPrice);
      $priceList.append($price);
    }
  })
}



async function getOriginCityId(originCityRequest){

  var response = await fetch(originCityRequest, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  });

  var data = await response.json();
  originCityID = data.Places[0].PlaceId;
}

async function getDestinationCityId(destinationCityRequest){
  var destCity;
  var response = await fetch(destinationCityRequest, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  var data = await response.json();
  destinationCityID = data.Places[0].PlaceId
}

//Remove all children to do a new search
function clearTable() {
  if($carrierList.is(":parent")){
    $carrierList.empty();
  }
  if($flightTimes.is(":parent")){
    $flightTimes.empty();
  }
  if($priceList.is(":parent")){
    $priceList.empty();
  }
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
 
