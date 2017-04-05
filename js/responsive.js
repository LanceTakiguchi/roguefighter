document.addEventListener("DOMContentLoaded", function(event) {
	var close = document.getElementsByClassName("my_close");
	close.onclick = function() {
		alert("Closing!");
	}
});