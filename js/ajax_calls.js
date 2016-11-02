//sends given user info to backend for database create/retrieval
function login_user(dataObj) {
    $.ajax({
        url: "./php/login_handler.php",
        data: dataObj,
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            var responseObj = response.data
            console.log(response);
            $("#game_count").text(responseObj.game_plays);
        },
        error: function (response) {
            console.log(response);
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
            return true;
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
        }
    })
}