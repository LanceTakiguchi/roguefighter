<?php
//session_start();
require_once('mysql_connect.php');
$output = ['success' => false];
if(!$conn){
    $output['message'] = "Fatal Error: could not reach database";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$user_name = $_POST['userName'];
$user_email = $_POST['userEmail'];
if(isset($user_email)){
    $user_search = "SELECT `id` FROM  `users` WHERE `email`='$user_email'";
    $user_search_result = mysqli_query($conn, $user_search);
    if(mysqli_num_rows($user_search_result) === 0) {
        $user_insert_query = "INSERT INTO `users`(`username`, `email`, `high_score`, `date_created`) VALUES ('$user_name','$user_email','0','NOW()')";
        $insert_query_result = mysqli_query($conn, $user_insert_query);
    }
} else {
    $output['message'] = "USERNAME OR PASSWORD INCORRECT";
    $fatal_error = json_encode($output);
    print_r($fatal_error);
    exit();
}
$grab_user_data = "SELECT `username`, `high_score` FROM `users` WHERE `email`='$user_email'";
$user_data_results = mysqli_query($conn, $grab_user_data);
if(mysqli_num_rows($user_data_results) > 0) {
    $output['success'] = true;
    $output['message'] = "successfully logged in";
    while ($row = mysqli_fetch_assoc($user_data_results)) {
        $output['data'] = $row;
    }
} else {
    $output['message'] = "USERNAME OR PASSWORD INCORRECT";
}
$json_output = json_encode($output);
print_r($json_output);
mysqli_close($conn);
?>