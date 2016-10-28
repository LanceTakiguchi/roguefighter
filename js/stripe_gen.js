// Stripe: Close Checkout on page navigation:
window.addEventListener('popstate', function() {
	handler.close();
});

document.addEventListener("DOMContentLoaded", function(event) { 
// Get the package modal
var package_modal = document.getElementById('package_select');

// Get the button that opens the package modal
var purchase = document.getElementById("purchase");

// Buttons that determine what rank of lives to buy
var officer = $('#officer');
var captain = $('#captain');
var general = $('#general');

// Get the <span> element that closes the package modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, display/open the package modal
purchase.onclick = function() {
  package_modal.style.display = "block";
}
// Needed to call e.preventDefault() in the open_stripe function
var eventObj = null;
// Rank button purchase handler
officer.on('click', function(e) {
    // Hide the package type modal
    package_modal.style.display = "none";
    eventObj = e;
    // Open the Stripe modal (data_amount is in cents)
    open_stripe(199, "Officer Package");
  })
captain.on('click', function(e) {
  package_modal.style.display = "none";
  eventObj = e;
  open_stripe(999, "Captain Package");
})
general.on('click', function(e) {
  package_modal.style.display = "none";
  eventObj = e;
  open_stripe(1999, "General Package");
})
// When the user clicks on <span> (x), close the package modal
span.onclick = function() {
  package_modal.style.display = "none";
}
// When the user clicks anywhere outside of the package modal, close it
window.onclick = function(event) {
  if (event.target == package_modal) {
    package_modal.style.display = "none";
  }
}

// Stripe modal settings
function open_stripe(data_amount, info){
  handler.open({
    name: 'Star Wars | Rogue Fighter',
    description: info,
    amount: data_amount
  });
  eventObj.preventDefault();
} 
});