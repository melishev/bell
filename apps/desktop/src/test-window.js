const { BrowserWindow } = require('electron')

function createModal(){
  const window = new BrowserWindow({
    width: 300,
    height: 168,
    frame: false, // https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows

    alwaysOnTop: true,
    // hasShadow: false,

    resizable: false,
  });

  window.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })
  inputModal.setAlwaysOnTop(true, 'pop-up-menu')
  
  // inputModal.loadFile(path.join(__dirname, "modal.html"));

  // inputModal.webContents.openDevTools();
}

module.exports = createModal