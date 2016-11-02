function makeAjaxCall(dataobj) {
    $.ajax({
        url: "./php/login_handler.php",
        data: dataobj,
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            var responseObj = response;
            $("<h1>").text(responseObj.message).appendTo("#welcomeBack");
            $("<h2>").text("Welcome back " + responseObj.data.username).appendTo("#welcomeBack");
            $("<h3>").text("Your highscore is: " + responseObj.data.high_score).appendTo("#welcomeBack");
            $("<h4>").text("Number of lives remaining is: " + responseObj.data.game_plays).appendTo("#welcomeBack");
        },
        error: function (response) {
            console.log(response);
        }
    });
}
///////
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    var dataToSend = {
        userEmail: profile.getEmail(),
        userName: profile.getName()
    };
    makeAjaxCall(dataToSend);
    //$("<img>", {src: profile.getImageURl()}).apppendTo("#welcomeBack");
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        $("#welcomeBack").empty();
    });
}