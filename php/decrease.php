<?php
session_start();
require_once('mysql_connect.php'); //connect to database
$output['success'] = false;
if(!$conn){
    //throw an error if connection fails
    $output['message'] = "Fatal Error: could not reach database";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
//retrieve email of logged in user
$logged_in_user = $_SESSION['user_email'];
$decrement_query = "UPDATE  `users` SET  `game_plays` =  `game_plays` -1 WHERE  `email` =  '$logged_in_user'"; //sql query to decrease game play count
$decrement_results = mysqli_query($conn, $decrement_query);
if(mysqli_affected_rows($conn) > 0){
    //indicate query was successful
    $output['success'] = true;
    $output['message'] = "used one game play";
}
$json_output = json_encode($output);
print_r($json_output); //return output object
mysqli_close($conn);
?>