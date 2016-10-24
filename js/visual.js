/**
 * Created by numberSix on 10/23/2016.
 */
$(document).ready(function() {
  $('.audioDemo').trigger('load');
  $(".audioDemo").trigger('play');
  
  $('.volume').click(volumeOff);
  
});

function volumeOff(){
  $(".audioDemo").prop("muted",!$(".audioDemo").prop("muted"));
}