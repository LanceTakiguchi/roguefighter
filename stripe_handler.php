<?php
session_start();
require_once('mysql_connect.php');
require_once ('stripe-php-4.1.0/init.php');
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
} catch(\Stripe\Error\Card $e) {
    echo  "The card has been declined";
}
mysqli_begin_transaction($conn, MYSQLI_TRANS_START_READ_WRITE);
$charge_amount = $charge['amount'];
$account_to_credit = $_SESSION['user_email'];
$return_user_id = "SELECT `id` FROM `users` WHERE `email`='$account_to_credit'";
$query_results = mysqli_query($conn, $return_user_id);
if(mysqli_num_rows($query_results)>0){
    $returned_id = mysqli_fetch_assoc($query_results);
}
mysqli_commit($conn);
$add_charge_to_db = "INSERT INTO `purchases`(`total_amount`, `item_id`, `customer_id`, `date_created`) VALUES ('$charge_amount', '1', '$returned_id', NOW())";
mysqli_query($conn, $add_charge_to_db);
$purchase_id = mysqli_insert_id($conn);
mysqli_commit($conn);
if(isset($purchase_id)){

}
//header('location: checkout.php');
print_r($_SESSION);
?>
