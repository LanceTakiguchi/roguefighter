<?php
require_once('mysql_connect.php');
require_once ('stripe-php-4.1.0/init.php');

\Stripe\Stripe::setApiKey('sk_test_k7htWlvB4XQJXy9qzNydieSo');
$myCard = array('number' => '4242424242424242', 'exp_month' => 8, 'exp_year' => 2018);
$charge = \Stripe\Charge::create(array('card' => $myCard, 'amount' => 2000, 'currency' => 'usd'));
echo $charge;


//print_r($_POST);
?>