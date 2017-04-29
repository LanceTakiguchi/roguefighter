$(document).ready(function(){
  //prepares the click handlers not game related
  clickhandlers();
  //executes the animation timer
  gameOpening();
  //loads and plays music on document load
  $('.entry').hide().fadeIn(3000).fadeOut(4000);
  gameTitleLeadIn()
  // Start muted
  $(".audioDemo").prop("muted",!$(".audioDemo").prop("muted"));
    //click handler for volume
  $('.volume').click(volumeOff);
});

//setTimeout(buildTitle, 500);
function gameTitleLeadIn(){
  //game title loads after a brief pause
  setTimeout(function(){
    var title = $('<img>').attr("src", "imgs/title-screen-logo.png").addClass('sw_icon');
    title.appendTo('.wrapper');
    }, 8000);
  //animation to fade title out
  setTimeout(function(){
    $('.sw_icon').addClass('scale');
  }, 8100);
  //start music
  setTimeout(function(){
    playMusic();
  },8110);
}

function clickhandlers(){
//clicking the skip button will trigger the scroll animation and the music to stop
  $('.skip').click(cleanScroll);
}

//will run scroll animation in x amount of time
function gameOpening(){
  setTimeout(cleanScroll, 100300);
}

//this function scrolls from star wars wall text down to the game play area
function cleanScroll() {
  $('html, body').animate({
    scrollTop: $("#gameArea").offset().top
  }, 3000);
  //skip button is faded out when this occurs
  $('.skip').fadeOut();
  //music ends when this is clicked
  $(".audioDemo").remove();
  $("#titlecontent").remove();
}

//loads and plays html 5 audio
function playMusic(){
  $('.audioDemo').trigger('load');
  $(".audioDemo").trigger('play');
}
function volumeOff(){
  //toggles music on and off
  $(".audioDemo").prop("muted",!$(".audioDemo").prop("muted"));
  //changes the sprite image
  $('.volume').toggleClass('volumeOff');
}

/**
 * [play_home with a click, sends user back to landing/home page]
 */
function play_home(){
  window.location.replace("index.html");
}