// click choose license plate
$("#licensePlate_box").click(() => {
  $("#licensePlateInput").click();
});
$("#warning_ticket").hide();
// review image
const licensePlateOrigin = function (event) {
  $("#licensePlate_origin").attr(
    "src",
    URL.createObjectURL(event.target.files[0])
  );
  $("#licensePlate_origin").onload = function () {
    URL.revokeObjectURL($("licensePlate_origin").attr("src")); // free memory
  };
};
