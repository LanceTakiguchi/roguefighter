//sends given user info to backend for database create/retrieval
function login_user(dataObj) {
    $.ajax({
        url: "./php/login_handler.php",
        data: dataObj,
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            var responseObj = response.data
            $("#game_count").text(responseObj.game_plays);
            return true;
        },
        error: function (response) {
            console.warn(response);
            return false;
        }
    });
}
//sends validated stripe token to backend so that a user will be charged
function chargeUser(dataObj) {
    $.ajax({
        url: "./php/stripe_handler.php",
        data: dataObj,
        method: "POST",
        success: function (response) {
            console.log(response);
            ///display purchased games on successful charge
            display_games();
            return true;
        },
        error: function (response) {
            console.error(response.statusText);
            return false;
        }
    });
}
//makes a call to the database in order to decrease a user's game play count
function decreaseGameCount() {
    $.ajax({
        url: "./php/decrease.php",
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            return true;
        },
        error: function (response) {
            console.warn(response);
            return false;
        }
    });
}