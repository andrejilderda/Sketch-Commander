import BrowserWindow from 'sketch-module-web-view';

var sketch = require('sketch');



// Create webview
export default function(context) {
  const options = {
    title: 'Sketch Commander',
    identifier: 'com.sketchapp.commander', // to reuse the UI
    x: 0,
    y: 0,
    width: 520,
    height: 280,
    frame: false
  }
  const webUI = new BrowserWindow(options);
  webUI.loadURL('index.html');
  
  // wait for the webview to be 'ready-to-show' to prevent flickering
  webUI.once('ready-to-show', () => {
    console.log('ready-to-show');
    webUI.show();
    
    // 💫 emitter: call a function in the webview
    webUI.webContents.executeJavaScript('someGlobalFunctionDefinedInTheWebview("This text was sent by the Sketch plugin")');
  })
  // 💫 listener: receive messages from the webview (listener)
  webUI.webContents.on('nativeLog', function(s) {
    // will log it to Sketch in a toast message
    // sketch.UI.message(s)
    
    // will log it to 'Plugin Output' in the Console
    console.log(s);
  })
  return webUI;
};
