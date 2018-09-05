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

export var selection = document.selectedLayers.layers;

export default function(context) {
  context = context;
  sketch = context.api(); // Load sketch API — http://developer.sketchapp.com/reference/api/
  doc = context.document;
  selection = document.selectedLayers.layers;
  
  
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
  
  // const selectedLayers = document.selectedLayers.layers; // just the selected layers
  // selectedLayers.forEach( item => {
  //   console.log(item.parentArtboard()); // no idea why this doesn't work
  // } )
  
  const pageLayers = deepLayerMap( pageLayersData, true );
  return pageLayers;
};

// function for getting all layers on current page in flat array
function deepLayerMap(obj, includeGroups) {
  var layerMap = [];
  console.log(obj);
  
  function recursiveFn( obj, includeGroups ) {
    obj.forEach( layer => {
      var val;
      
      if ( layer.type === 'Group' || layer.type === 'Artboard' && layer.layers ) {
        if ( includeGroups ) {
          // push group name and type
          layerMap.push({
            // woah, replace all characters that could break the webview (like: "'{}).
            name: layer.name.replace(/"/g, 'charDoubleQuote').replace(/'/g, 'charSingleQuote').replace(/{/g, 'charAccoladeOpen').replace(/}/g, 'charAccoladeClose'),
            type: layer.type
          });
          console.log('push it');
          console.log(layerMap);
        }
        // get the group's children layers
        val = recursiveFn( layer.layers, includeGroups );
      }
      else {
        val = { 
          name: layer.name.replace(/"/g, 'charDoubleQuote').replace(/'/g, 'charSingleQuote').replace(/{/g, 'charAccoladeOpen').replace(/}/g, 'charAccoladeClose'),
          type: layer.type
        }
      }
      layerMap.push( val );
    })
  }
  recursiveFn( obj, includeGroups );
  // flatten multi-level array
  // https://stackoverflow.com/questions/29158723/javascript-flattening-an-array-of-arrays-of-objects/29158772#29158772
  return [].concat.apply([], layerMap);
}

function loopThroughCommands(commandObj) {
  commandObj = JSON.parse(commandObj);
  
  // first check if there's a selection set... ('>layername')
  commandObj.forEach( function( command ) {
    const layerSelection = command.layerSelection;
    
    if ( layerSelection ) {
      const input = command.input.literal.replace( '>', '' );
      setLayerSelection( input )
    }
  });
  
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

function setLayerSelection( layerName ) {
  selection = select.searchLayers( layerName, 'artboard', selection );
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
