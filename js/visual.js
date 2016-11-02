/**
 * Created by numberSix on 10/23/2016.
 */
$(document).ready(function() {
  //fixed navigation on scroll
  navScroll();
  //loads music and plays music on document load
  playMusic();
  //click handler for volume
  $('.volume').click(volumeOff);
  //r2d2 sounds
  $('.g-signin2').click(signInAction);
});

/*plays music on page load
 * index page
 * controls page
 * about page
 */
function playMusic(){
  $('.audioDemo').trigger('load');
  $(".audioDemo").trigger('play');
}

//manages volume
function volumeOff(){
  //toggles music on and off
  $(".audioDemo").prop("muted",!$(".audioDemo").prop("muted"));
  //changes the sprite image
  $('.volume').toggleClass('volumeOff');
}

//
function signInAction(){
  $(".r2_sound").trigger('play');
  onSignIn();
}

function navScroll() {
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 150) {
      $('#background_slice').removeClass('originalHeight').addClass('minHeight');
      $('header').addClass('fixed');
      $('.brandIcon').hide();
      $('.play').removeClass('standard_padding').addClass('increased_padding');
    }else{
      $('#background_slice').removeClass('minHeight').addClass('originalHeight');
      $('header').removeClass('fixed');
      $('.brandIcon').show();
      $('.play').removeClass('increased_padding').addClass('standard_padding');
    }
  });
}
