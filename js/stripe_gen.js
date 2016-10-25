// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
	handler.close();
});
document.addEventListener("DOMContentLoaded", function(event) { 
	document.getElementById('customButton').addEventListener('click', function(e) {
  // Open Checkout with further options:
  handler.open({
  	name: 'C10 | 8 Bit Bullet Hell',
  	description: '2 widgets',
  	amount: 2000
  });
  e.preventDefault();
});
});