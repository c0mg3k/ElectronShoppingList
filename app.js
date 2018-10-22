const electron = require(`electron`);
const url = require(`url`);
const path = require(`path`);

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;

// listen for app to be ready (app start)
app.on(`ready`, ()=>{
  console.log(`starting app....`);
  mainWindow = new BrowserWindow({});
  //load mainWindow view
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, `views/mainWindow.html`),
    protocol: `file:`,
    slashes: true
  }));
  //build the application menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //set the application menu
  Menu.setApplicationMenu(mainMenu);
});

// handle createAddWindow

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: `Add Shopping List Item`
  });
  //load mainWindow view
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, `views/addWindow.html`),
    protocol: `file:`,
    slashes: true
  }));
}

//create menu template
const mainMenuTemplate = [{
      label: `File`,
      submenu: [{
        label: `Add Item`,
        click() {
          createAddWindow();
        }
      }, {
        label: `Clear Items`
      }, {
        label: `Quit`,
        accelerator: process.platform == `darwin` ? `Command+Q` : `Ctrl+Q`,
        click() {
          app.quit();
        }
      }
    ]
}];
