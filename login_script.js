$(document).ready(function () {
    addClickHandlers();
});
function addClickHandlers() {
    $("#id").click(function () {
        makeAjaxCall();
    });
}
function makeAjaxCall(dataobj) {
    // var dataToSend = {
    //     userEmail: $("input:first-child").val(),
    //     password: $(":password").val()
    // };
    $.ajax({
        url: "login_handler.php",
        data: dataobj,
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            var responseObj = response;
            $("<h1>").text(responseObj.message).appendTo("#welcomeBack");
            $("<h2>").text("Welcome back " + responseObj.data.username).appendTo("#welcomeBack");
            $("<h3>").text("Your highscore is: " + responseObj.data.high_score).appendTo("#welcomeBack");
        },
        error: function (response) {
            console.log(response);
        }
    });
}
///////
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    var dataToSend = {
        userEmail: profile.getEmail(),
    };
    makeAjaxCall(dataToSend);
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    $("#welcomeBack").empty();
}