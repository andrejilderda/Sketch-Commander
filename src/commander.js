import BrowserWindow from 'sketch-module-web-view';
import {
    commandList,
    DEBUG,
    BROWSERDEBUG,
    onlySelectors,
    getSelectorNames,
    getSelectors
} from './shared';
import { resizeObject, moveObject, setWidthHeightObject, resize, borderActions, textActions, layerActions, fillActions, mathOps, makeColor } from './layer-actions';
import * as select from './select-actions';

var sketch = require('sketch');
var Settings = require('sketch/settings');
var sketchUI = require('sketch/ui');
var document = require('sketch/dom').getSelectedDocument();
var Artboard = require('sketch/dom').Artboard;
var Page =  require('sketch/dom').Page;
var Document = require('sketch/dom').Document;

var context,
doc,
userInput,
prevUserInput = "";

const data = {
    contextTabs: ""
}

export let selection = document.selectedLayers ? document.selectedLayers.layers : [];

export default function(context) {
    context = context;
    sketch = context.api(); // Load sketch API — http://developer.sketchapp.com/reference/api/
    doc = context.document;
    
    // does a userInputSetting already exist?
    try {
        prevUserInput = Settings.settingForKey("userInputSetting");
        data.contextTabs = Settings.settingForKey("contextTabs");
    } catch (e) { // else reset history
        Settings.setSettingForKey("userInputSetting", "");
        Settings.setSettingForKey("contextTabs", "");
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
    const url = DEBUG ? 'http://localhost:3000' : 'index.html';
    webUI.loadURL(url);
    
    
    // 💫 Listeners: receive messages from the webview (listener)
    webUI.webContents.on('returnUserInput', (s) => {
        if (DEBUG) console.log('USER INPUT:');
        if (DEBUG) console.log(s);
        
        Settings.setSettingForKey('userInputSetting', s);
    });

    webUI.webContents.on('saveContext', (s) => {
        if (DEBUG) console.log('received context: ' + s);
        // make sure the contextTabs are updated when executing Sketch functions also
        data.contextTabs = s;
        
        Settings.setSettingForKey('contextTabs', s);
    });

    webUI.webContents.on('requestPageLayers', () => {
        if (DEBUG) console.log('Page layers requested by webUI');
        webUI.webContents.executeJavaScript("setPageLayers('" + JSON.stringify( getPageLayers() ) + "')");
    });

    webUI.webContents.on('toast', (s) => {
        // will log it to Sketch in a toast message
        sketchUI.message(s);
    });
    
    webUI.webContents.on('nativeLog', (s) => {
        // will log it to 'Plugin Output' in the Console
        if (DEBUG) console.log(s);
    });
    
    webUI.webContents.on('closeExecute', (s) => {
        if (DEBUG) console.log(s);
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
        webUI.webContents.executeJavaScript('contextTabsInit("' + data.contextTabs + '")');
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
    
    // if there's an expand selection command ('>>') the selection should expand.
    // It will apply the commands to the selected layers AND the layers that are >selected.
    
    // check whether a expandSelection ('>>') is found. Coerces to true/false, which is used
    // as an argument for setLayerSelection()
    const expand = commandObj.filter( item => item.expandSelection).length >= 1;
    
    // when only one or multiple selectors are passed (f.e. '>layername'), we assume the user wants to select
    // these layers, so we deselect the currently selected layers to select the new ones.
    if (onlySelectors(commandObj)) document.selectedLayers.clear();
    
    // first check if there's a selection set ('>layername').
    // If so we use that to apply our commands to...
    const filteredSelectors = getSelectors(commandObj);

    filteredSelectors.map((command, index) => {
        const input = command.input.literal.replace( />/gi, '' );
        setLayerSelection( input, index, expand, onlySelectors );
    });
    
    // ...then continue going through all commands
    commandObj.forEach( function( command ) {
        if ( !command.selector ) {
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

function setLayerSelection( layerName, index, expand, selectLayers ) {
    let newSelection = [];
    const currentSelection = selection || [];
    if ( !expand ) newSelection = []; // if expand is false (default), reset the current selection
    else newSelection = currentSelection;

    select.searchLayers( layerName, data.contextTabs, currentSelection ).map(item => {
        newSelection.push(item);
    });

    // select the layers when argument is given
    if ( selectLayers ) {
        newSelection.forEach( layer => layer.selected = true );
    }
    
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
