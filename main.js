const electron = require("electron");
const { ipcRenderer } = electron;
const fs = require("fs");
$(document).ready((e) => {
  vehicleHanding();
  listTickets();
});
function callListTickets(records) {
  let ticket_table = $("#ticket_table>tbody");
  let tickets = records;
  let format = "";
  if (tickets.length > 0) {
    tickets.forEach((ticket, index) => {
      let status = "";
      if (ticket["trangthai"] == 0) {
        status = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle text-danger" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
</svg>`;
      } else {
        status = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle text-success" viewBox="0 0 16 16">
  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
  <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
</svg>`;
      }
      format += ` <tr>
                      <th scope="row">${++index}</th>                   
                      <td>${ticket["ma_bien"]}</td>
                      <td>${ticket["time"]}</td>
                      <td>${status}
                    </td>
                    </tr>`;
    });
  }
  ticket_table.html(format);
}
$("#licensePlateForm").submit((e) => {
  e.preventDefault();
  const myImage = $("#licensePlateInput").prop("files");
  const { name, size, path } = myImage[0];
  ipcRenderer.send("image:submit", path);
  ipcRenderer.on("image:result", (e, info) => {
    console.log(info);
    callListTickets();
    const { base64, txt, ticket, url, status } = info;
    $("#licensePlate_identified").attr(
      "src",
      "data:image/jpeg;base64," + base64
    );
    $("#licensePlateText").html(txt);
    $("#ticketImage").attr("src", "data:image/jpeg;base64," + ticket);
    if (status == 0) {
      $("#warning_ticket").show();
    }
  });
});
$("#qrForm").submit((e) => {
  e.preventDefault();
  const myQr = $("#qrinput").prop("files");
  const { name, size, path } = myQr[0];
  ipcRenderer.send("qr:submit", path);
  ipcRenderer.on("qr:result", (e, info) => {
    let ticketResult = info;
    ticketResult = ticketResult.split("'");
    ticketResult = JSON.parse(ticketResult[1]);
    let licensePlateText = $("#licensePlateTextTicket");
    let timeTextTicket = $("#timeTextTicket");
    let license_plate = ticketResult["license_plate"];
    let time = ticketResult["time"];
    licensePlateText.text(license_plate);
    timeTextTicket.text(time);
    isTicketValid({ license_plate: license_plate, time: time });
  });
});

function listTickets() {
  $sql = `SELECT * FROM tbl_bienso`;
  connection.query($sql, function (err, res, fields) {
    let records = res;
    callListTickets(records);
  });
}
function isTicketValid(condition) {
  let { license_plate, time } = condition;
  $sql = `SELECT * FROM tbl_bienso WHERE tbl_bienso.ma_bien = '${license_plate}' AND tbl_bienso.time = '${time}' AND tbl_bienso.trangthai = 0`;
  connection.query($sql, function (err, res, fields) {
    let records = res;
    if (records.length > 0) {
      $("#ticket-status_box").css("border-color", "green");
      $("#ticket-status_text").text("Ticket valid");
      $("#ticket-status_text")
        .addClass("text-success")
        .removeClass("text-danger");
      $("#vehicle_handing").attr("data-id", records[0]["id"]);
      $("#vehicle_handing").prop("disabled", false);
    } else {
      $("#ticket-status_text")
        .addClass("text-danger")
        .removeClass("text-success");
      $("#ticket-status_text").text("Ticket invalid");
    }
  });
}
function vehicleHanding() {
  const btnVehicleHanding = $("#vehicle_handing");
  btnVehicleHanding.on("click", (e) => {
    const id = btnVehicleHanding.data("id");
    $sql = `UPDATE tbl_bienso SET tbl_bienso.trangthai = 1 WHERE tbl_bienso.id = ${id}`;
    connection.query($sql, function (err, res, fields) {
      let affectedRows = res["affectedRows"];
      if (affectedRows > 0) {
        notificationChangeStatus(0);
      } else {
        notificationChangeStatus(0);
      }
      // removeTicket(res[0]["url_qr"]);
      listTickets();
    });
  });
}
// function removeTicket(path) {
//   let filePath = path;
//   fs.unlinkSync(filePath);
// }
function notificationChangeStatus(status) {
  let text = "";
  const notificationText = $("#text-notification");
  switch (status) {
    case 0:
      text = "vehicle handing success";
      break;
    default:
      text = "vehicle handing fail";
  }
  notificationText.text(text);
  setInterval(() => {
    notificationText.text("");
  }, 3000);
}
