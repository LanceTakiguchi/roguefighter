// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
	handler.close();
});

document.addEventListener("DOMContentLoaded", function(event) { 
	document.getElementById('customButton').addEventListener('click', function(e) {
  // Open Checkout with further options:
  var data_amount = null;
  $( "#dialog-confirm" ).dialog({
  	resizable: false,
  	height: "auto",
  	width: 400,
  	modal: true,
  	buttons: {
  		"Rebel": function() {
  			open_stripe(299);
  			$( this ).dialog( "close" );
  		},
  		"General": function() {
  			open_stripe(1999);
  			$( this ).dialog( "close" );
  		},
  		Cancel: function() {
  			$( this ).dialog( "close" );
  		}
  	}
  });
  function open_stripe(data_amount){
  	handler.open({
  		name: 'C10 | 8 Bit Bullet Hell',
  		description: '2 widgets',
  		amount: data_amount
  	});
  	e.preventDefault();
  }	
} );
});
// var data_amount = null;
// data_amount = parseInt(prompt("Please input how much you want to donate"));
// if(!data_amount){
// 	data_amount = 999;
// }
//   handler.open({
//   	name: 'C10 | 8 Bit Bullet Hell',
//   	description: '2 widgets',
//   	amount: data_amount
//   });
//   e.preventDefault();
// });
