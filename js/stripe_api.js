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
  }
});

