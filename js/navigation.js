$(document).ready(function(){
  //only when ready, call this
  navScroll();
  });

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
