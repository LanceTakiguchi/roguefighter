// Stripe: Close Checkout on page navigation:
window.addEventListener('popstate', function() {
	handler.close();
});

document.addEventListener("DOMContentLoaded", function(event) { 
// Get the package modal
var modal = document.getElementById('myModal');

// Get the button that opens the package modal
var btn = document.getElementById("myBtn");

// Buttons that determine what rank of lives to buy
var officer = document.getElementById("officer");
var captain = document.getElementById("captain");
var general = document.getElementById("general");

// Get the <span> element that closes the package modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, display/open the package modal
btn.onclick = function() {
  modal.style.display = "block";
}

// Rank button purchase handler
officer.onclick = function() {
    // Hide the package type modal
    modal.style.display = "none";
    // Open the Stripe modal
    open_stripe(199);
  }
  captain.onclick = function() {
    modal.style.display = "none";
    open_stripe(999);
  }
  general.onclick = function() {
    modal.style.display = "none";
    open_stripe(1999);
  }
// When the user clicks on <span> (x), close the package modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the package modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Stripe modal settings
function open_stripe(data_amount){
  handler.open({
    name: 'C10 | 8 Bit Bullet Hell',
    description: '2 widgets',
    amount: data_amount
  });
  e.preventDefault();
} 
});