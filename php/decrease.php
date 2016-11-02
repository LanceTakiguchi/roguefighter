<?php
session_start();
$post = json_encode($_SESSION);
print_r($post);
?>