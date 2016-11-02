function makeAjaxCall(dataobj) {
    $.ajax({
        url: "./php/login_handler.php",
        data: dataobj,
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    });
}
///////
function decreaseGameCount() {
    $.ajax({
        url: "./php/decrease.php",
        method: "POST",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
        }
    })
}