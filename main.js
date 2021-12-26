const electron = require("electron");
const { ipcRenderer } = electron;
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const myImage = document.querySelector("input");
  const infoImage = myImage.files;
  const { name, size, path } = infoImage[0];
  ipcRenderer.send("image:submit", path);
  ipcRenderer.on("image:result", (e, image) => {
    console.log(image);
   // document.getElementById("myImage").src = "data:image/jpg;base64,"+image;
  });
});
