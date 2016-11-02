//true or false flag - false user is not signed in, true user is signed in
var signInFlag = false;

function onSignIn(googleUser) {
  
  //when a user signs in initialize a GoogleAuth object. This is needed to call related methods
  var userObject = gapi.auth2.init({
    client_id: '395407413314-ol7h22b6rhks9hucno3bncmuqo45v8ld.apps.googleusercontent.com'
  });
  //getAuthInstance provides a response object
  var authInstance = gapi.auth2.getAuthInstance();
  
  //get the status of the current user
  signInFlag = authInstance.isSignedIn.get();
  console.log(signInFlag);
  //update out signInFlag
  signOutDisplay();
  
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  var userName =  profile.getName();
  $('.userName').text('Player: '+ userName);
  console.log('This is the users name ' + userName);
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  
  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
  //
  var dataToSend = {
    userEmail: profile.getEmail(),
    userName: userName
  };
  makeAjaxCall(dataToSend);
};

//Signs a user out
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    signInFlag = auth2.isSignedIn.get();
    signOutDisplay();
    console.log(' User signed out.');
  });
}

//Determines whether user is signed in out not
function signOutDisplay(){
  if (signInFlag === false) {
    $('.g-signin2').show();
    $('.signOut').hide();
    $('.playerItem').hide();
  }
  else{
    $('.g-signin2').hide();
    $('.signOut').show();
    $('.playerItem').show();
  }
}

//on documentload check if user is signed in
$(document).ready(function(){
  signOutDisplay();
});