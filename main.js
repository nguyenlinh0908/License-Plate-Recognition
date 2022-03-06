const electron = require("electron");
const { ipcRenderer } = electron;
$(document).ready((e) => {
  // e.preventDefault();
  ipcRenderer.on("tickets_list", (e, result) => {
    console.log(result);
  });
});
$("#licensePlateForm").submit((e) => {
  e.preventDefault();
  const myImage = $("#licensePlateInput").prop("files");
  const { name, size, path } = myImage[0];
  ipcRenderer.send("image:submit", path);
  ipcRenderer.on("image:result", (e, info) => {
    const { base64, txt, ticket, url, status } = info;
    $("#licensePlate_identified").attr(
      "src",
      "data:image/jpeg;base64," + base64
    );
    $("#licensePlateText").html(txt);
    $("#ticketImage").attr("src", "data:image/jpeg;base64," + ticket);
    console.log(status);
    if (status == 0) {
      $("#warning_ticket").show();
    }
  });
});
