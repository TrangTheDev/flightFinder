//Currency converter script start
//declaring the variables
var select = document.querySelectorAll('.currency');
var number = $("#number");
var output = $("#output");
var $errorSection = $('#errorSection')

//fetching the URL from franfurter app and getting json data
fetch('https://api.frankfurter.app/currencies').then((data) => data.json())
  .then((data) => {
    display(data);
  });

//function to select the entries from API like entries[0]=AUD[0][0]:Australia Dollor[0][1], entry[1]=  and putting in select variable and making its option eg. we select the currency in two selectors
function display(data) {
  var entries = Object.entries(data);
    for (var i = 0; i < entries.length; i++) {
      select[0].innerHTML += `<option value="${entries[i][0]}"> ${entries[i][0]} : ${entries[i][1]} </option>`;
      select[1].innerHTML += `<option value="${entries[i][0]}"> ${entries[i][0]} : ${entries[i][1]} </option>`;
    }
}

//currency conversion function and added onchange attribe in select tag in index.html
function updatevalue() {
  var currency1 = select[0].value; //putting select enteries in currency1 and value will be stored in fetch URL to get the data
  var currency2 = select[1].value;
  var value = number.val(); //number ia a global variable and this value will be store in fetch URL to get the data
  if (currency1 != currency2) { 
    $errorSection.attr('class', 'hidden')
    convert(currency1, currency2, value); 
  } else {
      $errorSection.attr('class', 'currencyError')
    }
}
function convert(currency1, currency2, value) {
  const host = "api.frankfurter.app";   //site name
  fetch(`https://${host}/latest?amount=${value}&from=${currency1}&to=${currency2}`) //host, amount, from and to keywords are used
    .then((val) => val.json())
    .then((val) => {
      output.val(Object.values(val.rates)[0]); //gloabl variable output is disabled already in index
  });
}
//currency converter script end

