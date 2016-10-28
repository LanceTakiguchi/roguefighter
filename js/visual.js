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
  
});

function playMusic(){
  $('.audioDemo').trigger('load');
  $(".audioDemo").trigger('play');
}

function volumeOff(){
  $(".audioDemo").prop("muted",!$(".audioDemo").prop("muted"));
  $('.volume').toggleClass('volumeOff');
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
