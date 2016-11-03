<?php
session_start();
require_once('mysql_connect.php'); //connect to database
require_once('stripe-php-4.1.0/init.php'); //include Stripe's PHP Client Library will throw a fatal error if not found
$output['success'] = false;
$output['charge'] = false;
if(!$conn){
    //throw an error if connection fails
    $output['message'] = "Fatal Error: could not reach database";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$account_to_credit = $_SESSION['user_email']; //retrieve user's email from session data rather than from Stripe to make sure the correct user is credited
$charge_amount = $_POST['chargeAmount']; //retrieve the amount to charge the user from post data

\Stripe\Stripe::setApiKey("sk_test_k7htWlvB4XQJXy9qzNydieSo"); //using given api "test" key
// Get the credit card details submitted by the form
$token = $_POST['stripeToken'];
// Create a charge: this will charge the user's card
try {
    $charge = \Stripe\Charge::create(array(
        "amount" => $charge_amount,
        "currency" => "usd",
        "source" => $token,
        "description" => "purchase of additional game plays"
    ));
    $output['charge'] = true;
    $output['charge']['message'] = "Successfully charged";
} catch(\Stripe\Error\Card $e) {
    $output['message'] = "Error: The card has been declined";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
mysqli_begin_transaction($conn); //using transactional method to make user of mysqli insert id function
$return_item_id = "SELECT `id` , `games` FROM `items` WHERE `unit_price`='$charge_amount'"; //find the purchased package in database by referencing its cost
$item_query_result = mysqli_query($conn, $return_item_id);
if(mysqli_num_rows($item_query_result) > 0){
    while ($row = mysqli_fetch_assoc($item_query_result)){
        $item_id = $row['id']; //return the id of the selected package in order to be entered with `purchases` entry
        $purchased_games = $row['games']; //return the number of game plays associated with the package in order to update the user's account
    }
} else {
    $output['message'] = "Fatal Error: could not find package in database, please contact admin!";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
mysqli_commit($conn);
$return_user_id = "SELECT `id`  FROM `users` WHERE `email`='$account_to_credit'"; //return the id of the user making the purchase
$user_query_results = mysqli_query($conn, $return_user_id);
if(mysqli_num_rows($user_query_results)>0){
    while ($row = mysqli_fetch_assoc($user_query_results)){
        $user_id = $row['id']; //store the id of the user in order to be entered with `purchases` entry
    }
} else {
    $output['message'] = "Fatal Error: could not find user in database, please contact admin!";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
mysqli_commit($conn);
$add_charge_to_db = "INSERT INTO `purchases`(`total_amount`, `item_id`, `customer_id`, `date_created`) VALUES ('$charge_amount', '$item_id', '$user_id', NOW())"; //add the purchase into the database
mysqli_query($conn, $add_charge_to_db);
$purchase_id = mysqli_insert_id($conn); //return the id of the row that was just insterted
mysqli_commit($conn);
if(isset($purchase_id)){
    $game_play_update_query = "UPDATE `users` SET `game_plays`=`game_plays` +  '$purchased_games' WHERE `ID`='$user_id'";
    $update_results = mysqli_query($conn, $game_play_update_query); //update the user's database entry with the newly purchased game plays
    mysqli_commit($conn);
    $output['success'] = true;
} else {
    $output['message'] = "Fatal Error: purchased game plays not added, please contact admin!";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$json_output = json_encode($output);
print_r($json_output);
mysqli_close($conn);
?>
