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
$query_string = "SELECT `username`, `high_score` FROM `users` WHERE `email`='$user_email'";
if (isset($user_email)){
    $query_result = mysqli_query($conn, $query_string);
    if(mysqli_num_rows($query_result) > 0){
        $output['success'] = true;
        $output['message'] = "successfully logged in";
        while ($row = mysqli_fetch_assoc($query_result)){
            $output['data'] = $row;
        }
    } else{
        $user_insert_query = "INSERT INTO `users`(`username`, `email`, `high_score`, `date_created`) VALUES ('$user_name','$user_email','0','NOW()')";
        $insert_query_result = mysqli_query($conn, $user_insert_query);
    }
} else {
    $output['message'] = "USERNAME OR PASSWORD INCORRECT";
}
$json_output = json_encode($output);
print_r($json_output);
mysqli_close($conn);
?>