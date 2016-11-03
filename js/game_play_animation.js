$(document).ready(function(){
  //prepares the click handlers not game related
  clickhandlers();
  //executes the animation timer
  gameOpening();
  //loads and plays music on document load
  playMusic();
  $('.sw_icon').fadeIn(3000);
  buildTitle();
});

function buildTitle(){
  var title = $('<img>').attr("src", "../imgs/title-screen-logo.png");
  title.appendTo('.wrapper');
}

function clickhandlers(){
//clicking the skip button will trigger the scroll animation and the music to stop
  $('.skip').click(cleanScroll);
}

//will run scroll animation in x amount of time
function gameOpening(){
  setTimeout(cleanScroll, 30000);
}



//this function scrolls from star wars wall text down to the game play area
function cleanScroll() {
  $('html, body').animate({
    scrollTop: $("#gameArea").offset().top
  }, 3000);
  //skip button is faded out when this occurs
  $('.skip').fadeOut();
  //music ends when this is clicked
  $(".audioDemo").trigger('pause');
}

//loads and plays html 5 audio
function playMusic(){
  $('.audioDemo').trigger('load');
  $(".audioDemo").trigger('play');
}
