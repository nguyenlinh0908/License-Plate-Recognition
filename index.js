const electron = require("electron");
const { app, BrowserWindow, ipcMain, Menu } = electron;
const { PythonShell } = require("python-shell");
const fs = require("fs");
const _ = require("lodash");
let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  showListTickets();
});
// Menu.setApplicationMenu(false);
ipcMain.on("image:submit", (e, path) => {
  const imageBase64 = base64_encode(path);
  execWithPython(imageBase64);
});

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}
function storageTicket(path, data) {
  const { base64, txt, ticket, ticket_url_sys } = data;
  let rawFile = fs.readFileSync(path);
  let tickets = JSON.parse(rawFile);
  const d = new Date();
  let time = d.getTime();
  if (tickets.length > 0 && _.find(tickets, { license_plate: txt })) {
    // const info = _.find(tickets, { license_plate: txt });
    // if (info["status"] == "false") {
    //   fs.unlink(ticket_url_sys);
    // }
  } else {
    const ticket = {
      id: time.toString(),
      license_plate: txt,
      ticket: ticket_url_sys,
      status: "false",
    };
    tickets.push(ticket);
    let ticketsJson = JSON.stringify(tickets);
    console.log(ticketsJson);
    fs.writeFileSync(path, ticketsJson);
  }
}
function showListTickets() {
  let rawFile = fs.readFileSync("tickets.json");
  let tickets = JSON.parse(rawFile);
  mainWindow.webContents.on("did-finish-load", function () {
    mainWindow.webContents.send("tickets_list", tickets);
  });
}
function execWithPython(imageBase64) {
  let myPyShell = new PythonShell("main.py");

  // sends a message to the Python script via stdin
  myPyShell.send(JSON.stringify(imageBase64));

  myPyShell.on("message", function (message) {
    const dataResult = JSON.parse(message);
    const { base64, txt, ticket, url } = dataResult;
    storageTicket("tickets.json", dataResult);
    // received a message sent from the Python script (a simple "print" statement)
    mainWindow.webContents.send("image:result", dataResult);
  });

  // end the input stream and allow the process to exit
  myPyShell.end(function (err, code, signal) {
    if (err) throw err;
    console.log("The exit code was: " + code);
    console.log("The exit signal was: " + signal);
    console.log("finished");
  });
}
