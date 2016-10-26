$(document).ready(clickhander);

function clickhander(){
  $('p').click(cleanScroll);
  setTimeout(cleanScroll, 30000);
}

function cleanScroll(){
  $('html, body').animate({
    scrollTop: $("#gameArea").offset().top
  }, 3000);
}
