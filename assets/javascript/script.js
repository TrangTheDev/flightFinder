//   date picker Jquery Ui Added but needs styling
  $( function() {
    $( "#toDate" ).datepicker({ dateFormat: 'dd-mm-yy' });
  } );

  $( function() {
    $( "#fromDate" ).datepicker({ dateFormat: 'dd-mm-yy' });
  } );

// calculator 
var submitBtn = $('#calcSubmitBtn')
submitBtn.on('click', calculateCosts)

function calculateCosts() {
    var flightCost = 500
    var peopleValue = $('#people option:selected').val()

    perPersonCost = (flightCost)/(peopleValue)
    console.log(perPersonCost)
}