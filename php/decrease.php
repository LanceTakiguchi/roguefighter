<?php
session_start();
require_once('mysql_connect.php');
$output['success'] = false;
if(!$conn){
    $output['message'] = "Fatal Error: could not reach database";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$logged_in_user = $_SESSION['user_email'];
$decrement_query = "UPDATE  `users` SET  `game_plays` =  `game_plays` -1 WHERE  `email` =  '$logged_in_user'";
$decrement_results = mysqli_query($conn, $decrement_query);
if(mysqli_affected_rows($decrement_results) > 0){
    $output['success'] = true;
    $output['message'] = "used one game play";
}
$json_output = json_encode($output);
print_r($json_output);
?>