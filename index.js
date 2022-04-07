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
    icon: __dirname + '/public/logo.png',
  });
  mainWindow.maximize();
  mainWindow.setTitle("Hệ thống quản lý gửi trả xe");
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
// Menu.setApplicationMenu(false);
ipcMain.on("image:submit", (e, path) => {
  const imageBase64 = base64_encode(path);
  execWithPython(imageBase64);
});
ipcMain.on("qr:submit", (e, myPath) => {
  execWithPythonQrCode(myPath);
});
ipcMain.on("ticket:submit", (e, idTicket) => {
  execWithPythonTicket(idTicket);
});
function execWithPythonQrCode(pathTicket) {
  let myPyShell = new PythonShell("main.py");
  // sends a message to the Python script via stdin
  myPyShell.send(JSON.stringify({ data: pathTicket, process: 2 })); //ticket recognition

  myPyShell.on("message", function (message) {
    const dataResult = JSON.parse(message);
    // received a message sent from the Python script (a simple "print" statement)
    mainWindow.webContents.send("qr:result", dataResult);
  });

  // end the input stream and allow the process to exit
  myPyShell.end(function (err, code, signal) {
    if (err) throw err;
    console.log("The exit code was: " + code);
    console.log("The exit signal was: " + signal);
    console.log("finished");
  });
}
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}
function execWithPython(imageBase64) {
  let myPyShell = new PythonShell("main.py");

  // sends a message to the Python script via stdin
  myPyShell.send(
    JSON.stringify({ data: imageBase64, process: 0 }) // process 0 is license plate recognition
  );

  myPyShell.on("message", function (message) {
    const dataResult = JSON.parse(message);
    const { base64, txt } = dataResult;
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
function execWithPythonTicket(idTicket) {
  let myPyShell = new PythonShell("main.py");

  // sends a message to the Python script via stdin
  myPyShell.send(
    JSON.stringify({ data: idTicket, process: 1 }) // process 0 is license plate recognition
  );

  myPyShell.on("message", function (message) {
    const dataResult = JSON.parse(message);
    // received a message sent from the Python script (a simple "print" statement)
    mainWindow.webContents.send("ticket:result", dataResult);
  });

  // end the input stream and allow the process to exit
  myPyShell.end(function (err, code, signal) {
    if (err) throw err;
    console.log("The exit code was: " + code);
    console.log("The exit signal was: " + signal);
    console.log("finished");
  });
}
