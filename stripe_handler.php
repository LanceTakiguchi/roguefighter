<?php
//require_once('mysql_connect.php');
require_once ('stripe-php-4.1.0/init.php');
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
\Stripe\Stripe::setApiKey("sk_test_k7htWlvB4XQJXy9qzNydieSo");
// Get the credit card details submitted by the form
$token = $_POST['stripeToken'];
// Create a charge: this will charge the user's card
try {
    $charge = \Stripe\Charge::create(array(
        "amount" => 1000, // Amount in cents
        "currency" => "usd",
        "source" => $token,
        "description" => "Example charge"
    ));
    print_r("charge successful");
} catch(\Stripe\Error\Card $e) {
    echo  "The card has been declined";
}
?>
