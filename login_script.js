$(document).ready(function () {
    addClickHandlers();
});
function addClickHandlers() {
    $("button").click(function () {
        makeAjaxCall();
    });
}
function makeAjaxCall() {
    var dataToSend = {
        userEmail: $("input:first-child").val(),
        password: $(":password").val()
    };
    $.ajax({
        url: "login_handler.php",
        data: dataToSend,
        cache: false,
        method: "POST",
        datatype: "JSON",
        success: function (response) {
            console.log(response);
            var responseObj = JSON.parse(response);
            $("<h1>").text(responseObj.message).appendTo("form");
            $("<h2>").text("Welcome back " + responseObj.data.username).appendTo("form");
            $("<h3>").text("Your highscore is: " + responseObj.data.high_score).appendTo("form");
        },
        error: function (response) {
            console.log(response);
        }
    });
}
