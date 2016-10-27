<?php
session_start();
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ROGUE FIGHTERS LOGIN</title>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <meta name="google-signin-client_id" content="1008724184795-omh68sq6kf9amt9qnnb1dar36okaku6l.apps.googleusercontent.com">
    <script src="login_script.js"></script>
</head>
<body>
<div id="welcomeBack"></div>
<br><br><br>
<div class="g-signin2" data-onsuccess="onSignIn"></div>
<br>
<button type="button" onclick="signOut();">Sign out</button>
<br><br><br>
<form action="stripe_handler.php" method="POST">
    <script
            src="https://checkout.stripe.com/checkout.js" class="stripe-button"
            data-key="pk_test_FdGFoKV6xdSErG0cg7GNrKz3"
            data-amount="999"
            data-name="C10 | 8 Bit Bullet Hell"
            data-description="Widget"
            data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
            data-locale="auto">
    </script>
</form>
</body>
</html>