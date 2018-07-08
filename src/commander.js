import BrowserWindow from 'sketch-module-web-view';
var sketch = require('sketch');

import { commandList, DEBUG, DEVMODE, BROWSERDEBUG } from '../Resources/shared'

var sketch,
  context,
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
    x: 0,
    y: 0,
    width: 520,
    height: 280,
    frame: true,
    useContentSize: true,
    center: true,
    resizable: false,
    backgroundColor: '#222831',
    titlebarAppearsTransparent: true,
    onlyShowCloseButton: true,
    hideTitleBar: false,
    setTitlebarAppearsTransparent: true
  };
  const webUI = new BrowserWindow(options);
  webUI.loadURL('index.html');


  // 💫 Listeners: receive messages from the webview (listener)
  webUI.webContents.on('returnUserInput', (s) => {
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
    console.log('ready-to-show');
    webUI.show();

    // 💫 emitter: call a function in the webview
    // webUI.webContents.executeJavaScript('someGlobalFunctionDefinedInTheWebview("This text was sent by the Sketch plugin")');
    webUI.webContents.executeJavaScript('prevUserInput ="' + prevUserInput + '"');
    webUI.webContents.executeJavaScript('contextTabs ="' + contextTabs + '"');
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
  for (var k = 0; k < commandObj.length; k++) {
    commandType = commandObj[k].type;
    operator = commandObj[k].operator;
    amount = commandObj[k].amount;

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
          loopThroughSelection(resizeObject, commandType, amount, operator);
          break switchStatement;
        case "w":
        case "h":
          loopThroughSelection(setWidthHeightObject, commandType, amount, operator);
          break switchStatement;
        case "x":
        case "y":
          loopThroughSelection(moveObject, commandType, amount, operator);
          break switchStatement;
        case "fs":
          loopThroughSelection(textActions.setSize, amount, operator);
          break switchStatement;
        case "ttl":
          loopThroughSelection(textActions.convertLowerCase);
          break switchStatement;
        case "ttu":
          loopThroughSelection(textActions.convertUpperCase);
          break switchStatement;
        case "lh":
          loopThroughSelection(textActions.setLineheight, amount, operator);
          break switchStatement;
        case "v":
          loopThroughSelection(textActions.setValue, amount, operator);
          break switchStatement;
        case "n":
          loopThroughSelection(layerActions.rename, amount, operator);
          break switchStatement;
        case "bdc":
          loopThroughSelection(borderActions.setColor, amount, operator);
          break switchStatement;
        case "bdr":
          loopThroughSelection(borderActions.radius, amount, operator);
          break switchStatement;
        case "bdw":
          loopThroughSelection(borderActions.thickness, amount, operator);
          break switchStatement;
        case "bd":
          loopThroughSelection(borderActions.checkOperator, amount, operator);
          break switchStatement;
        case "f":
          loopThroughSelection(fillActions.setColor, amount, operator);
          break switchStatement;
        case "o":
          loopThroughSelection(fillActions.setOpacity, amount, operator);
          break switchStatement;
      }
  }
}

//////////////////////////////////////////////////////////////////
//  LAYER ACTIONS                                               //
//////////////////////////////////////////////////////////////////

function resizeObject(layer, command, amount, operator) {

  var calcAmount = Math.round(amount);
  if (operator == "-")
    calcAmount *= -1;

  switch (command) {
    case "a":
      resize(layer, calcAmount, calcAmount, calcAmount, calcAmount);
      break;
    case "l":
      resize(layer, 0, 0, 0, calcAmount);
      break;
    case "r":
      resize(layer, 0, calcAmount, 0, 0);
      break;
    case "t":
      resize(layer, calcAmount, 0, 0, 0);
      break;
    case "b":
      resize(layer, 0, 0, calcAmount, 0);
      break;
  }
}

function moveObject(layer, command, amount, operator) {
  var xAmount = Number(amount);
  var yAmount = Number(amount);
  var frame = layer.frame();
  var xCurrent = layer.absoluteRect().rulerX();
  var yCurrent = layer.absoluteRect().rulerY();

  if (operator == "-" || operator == "+") {
    if (operator == "-") {
      xAmount *= -1;
      yAmount *= -1;
    }
    if (command === "x") {
      layer.absoluteRect().setRulerX(xCurrent + xAmount);
    } else if (command === "y") {
      layer.absoluteRect().setRulerY(yCurrent + yAmount);
    }
  }
  if (operator == "=") {
    if (command === "x") {
      layer.absoluteRect().setRulerX(xAmount);
    } else if (command === "y") {
      layer.absoluteRect().setRulerY(yAmount);
    }
  }
}

