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
    let remove2CharInHead = image.slice(2);// base64 string is redundant 2 char is <b'> in head and <'> in last string
    let remove1CharInLast = remove2CharInHead.slice(0, -1);
    const myImage = remove1CharInLast;
    document.getElementById("myImage").src =
      "data:image/jpeg;base64," + myImage;
  });
});
