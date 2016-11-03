<?php
session_start();
require_once('mysql_connect.php'); //connect to database
$output = ['success' => false];
if(!$conn){
    //throw an error if connection fails
    $output['message'] = "Fatal Error: could not reach database";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$user_name = $_POST['userName']; //retrieve sent username from post data
$user_email = $_SESSION['user_email'] = $_POST['userEmail']; //retrieve sent email from post data and store it with the session data for later use
if(isset($user_email)){
    $user_search = "SELECT `id` FROM  `users` WHERE `email`='$user_email'"; //sql query to see if user exists in database
    $user_search_result = mysqli_query($conn, $user_search);
    if(mysqli_num_rows($user_search_result) === 0) {
        //if there are no returned results make a new entry to database
        $user_insert_query = "INSERT INTO `users`(`username`, `email`, `high_score`, `date_created`) VALUES ('$user_name','$user_email','0', NOW())";
        $insert_query_result = mysqli_query($conn, $user_insert_query);
    }
} else {
    //in the event there was no email found in post data throw a fatal error, something has gone awry
    $output['message'] = "ERROR EMAIL NOT RECEIVED";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$grab_user_data = "SELECT `username`, `game_plays` FROM `users` WHERE `email`='$user_email'"; //select the user's data from the database to be returned to the client for later use
$user_data_results = mysqli_query($conn, $grab_user_data);
if(mysqli_num_rows($user_data_results) > 0) {
    $output['success'] = true;
    $output['message'] = "successfully logged in";
    while ($row = mysqli_fetch_assoc($user_data_results)) {
        $output['data']= $row;
    }
} else {
    $output['message'] = "ERROR: USER DATA NOT RETRIEVED FROM DATABASE";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$json_output = json_encode($output);
print_r($json_output);
mysqli_close($conn);
?>