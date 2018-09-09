import BrowserWindow from 'sketch-module-web-view';
import { commandList, DEBUG, DEVMODE, BROWSERDEBUG } from './shared';
import { resizeObject, moveObject, setWidthHeightObject, resize, borderActions, textActions, layerActions, fillActions, mathOps, makeColor } from './layer-actions';
import * as select from './select-actions';

var sketch = require('sketch');
var Settings = require('sketch/settings');
var document = require('sketch/dom').getSelectedDocument();
var Artboard = require('sketch/dom').Artboard;
var Page =  require('sketch/dom').Page;
var Document = require('sketch/dom').Document;

var context,
  doc,
  userInput,
  prevUserInput = "";

export let selection = document.selectedLayers.layers;

export default function(context) {
  context = context;
  sketch = context.api(); // Load sketch API — http://developer.sketchapp.com/reference/api/
  doc = context.document;
  
  // does a userInputSetting already exist?
  try {
    prevUserInput = Settings.settingForKey("userInputSetting");
  } catch (e) { // else reset history
    Settings.setSettingForKey("userInputSetting", "");
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
    Settings.setSettingForKey('userInputSetting', s);
  });
  webUI.webContents.on('requestPageLayers', () => {
    console.log('Page layers requested by webUI');
    webUI.webContents.executeJavaScript("setPageLayers('" + JSON.stringify( getPageLayers() ) + "')");
  });
  webUI.webContents.on('nativeLog', (s) => {
    // will log it to Sketch in a toast message
    // sketch.UI.message(s)

    // will log it to 'Plugin Output' in the Console
    console.log(s);
  });

  webUI.webContents.on('closeExecute', (s) => {
    loopThroughCommands(s);
    doc.reloadInspector();
    webUI.close();
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
  })

  return webUI;
}

// create array with selected layers
const getPageLayers = function() {
  const pageLayersData = document.selectedPage.layers;
  const pageLayers = select.loopThroughChildLayers( pageLayersData, select.replaceDangerousCharacters );
  return pageLayers;
};



function loopThroughCommands(commandObj) {
  commandObj = JSON.parse(commandObj);
  
  // coerces to true/false based on whether an expand selection command ('>>') is found
  const expandSelection = commandObj.filter( item => {
    if ( item.expandSelection ) return true;
  }).length >= 1;
  
  // first check if there's a selection set... ('>layername')
  const layerSelect = commandObj.filter( item => {
    if ( item.layerSelection ) return true;
  }).forEach( ( command, index ) => {
    const input = command.input.literal.replace( />/gi, '' );
    setLayerSelection( input, index, expandSelection )
  })
  
  // ...then continue going through all commands
  commandObj.forEach( function( command ) {
    if ( !command.layerSelection ) {
      const commandType = command.type;
      const operator = command.operator;
      const value = command.value;
      
      // loop through commands when an array with multiple commands is passed (f.e. ['l','r'] from 'lr+100')
      if ( Array.isArray(commandType) ) commandType.forEach( item => executeCommand(item, operator, value) )
      else executeCommand(commandType, operator, value);
      if (DEBUG) console.log(`executeCommand: ${commandType}  ${operator}  ${value}` )
    }
  });
}

function setLayerSelection( layerName, index, expand ) {
  let newSelection;
  if ( !expand ) newSelection = []; // if expand is false (default), reset the current selection
  else newSelection = selection;
  
  newSelection.push( select.searchLayers( layerName, 'artboard', selection )[0] );
  selection = newSelection;
}
 
function executeCommand(commandType, operator, value) {
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


// loop through layer selection
function loopThroughSelection(callback) {
  if (callback && typeof callback === 'function') {    
    selection.forEach(layer => {
      // make a copy of the passed in arguments
      var args = Array.prototype.slice.call(arguments);
      // overwrite the passed in function name with the layer
      args[0] = layer;
      // run the callback function with the function name and use the arguments
      callback.apply(callback[0], args);
    });
  }
}
