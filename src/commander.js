import BrowserWindow from 'sketch-module-web-view';
import { commandList, DEBUG, DEVMODE, BROWSERDEBUG } from '../Resources/shared';
import { resizeObject, moveObject, setWidthHeightObject, resize, mathOps, makeColor } from './layer-actions'

var sketch = require('sketch');
var context,
  doc,
  selection,
  userInput,
  prevUserInput = "",
  contextTabs = "";

export default function(context) {
  context = context;
  sketch = context.api(); // Load sketch API — http://developer.sketchapp.com/reference/api/
  doc = context.document;
  selection = context.selection;

  // does a userInputSetting already exist?
  try {
    prevUserInput = sketch.settingForKey("userInputSetting");
    contextTabs = sketch.settingForKey("contextTabs");
  } catch (e) { // else reset history
    sketch.setSettingForKey("userInputSetting", "");
    sketch.setSettingForKey("contextTabs", "");
  }

  // create BrowserWindow
  const options = {
    title: 'Sketch Commander',
    identifier: 'com.sketchapp.commander', // to reuse the UI
    width: 520,
    height: 280,
    frame: false,
    useContentSize: true,
    center: true,
    resizable: false,
    backgroundColor: '#222831'
  };
  const webUI = new BrowserWindow(options);
  webUI.loadURL('index.html');


  // 💫 Listeners: receive messages from the webview (listener)
  webUI.webContents.on('returnUserInput', (s) => {
    // if (DEBUG) console.log('USER INPUT:');
    // if (DEBUG) console.log(s);
    sketch.setSettingForKey('userInputSetting', s);
  });
  webUI.webContents.on('saveContext', (s) => {
    sketch.setSettingForKey('contextTabs', s);
  });
  webUI.webContents.on('nativeLog', (s) => {
    // will log it to Sketch in a toast message
    // sketch.UI.message(s)

    // will log it to 'Plugin Output' in the Console
    console.log(s);
  });

  webUI.webContents.on('closeExecute', (s) => {
    webUI.close();
    executeCommand(s);
    doc.reloadInspector();
  });
  
  webUI.webContents.on('closeModal', () => {
    webUI.close();
  });

  // close webview when loosing focus
  webUI.on('blur', () => {
    webUI.close();
  });

  // wait for the webview to be 'ready-to-show' to prevent flickering
  webUI.once('ready-to-show', () => {
    if (DEBUG) console.log('ready-to-show');
    webUI.show();

    // 💫 emitter: call a function in the webview
    webUI.webContents.executeJavaScript('prevUserInput("' + prevUserInput + '")');
    webUI.webContents.executeJavaScript('contextTabsInit("' + contextTabs + '")');
    webUI.webContents.executeJavaScript('selectedLayerNameArray ="' + getSelectedLayerNames() + '"');
    webUI.webContents.executeJavaScript('artboardLayerNameArray ="' + getArtboardLayers() + '"');
  })


  return webUI;
}

const getArtboardLayers = function() {
  // create array with artboard layers
  var artboardNames = [];
  var selectedArtboard = doc.currentPage().currentArtboard()
  var artboardLayers = selectedArtboard.layers();

  for (var i = 0; i < artboardLayers.count(); i++) {
    var layer = artboardLayers.objectAtIndex(i);
    // artboardLayerNameArray.push(layer.name());
    artboardLayerNameArray.push(layer.objectID());
  }
  return artboardNames;
};

// create array with selected layers
const getSelectedLayerNames = function() {
  const layerNames = [];
  for (var i = 0; i < selection.count(); i++) {
    var layer = selection.objectAtIndex(i);
    // selectedLayerNameArray.push(layer.name());
    layerNames.push(layer.objectID());
  }
  return layerNames;
};


function executeCommand(commandObj) {
  commandObj = JSON.parse(commandObj);

  for (var k = 0; k < commandObj.length; k++) {
    const commandType = commandObj[k].type;
    const operator = commandObj[k].operator;
    const value = commandObj[k].value;
    
    if (DEBUG) console.log('executeCommand:' + commandType + "   " + operator + "   " + value )

    // loop through layer selection
    function loopThroughSelection(callback) {
      if (callback && typeof callback === 'function') {
        for (var i = 0; i < selection.count(); i++) {
          var layer = selection.objectAtIndex(i);
          // make a copy of the passed in arguments
          var args = Array.prototype.slice.call(arguments);
          // overwrite the passed in function name with the layer
          args[0] = layer;
          // run the callback function with the function name and use the arguments
          callback.apply(callback[0], args);
        };
      }
    }

    switchStatement:
      switch (commandType) {
        case "l":
        case "r":
        case "t":
        case "b":
        case "a":
          loopThroughSelection(resizeObject, commandType, value, operator);
          break switchStatement;
        case "w":
        case "h":
          loopThroughSelection(setWidthHeightObject, commandType, value, operator);
          break switchStatement;
        case "x":
        case "y":
          loopThroughSelection(moveObject, commandType, value, operator);
          break switchStatement;
        case "fs":
          loopThroughSelection(textActions.setSize, value, operator);
          break switchStatement;
        case "ttl":
          loopThroughSelection(textActions.convertLowerCase);
          break switchStatement;
        case "ttu":
          loopThroughSelection(textActions.convertUpperCase);
          break switchStatement;
        case "lh":
          loopThroughSelection(textActions.setLineheight, value, operator);
          break switchStatement;
        case "v":
          loopThroughSelection(textActions.setValue, value, operator);
          break switchStatement;
        case "n":
          loopThroughSelection(layerActions.rename, value, operator);
          break switchStatement;
        case "bdc":
          loopThroughSelection(borderActions.setColor, value, operator);
          break switchStatement;
        case "bdr":
          loopThroughSelection(borderActions.radius, value, operator);
          break switchStatement;
        case "bdw":
          loopThroughSelection(borderActions.thickness, value, operator);
          break switchStatement;
        case "bd":
          loopThroughSelection(borderActions.checkOperator, value, operator);
          break switchStatement;
        case "f":
          loopThroughSelection(fillActions.setColor, value, operator);
          break switchStatement;
        case "o":
          loopThroughSelection(fillActions.setOpacity, value, operator);
          break switchStatement;
      }
  }
}