// function is triggered when using operators = / * %
function setWidthHeightObject(layer, command, amount, operator) {
  var calcAmount = Math.round(amount);
  var frame = layer.frame();

  calcAmountPercentage = calcAmount / 100;

  frameHeight = frame.height();
  frameWidth = frame.width();

  // Set width or height =
  if (operator == "=") {
    if (command === "w")
      frame.setWidth(amount);
    else if (command === "h")
      frame.setHeight(amount);
  }
  // add or subtract width/height
  if (operator == "+" || operator == "-") {
    if (operator == "-") {
      calcAmount = calcAmount *= -1;
    }
    if (command === "w")
      resize(layer, 0, calcAmount, 0, 0);
    else if (command === "h")
      resize(layer, 0, 0, calcAmount, 0);
  }
  // Set percentage %
  else if (operator == "%") {
    if (command == 'h')
      frame.setHeight(Math.round(calcAmountPercentage * frameHeight));
    else
      frame.setWidth(Math.round(calcAmountPercentage * frameWidth));
  }
  // Divide /
  else if (operator == "/") {
    if (command == 'h')
      frame.setHeight(Math.round(frameHeight / amount));
    else
      frame.setWidth(Math.round(frameWidth / amount));
  }
  // Multiply *
  else if (operator == "*") {
    if (command == 'h')
      frame.setHeight(Math.round(frameHeight * amount));
    else {
      frame.setWidth(Math.round(frameWidth * amount));
    }
  }
}

// Function below is exactly the same as in Keyboard Resize
function resize(layer, t, r, b, l) {
  var frame = layer.frame();

  //if layer is a textlayer, set width to fixed
  if (layer.className() == "MSTextLayer") {
    layer.setTextBehaviour(1);
  }

  // Top
  if (t != 0) {
    if (frame.height() + t < 0) {
      var oldHeight = frame.height();
      frame.setHeight(1); // When contracting size prevent object to get a negative height (e.g. -45px).
      frame.setY(frame.y() + oldHeight - 1); // reposition the object
    } else {
      frame.setY(frame.y() - t); // push/pull object to correct position
      frame.setHeight(frame.height() + t);
    }
  }

  // Right
  if (r != 0) {
    frame.setWidth(frame.width() + r);
    if (frame.width() <= 1) {
      frame.setWidth(1);
    }
  }

  // Bottom
  if (b != 0) {
    frame.setHeight(frame.height() + b);
    if (frame.height() <= 1) {
      frame.setHeight(1);
    }
  }

  // Left
  if (l != 0) {
    if (frame.width() + l < 0) {
      var oldWidth = frame.width();
      frame.setWidth(1);
      frame.setX(frame.x() + oldWidth - 1);
    } else {
      frame.setX(frame.x() - l); // push/pull object to correct position
      frame.setWidth(frame.width() + l);
    }
  }
}

//////////////////////////////////////////////////////////////////
//  BORDER ACTIONS                                              //
//////////////////////////////////////////////////////////////////

var borderActions = {
  checkOperator: function(layer, color, operator) {
    switch (operator) {
      case '-':
        borderActions.remove(layer);
        break;
      case '+':
        borderActions.add(layer, color);
        break;
      case '#':
      case '=':
        borderActions.setColor(layer, color);
        break;
    }
  },
  setColor: function(layer, color) {
    var style = new sketch.Style(); // requires access to the Sketch js API
    var borders = layer.style().borders();

    // check if there's a border, if not add a new one
    if (borders.count() <= 0) {
      layer.style().addStylePartOfType(1);
    }

    var border = borders.lastObject();
    color = color.replace("#", "");

    border.color = style.colorFromString("#" + color);
  },
  add: function(layer, color) {
    var style = new sketch.Style();
    var border = layer.style().addStylePartOfType(1);

    // if no color is given (like bd+) set the color to black
    color = (color !== "") ? color : "000000";
    // basic check to find out if the user tries to add a width in stead of a color
    if (color.length > 2) {
      color = color.replace("#", "");
      border.color = style.colorFromString("#" + color);
    } else {
      var thickness = color;
      border.thickness = thickness;
    }
  },
  remove: function(layer) {
    var style = new sketch.Style();
    var borderCount = layer.style().borders().length - 1;
    var border = layer.style().removeStyleBorderAtIndex(borderCount);
  },
  radius: function(layer, value, operator) {
    if (layer && layer.isKindOfClass(MSShapeGroup)) {
      var shape = layer.layers().firstObject();
      if (shape && shape.isKindOfClass(MSRectangleShape)) {
        var radius = shape.cornerRadiusFloat();
        shape.cornerRadiusFloat = mathOps(radius, value, operator);
      }
    }
  },
  thickness: function(layer, thickness, operator) {
    thickness = Number(thickness);
    // are there any borders?
    var border = layer.style().borders().lastObject();
    if (border != null) {
      var borderThickness = layer.style().borders().lastObject().thickness();
      border.thickness = mathOps(borderThickness, thickness, operator);
    } else {
      this.add(layer, thickness);
    }
  }
}

