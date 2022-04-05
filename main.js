const electron = require("electron");
const { ipcRenderer } = electron;
$(document).ready((e) => {
  // e.preventDefault();
  callListTickets();
});
function callListTickets() {
  ipcRenderer.on("tickets_list", (e, result) => {
    let ticket_table = $("#ticket_table>tbody");
    let tickets = result;
    let format = "";
    if (tickets.length > 0) {
      tickets.forEach((ticket, index) => {
        let status = "";
        if (ticket["status"] == false) {
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
                      <td><img src="${ticket["ticket"]}" alt="">
                      </td>
                      <td>${ticket["license_plate"]}</td>
                      <td>${ticket["time"]}</td>
                      <td>${status}
                    </td>
                    </tr>`;
      });
    }
    ticket_table.html(format);
  });
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
    licensePlateText.text(ticketResult["license_plate"]);
    timeTextTicket.text(ticketResult["time"]);
  });
});
