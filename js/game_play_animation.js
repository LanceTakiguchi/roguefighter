$(document).ready(clickhanders);

function clickhanders(){
  $('.skip').click(cleanScroll);
  setTimeout(cleanScroll, 30000);
}

function cleanScroll() {
  $('html, body').animate({
    scrollTop: $("#gameArea").offset().top
  }, 3000);
  $('.skip').fadeOut();
}
