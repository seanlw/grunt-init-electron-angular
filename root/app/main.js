const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const pkg = require('../package.json');

function createWindow() {
  var win = new BrowserWindow({
    width: 1200,
    height: 900,
    title: pkg.productName,
    icon: 'resources/app-icon.png'
  });

  win.loadURL(`file://${__dirname}/index.html`);

  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.setName(pkg.productName);
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

module.exports = createWindow