//////////////////////////////////////////////////////////////////
//  TEXT ACTIONS                                                //
//////////////////////////////////////////////////////////////////

var textActions = {
  setSize: function(layer, value, operator) {
    value = Number(value);
    if (layer.className() == "MSTextLayer") {
      var fontSize = layer.fontSize();
      layer.fontSize = mathOps(fontSize, value, operator);
    }
  },
  setLineheight: function(layer, value, operator) {
    value = Number(value);
    if (layer.className() == "MSTextLayer") {
      var prevLineHeight = layer.lineHeight();
      layer.lineHeight = mathOps(prevLineHeight, value, operator);
    }
  },
  setValue: function(layer, value, operator) {
    if (layer.className() == "MSTextLayer") {
      var prevTextValue = layer.stringValue();

      if (operator == "+") {
        layer.stringValue = prevTextValue + value;
      } else if (operator == "-") {
        prevTextValue = prevTextValue.replace(value, "");
        layer.stringValue = textValue;
      } else {
        layer.stringValue = value;
      }
    }
  },
  convertLowerCase: function(layer) {
    if (layer.className() == "MSTextLayer") {
      var textValue = layer.stringValue();
      var newValue = textValue.toLowerCase();
      layer.stringValue = newValue;
    }
  },
  convertUpperCase: function(layer) {
    if (layer.className() == "MSTextLayer") {
      var textValue = layer.stringValue();
      var newValue = textValue.toUpperCase();
      layer.stringValue = newValue;
    }
  }
}
var layerActions = {
  rename: function(layer, value, operator) {
    layerName = layer.name();
    layer.nameIsFixed = 1;

    if (operator == "+") {
      layer.name = layerName + value;
    } else if (operator == "-") {
      layerName = layerName.replace(value, "");
      layer.name = layerName;
    } else {
      layer.name = value;
    }
  }
}

//////////////////////////////////////////////////////////////////
//  FILL ACTIONS                                               //
//////////////////////////////////////////////////////////////////

var fillActions = {
  setColor: function(layer, color) {

    if (layer.className() == "MSTextLayer") {
      color = makeColor(color);
      layer.setTextColor(color);
    }
    if (layer instanceof MSShapeGroup) {
      var style = new sketch.Style();
      var fills = layer.style().fills();

      // create fill if there are none
      if (fills.count() <= 0) {
        fills.addStylePartOfType(0);
      }
      var fill = fills.firstObject();
      color = color.replace("#", "");

      //set color to first fill layer style
      fill.color = style.colorFromString("#" + color);
    }
  },
  // ,
  // copyColor : function() {
  //     
  // },
  setOpacity: function(layer, opacity) {
    opacity = opacity / 100;
    layer.style().contextSettings().setOpacity(opacity);
  }
}

//////////////////////////////////////////////////////////////////
//  GENERIC FUNCTIONS                                           //
//////////////////////////////////////////////////////////////////

// simple math operations for - + * / %
function mathOps(input, value, operator) {
  input = Number(input);
  value = Number(value);

  if (operator == "+")
    return input + value;
  else if (operator == "-")
    return input - value;
  else if (operator == "*")
    return input * value;
  else if (operator == "/")
    return input / value;
  else if (operator == "%")
    return input * (value / 100);
  else
    return value;
}

// makeColor function to convert hex values to MSColor (from http://sketchplugins.com/d/8-global-colors-gradients/2)
function makeColor(SVGString) {
  return MSImmutableColor.colorWithSVGString(SVGString).newMutableCounterpart();
}
