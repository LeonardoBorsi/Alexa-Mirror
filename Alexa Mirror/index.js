const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;
app.setPath('userData', __dirname+'/user_data');
let mainWindow;

app.on('ready',function(){
    //autoUpdater.checkForUpdates();
    mainWindow = new BrowserWindow({
            show: false,
            resizable: true,
            //icon: path.join(__dirname, 'icons/logo.png'),
            webPreferences: {
                nodeIntegration: true,
            }
        });
    //mainWindow.setPosition(0,0);
    mainWindow.loadFile('index.html');
    mainWindow.on('ready-to-show', () =>{
        mainWindow.show();
    });
    mainWindow.on('close', function() {
        app.quit();
    });

})
function closeMain(){
    mainWindow.close();
}