//   date picker Jquery Ui Added
  $( function() {
    $( "#toDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
  } );

  $( function() {
    $( "#fromDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
  } );

//Variables to use on flight API
var $carrierList = $(".carrier");
var $flightTimes = $(".time");
var $priceList = $(".price");
var $destination = $("#toDestination");
var $origin = $("#fromDestination");
var $findButton = $("#flight-button");
var $departureDate = $("#fromDate");
var $returnDate = $("#toDate");
var flightDisplay = $('#flightDisplay');
var $errorPage = $('#errorPage');
var submitBtn = $('#calcSubmitBtn');
var $pastSearchesList = $('#pastSearchesList');
var localStorageArray = [];

var originCityID;
var destinationCityID;
var originCityRequest;
var destinationCityRequest;
var cheapestPrice;

//SkyScanner API
var curlQuotes = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/AU/AUD/en-GB/";
var placeList = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/AU/AUD/en-GB/?query=";


async function getQuotes() {

  //Remove previous search
  clearTable();
  clearCalculator();

  //Get inputs from user
  var originCity = $origin.val().charAt(0).toUpperCase() + $origin.val().slice(1);
  var destinationCity = $destination.val().charAt(0).toUpperCase() + $destination.val().slice(1);

  var originCityRequest = placeList + originCity;
  var destinationCityRequest = placeList + destinationCity;

  await getOriginCityId(originCityRequest);
  await getDestinationCityId(destinationCityRequest);

  var requestQuote = curlQuotes + originCityID + "/" + destinationCityID + "/" + $departureDate.val() + "?inboundpartialdate=" + $returnDate.val();

  fetch(requestQuote, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  .then(function(response){
    if (response.ok) {
      return response.json();
    } else {
      flightDisplay.attr('class', 'hidden')
      $errorPage.attr('class', 'errorPage')
      $('#errorCode').text(response.status + '--there may be issues with your search options please double check them and try again to see flight details')
    }
  })
  .then(function(data){
    //Getting all carriers available
    if (data.Carriers.length == 0) {
      flightDisplay.attr('class', 'hidden')
      $errorPage.attr('class', 'errorPage')
      $('#errorCode').text('there are no available flight for these designated dates and destinations')
    }else {
      for(var i=0; i<data.Carriers.length; i++){
        //Display Carrier name
        var $carrier = $("<p>");
        $carrier.css("display","block");
        $carrier.addClass("carrier-option");
        $carrier.text(data.Carriers[i].Name);
        $carrierList.append($carrier);
        $carrierList.append($("<br>"));

      //Display flight time
      var $departureTime = $("<p>");
      $departureTime.css("display","block");
      $departureTime.addClass("flight-time");
      var flightTime = data.Quotes[i].OutboundLeg.DepartureDate.slice(0,10);
      $departureTime.text(flightTime);
      $flightTimes.append($departureTime);
      $flightTimes.append($("<br>"));
  
      //Display price
      var $price = $("<p>");
      $price.css("display","block");
      $price.addClass("flight-price");
      $price.text(data.Currencies[0].Code + data.Currencies[0].Symbol + data.Quotes[i].MinPrice);
      $priceList.append($price);
      $priceList.append($("<br>"));
      cheapestPrice = data.Quotes[0].MinPrice;
      calculateCosts();

      //display origin, destinatiopn andf date on screen (by appending variables to the container)
      }
      storeLocalStorage();
    }
    })
  }


function displayLocalStorage() {
  // loads everything that is in local storage at the beginning, when page is loading
var save = JSON.parse(localStorage.getItem('change'))
  console.log(save)
  for(var i=0; i<save.length;i++){
    var addItem = $('<li> <button class="pastBtn"> ' + save[i].origin + ' to ' + save[i].destination + '</button> </li>')
    $pastSearchesList.append(addItem)
  }
}
function storeLocalStorage() {
  var object = {
    origin : $("#fromDestination").val(),
    destination : $("#toDestination").val(),
    departureDate : $("#fromDate").val(),
    returnDate : $("#toDate").val(),
  }
  localStorageArray.push(object)
  localStorage.setItem('change', JSON.stringify(localStorageArray))
  displayLocalStorage()
  }


async function getOriginCityId(originCityRequest){
        //Display flight time
        var $departureTime = $("<p>");
        $departureTime.css("display","block");
        $departureTime.addClass("flight-time");
        var flightTime = data.Quotes[i].OutboundLeg.DepartureDate.slice(0,10);
        $departureTime.text(flightTime);
        $flightTimes.append($departureTime);
        $flightTimes.append($("<br>"));
    
        //Display price
        var $price = $("<p>");
        $price.css("display","block");
        $price.addClass("flight-price");
        $price.text(data.Currencies[0].Code + data.Currencies[0].Symbol + data.Quotes[i].MinPrice);
        $priceList.append($price);
        $priceList.append($("<br>"));
        cheapestPrice = data.Quotes[0].MinPrice;
      } 


async function getOriginCityId(originCityRequest){ //Function to get airport for origin city

  var response = await fetch(originCityRequest, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  });
  if (response.ok) {
    flightDisplay.attr('class', '')
  var data = await response.json();
  originCityID = data.Places[0].PlaceId;
  } else {
    flightDisplay.attr('class', 'hidden')
    $errorPage.attr('class', 'errorPage')
    $('#errorCode').text(response.status)
  }
}

async function getDestinationCityId(destinationCityRequest){ //Function to get airport for destination city
  var destCity;
  var response = await fetch(destinationCityRequest, {
    "headers": {
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "6fbd183997msh60b69efce9d0b37p193b51jsn4d762a8a5370"
    }
  })
  if(response.ok) {
  var data = await response.json();
  destinationCityID = data.Places[0].PlaceId
  } else {
    flightDisplay.attr('class', 'hidden')
    $errorPage.attr('class', 'errorPage')
    $('#errorCode').text(response.status + '--there may be issues with your search options please double check them and try again to see flight details')
  }
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
$findButton.on('click', getLatLon);
$findButton.on('click', function errorReset() {
  $errorPage.attr('class', 'hidden')
})


// calculator 

var $totalCost = $("#totalCost");
var submitBtnCalculateCost = $('#calcSubmitBtn')

submitBtnCalculateCost.on('click', calculateCosts)

function calculateCosts() {
  var flightCost = cheapestPrice;
  var peopleValue = $('#people option:selected').val()
  if (peopleValue != 0 && flightCost != undefined) {
    var $perPersonFlightCost = (flightCost)*(peopleValue)
    $totalCost.text("Total Cost= " + $perPersonFlightCost);
  } else if(peopleValue == 0){
    $totalCost.text('Please select the amount of people going on this trip')
  }else {
    $totalCost.text("No flights costs found");
  }
}

//Function to clear values on calculators
function clearCalculator() {
  $totalCost.text("");
}

// get latitude and lonitude for major travel options near each area
function getLatLon() {
  var cityName = $destination.val()
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=e7f511b5d71366565851371d14913d91')  
  .then(function(response) {
    if (response.ok) {
      response.json() 
      .then(function(data) {
        var lat = data.coord.lat
        var lon = data.coord.lon
        fetch("https://travel-places.p.rapidapi.com/", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "x-rapidapi-host": "travel-places.p.rapidapi.com",    
            "x-rapidapi-key": "ed72924349mshae50afa305e405fp1e199fjsn0f69786a98fb"   
          },
          "body": JSON.stringify({
            "query": "{ getPlaces(categories:[\"MAJOR\"],lat:" + lat + ",lng:" + lon + ",maxDistMeters:50000) { name,lat,lng,abstract,distance,categories } }"
            })
          })
          .then(function(response) {
            if (response.ok) {
              response.json()
              .then(function(data) {
                for(i = 0; i < 5; i++) {
                  var activityName = $('.activityName' + i)
                  var activityType = $('.activityType' + i)
                  activityName.text(data.data.getPlaces[i].name)
                  activityType.text(data.data.getPlaces[i].categories[0])

                }
              })
            } else {
              flightDisplay.attr('class', 'hidden')
              $errorPage.attr('class', 'errorPage')
              $('#errorCode').text(response.status)
            }
          })
        })
      } else {
        flightDisplay.attr('class', 'hidden')
        $errorPage.attr('class', 'errorPage')
        $('#errorCode').text(response.status)
      }
    })
  }
  displayLocalStorage()