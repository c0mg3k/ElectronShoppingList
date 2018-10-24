const electron = require(`electron`);
const url = require(`url`);
const path = require(`path`);
const startup = require('./startup');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

process.env.NODE_ENV = startup.enviornment;
// listen for app to be ready (app start)
app.on(`ready`, ()=>{
  console.log(`environment: ${process.env.NODE_ENV}`);
  console.log(`db1 Connection String ${startup.db1ConnectionString}`)
  mainWindow = new BrowserWindow({});
  //load mainWindow view
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, `views/mainWindow.html`),
    protocol: `file:`,
    slashes: true
  }));
  //quit app on main window close
  mainWindow.on('close', ()=> {
    console.log(`the server is shutting down...`);
    app.quit();
  });
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
  //garbage collection handle for closing app with addWindow open
  addWindow.on(`close`, ()=>{
    addWindow = null;
  });
}

//catch item added
ipcMain.on(`item:add`, (e, item)=>{
  mainWindow.webContents.send(`item:add`, item);
  console.log(item);
  addWindow.close();

});

//create menu template [NOTE darwin is system key for mac user]
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

//if mac, add menu spacer
if(process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

//add dev tools menu for non production use
if(process.env.NODE_ENV !== `production`) {
  mainMenuTemplate.push({
    label: `Developer Tools`,
    submenu: [{
      label: `Toggle DevTools`,
      accelerator: process.platform == `darwin` ? `Command+I` : `Ctrl+I`,
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }, {
      role: `reload`
    }]
  });
}
