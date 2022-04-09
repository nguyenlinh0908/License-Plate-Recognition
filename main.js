const electron = require("electron");
const { ipcRenderer } = electron;
const fs = require("fs");
$(document).ready((e) => {
  vehicleHanding();
  typeTickets();
  listTickets();
});
function callListTickets(records) {
  let ticket_table = $("#ticket_table>tbody");
  let tickets = records;
  let format = "";
  if (tickets.length > 0) {
    tickets.forEach((ticket, index) => {
      let status = "";
      if (ticket["bTrangThai"] == 0) {
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
                      <th class="text-center" scope="row">${++index}</th>                   
                      <td>${ticket["sBienSo"]}</td>
                      <td class="text-center">${ticket["sThoiGian"]}</td>
                      <td class="text-center">${status}
                    </td>
                    </tr>`;
    });
  }
  ticket_table.html(format);
}
$("#btncheck").on("click", (e) => {
  e.preventDefault();
  const myImage = $("#licensePlateInput").prop("files");
  const { name, size, path } = myImage[0];

  const d = new Date();
  let time = d.getTime();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  month < 10 ? (month = "0" + month) : (month = month);
  let day = d.getDate();
  day < 10 ? (day = "0" + day) : (day = day);
  var timenow =
    d.getHours() +
    ":" +
    (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
  let timing = `${timenow}, ${day}/${month}/${year}`;

  ipcRenderer.send("image:submit", path);
  ipcRenderer.on("image:result", (e, info) => {
    const { base64, txt } = info;
    $("#licensePlate_identified").attr(
      "src",
      "data:image/jpeg;base64," + base64
    );
    if (txt != "") {
      $("#licensePlateText")
        .removeClass("text-danger")
        .addClass("text-success");
      $("#licensePlateText").html(txt);
      $("#inputLicensePlate").val(txt);
      $("#thoigianvao").text(timing);
    } else {
      $("#licensePlateText").html(`Nhận diện không thành công`);
      $("#licensePlateText")
        .removeClass("text-success")
        .addClass("text-danger");
      // $("#inputLicensePlate").css("display", "block");
    }
  });
});
$("#show-input-bienso").on("click", function () {
  if ($(this).val() == "hieninput") {
    $("#licensePlateText").attr("hidden", true);
    $("#input-nhaptay").attr("hidden", false);
    $(this).val("hideinput");
    $(this).text("Nhập tự động");
    $(this).css("background-color", "#28a745");
    $(this).css("border-color", "#28a745");
  } else {
    $("#licensePlateText").attr("hidden", false);
    $("#input-nhaptay").attr("hidden", true);
    $(this).val("hieninput");
    $(this).text("Nhập biển số");
    $(this).css("background-color", "grey");
    $(this).css("border-color", "grey");
  }
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
    let idTicket = ticketResult["id"];
    isTicketValid(idTicket);
  });
});
$("#renderTicket").on("click", function (e) {
  e.preventDefault();
  let licensePlate = $("#inputLicensePlate").val();
  if (licensePlate == "default") {
    licensePlate = $("#input-nhaptay").val();
  }
  let typeTicket = $("#typeTickets").val();
  isVehicle(licensePlate, typeTicket);
});
function isVehicle(licensePlate, typeTicket) {
  let sql = `SELECT * FROM tbl_bienso WHERE tbl_bienso.sBienSo = "${licensePlate}"`;
  connection.query(sql, function (err, res, fields) {
    let records = res;
    if (records.length != 0) {
      let id = records[0]["PK_iMaBien"];
      saveTicket(id, typeTicket);
    } else {
      saveVehicle(licensePlate, typeTicket);
    }
  });
}
function saveVehicle(licensePlate, typeTicket) {
  let id = Math.floor(Math.random() * 9999);
  let sql = `INSERT INTO tbl_bienso (PK_iMaBien, sBienSo) VALUES(${id}, "${licensePlate}")`;
  connection.query(sql, function (err, res, fields) {
    let result = res;
    if (result["affectedRows"] > 0) {
      saveTicket(id, typeTicket);
    }
  });
}
function saveTicket(licensePlate, typeTicket) {
  let id = Math.floor(Math.random() * 9999);
  const d = new Date();
  // let time = d.getTime();
  // let year = d.getFullYear();
  // let month = d.getMonth() + 1;
  // month < 10 ? (month = "0" + month) : (month = month);
  // let day = d.getDate();
  // day < 10 ? (day = "0" + day) : (day = day);
  // let timing = `${day}/${month}/${year}`;
  var timein = $("#thoigianvao").text();
  let sql = `INSERT INTO tbl_vexe (PK_iMaVe, sQr, sThoiGian, bTrangThai, FK_iLoaiVe, FK_iMaBien) VALUES (${id}, "./tickets/${id}.png", "${timein}", 0, ${typeTicket}, ${licensePlate})`;
  connection.query(sql, function (err, res, fields) {
    let result = res;
    if (result["affectedRows"] > 0) {
      renderQr(id);
    }
  });
}
function renderQr(id) {
  ipcRenderer.send("ticket:submit", id);
  ipcRenderer.on("ticket:result", (e, info) => {
    let result = info;
    const { ticket, ticket_url_sys } = result;
    $("#ticketImage").attr("src", "data:image/jpeg;base64," + ticket);
  });
}
function listTickets() {
  $sql = `SELECT * FROM tbl_vexe INNER JOIN tbl_bienso ON tbl_bienso.PK_iMaBien = tbl_vexe.FK_iMaBien INNER JOIN tbl_loaive ON tbl_loaive.PK_iLoaiVe = tbl_vexe.FK_iLoaiVe`;
  connection.query($sql, function (err, res, fields) {
    let records = res;
    callListTickets(records);
  });
}
function isTicketValid(condition) {
  let id = condition;
  $sql = `SELECT * FROM tbl_vexe INNER JOIN tbl_bienso ON tbl_bienso.PK_iMaBien = tbl_vexe.FK_iMaBien WHERE tbl_vexe.PK_iMaVe = '${id}' AND tbl_vexe.bTrangThai = 0`;
  connection.query($sql, function (err, res, fields) {
    let records = res;
    if (records.length > 0) {
      $("#ticket-status_box").css("border-color", "green");
      $("#ticket-status_text").text("Vé hợp lệ");
      $("#ticket-status_text")
        .addClass("text-success")
        .removeClass("text-danger");
      $("#vehicle_handing").attr("data-id", records[0]["PK_iMaVe"]);
      $("#vehicle_handing").prop("disabled", false);
      let licensePlateText = $("#licensePlateTextTicket");
      let timeTextTicket = $("#timeTextTicket");
      let license_plate = records[0]["sBienSo"];
      let time = records[0]["sThoiGian"];
      licensePlateText.text(license_plate);
      timeTextTicket.text(time);
    } else {
      $("#ticket-status_text")
        .addClass("text-danger")
        .removeClass("text-success");
      $("#ticket-status_text").text("Vé không hợp lệ");
    }
  });
}
function vehicleHanding() {
  const btnVehicleHanding = $("#vehicle_handing");
  btnVehicleHanding.on("click", (e) => {
    const id = btnVehicleHanding.data("id");
    $sql = `UPDATE tbl_vexe SET tbl_vexe.bTrangThai = 1 WHERE tbl_vexe.PK_iMaVe = ${id}`;
    connection.query($sql, function (err, res, fields) {
      let affectedRows = res["affectedRows"];
      if (affectedRows > 0) {
        notificationChangeStatus(0);
      } else {
        notificationChangeStatus(1);
      }
      // removeTicket(res[0]["url_qr"]);
      listTickets();
    });
  });
}
function removeTicket(path) {
  let filePath = path;
  fs.unlinkSync(filePath);
}
function notificationChangeStatus(status) {
  let text = "";
  const notificationText = $("#text-notification");
  switch (status) {
    case 0:
      notificationText.addClass("text-success").removeClass("text-danger");
      text = "Giao xe thành công";
      break;
    default:
      notificationText.addClass("text-danger").removeClass("text-success");
      text = "Giao xe thất bại";
  }
  notificationText.text(text);
  setInterval(() => {
    notificationText.text("");
  }, 3000);
}
function typeTickets() {
  $sql = `SELECT * FROM tbl_loaive`;
  connection.query($sql, function (err, res, fields) {
    let records = res;
    let selectTypeTickets = $("#typeTickets");
    let html = "";
    records.forEach((record, index) => {
      if (index == 0) {
        html += `<option selected value="${record["PK_iLoaiVe"]}">${record["sLoaiVe"]} - ${record["fGia"]}</option>`;
      } else {
        html += `<option value="${record["PK_iLoaiVe"]}">${record["sLoaiVe"]} - ${record["fGia"]}</option>`;
      }
    });
    selectTypeTickets.html(html);
  });
}
