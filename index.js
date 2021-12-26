const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const { PythonShell } = require("python-shell");
const fs = require("fs");
let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("image:submit", (e, path) => {
  const imageBase64 = base64_encode(path);
  execWithPython(imageBase64);
  //mainWindow.webContents.send("imageBase64:send", imageBase64)
});

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

function execWithPython(imageBase64) {
  let myPyShell = new PythonShell("main.py");

  // sends a message to the Python script via stdin
  myPyShell.send(JSON.stringify(imageBase64));

  myPyShell.on("message", function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    mainWindow.webContents.send("image:result", message);
  });

  // end the input stream and allow the process to exit
  myPyShell.end(function (err, code, signal) {
    if (err) throw err;
    console.log("The exit code was: " + code);
    console.log("The exit signal was: " + signal);
    console.log("finished");
  });
}
