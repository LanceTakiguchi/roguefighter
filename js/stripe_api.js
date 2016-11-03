/**
 * JS code to run Stripe's checkout
 */
var handler = StripeCheckout.configure({
  key: 'pk_test_FdGFoKV6xdSErG0cg7GNrKz3',
  // image: 'imgs/rebel.png', // WARNING: insure image. Needs to be loaded over HTTPS
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
      var stripeData = {
          stripeToken: token.id,
          chargeAmount: games_amount
      }
      chargeUser(stripeData);
      display_games();
  }
});

// Just to test displaying games purchased onto the DOM
function display_games(){
	// Dom's displayed amount of games
	var games_dom = $("#game_count");
	// Grab the current amount of games pre-purchase
    var cur = parseInt(games_dom.text());
    // The amount of games to add onto existing amount
    var add_games = 0;
    // Convert money amount into an amount of games
    switch(games_amount){
    	case 199:
    		add_games = 20;
    		break;
    	case 999:
    		add_games = 125;
    		break;
    	case 1999:
    		add_games = 300;
    		break;
    }
    // Add on the purchased games to existing amount
    cur += add_games;
    // Change the number on the DOM
    games_dom.text(cur);
}