<?php
session_start();
require_once('mysql_connect.php');
require_once('stripe-php-4.1.0/init.php');
if(!$conn){
    $output['message'] = "Fatal Error: could not reach database";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$account_to_credit = $_SESSION['user_email'];
$charge_amount = $_POST['chargeAmount'];
\Stripe\Stripe::setApiKey("sk_test_k7htWlvB4XQJXy9qzNydieSo");
// Get the credit card details submitted by the form
$token = $_POST['stripeToken'];
// Create a charge: this will charge the user's card
try {
    $charge = \Stripe\Charge::create(array(
        "amount" => $charge_amount,
        "currency" => "usd",
        "source" => $token,
        "description" => "more lives"
    ));
} catch(\Stripe\Error\Card $e) {
    echo  "The card has been declined";
}
mysqli_begin_transaction($conn);
$return_item_id = "SELECT `id` , `games` FROM `items` WHERE `unit_price`='$charge_amount'";
$item_query_result = mysqli_query($conn, $return_item_id);
if(mysqli_num_rows($item_query_result) > 0){
    while ($row = mysqli_fetch_assoc($item_query_result)){
        $item_id = $row['id'];
        $purchased_games = $row['games'];
    }
}
mysqli_commit($conn);
$return_user_id = "SELECT `id`  FROM `users` WHERE `email`='$account_to_credit'";
$user_query_results = mysqli_query($conn, $return_user_id);
if(mysqli_num_rows($user_query_results)>0){
    while ($row = mysqli_fetch_assoc($user_query_results)){
        $user_id = $row['id'];
    }
}
mysqli_commit($conn);
$add_charge_to_db = "INSERT INTO `purchases`(`total_amount`, `item_id`, `customer_id`, `date_created`) VALUES ('$charge_amount', '$item_id', '$user_id', 'NOW()')";
mysqli_query($conn, $add_charge_to_db);
$purchase_id = mysqli_insert_id($conn);
mysqli_commit($conn);
if(isset($purchase_id)){
    $game_play_update_query = "UPDATE `users` SET `game_plays`=`game_plays` +  '$purchased_games' WHERE `ID`='$user_id'";
    $update_results = mysqli_query($conn, $game_play_update_query);
    mysqli_commit($conn);
}
?>
