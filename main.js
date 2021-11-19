const { app, BrowserWindow, dialog } = require("electron");
const Obserser = require("./src/observer");

var obserser = new Obserser();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");
};

app.whenReady().then(async () => {
  createWindow();

  
   const rootFolder= await dialog.showOpenDialog({
      properties: ["openFile", "openDirectory"],
    })
    console.log(rootFolder.filePaths[0]);
    obserser.watchFile(rootFolder.filePaths[0]);
});

obserser.on("dir-updated", (log) => {
  console.log(log.message);
});

obserser.on("error", (log) => {
  console.log(log.error);
});



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
