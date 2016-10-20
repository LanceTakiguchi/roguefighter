<?php
session_start();
?>
<html>
<head>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="login_script.js"></script>
</head>
<body>
    <!--<form>
        <input type="email" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="password">
        <button type="button">Login</button>
    </form>-->
    <form action="login_handler.php" method="POST">
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
