var $carrierList = $(".carrier");
var $flightTimes = $(".time");
var $priceList = $(".price");

//SkyScanner API
var request = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/MAD-sky/DXB-sky/2021-11-20?inboundpartialdate=2019-12-01";

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
  console.log(data);

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
  $price.addClass = ("flight-price");
  $price.text(data.Quotes[0].MinPrice);
  $priceList.append( $price);
})
