<?php
session_start();
require_once('mysql_connect.php');
$test_password = '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8';
$user_email = $_POST['userEmail'];
$received_password = sha1($_POST['password']);
$output = ['success' => false];
$query_string = "SELECT `username`, `high_score` FROM `users` WHERE `email`='$user_email'";
if (isset($received_password, $user_email)){
    $query_result = mysqli_query($conn, $query_string);
    if(mysqli_num_rows($query_result) > 0){
        if($test_password === $received_password){
            unset($received_password);
            $output['success'] = true;
            $output['message'] = "successfully logged in";
            while ($row = mysqli_fetch_assoc($query_result)){
                $output['data'] = $row;
            }
        } else {
            $output['message'] = "USERNAME OR PASSWORD INCORRECT";
        }
    }
} else {
    $output['message'] = "USERNAME OR PASSWORD INCORRECT";
}
$json_output = json_encode($output);
print_r($json_output);
?>