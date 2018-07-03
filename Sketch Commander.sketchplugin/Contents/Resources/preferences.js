/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Resources/preferences.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Resources/preferences.js":
/*!**********************************!*\
  !*** ./Resources/preferences.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch-module-web-view/client */ "./node_modules/sketch-module-web-view/client.js");
/* harmony import */ var sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared */ "./Resources/shared.js");


var btn = document.querySelector('#btn');
var inputField = document.querySelector('.c-commander');
var replace = document.querySelector('#replace');
var contextTabs = document.querySelectorAll(".c-context-tab__item");
var contextList = document.querySelectorAll(".c-context-list");
var currentContext = 0;
var commandsUl = document.querySelector(".c-commands-list");
var optionsUl = document.querySelector(".c-options-list");
var inputFieldValue = document.querySelector('.c-commander').value;
var commands;
var cyclingThroughOptions = false;
var DEBUG = true;

function setInputValue(value) {
  inputField.value = value;
}

inputField.focus(); // Key event listeners

var keys = {
  shift: false,
  tab: false
};
inputField.addEventListener('keydown', function (e) {
  // close on keydown enter or escape key
  if (e.keyCode === 27) {
    sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0___default()('closeModal');
  }

  if (e.keyCode === 13) {
    if (cyclingThroughOptions) {
      selectOption();
    } else {
      sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0___default()('returnUserInput', inputField.value);
      sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0___default()('nativeLog', Object(_shared__WEBPACK_IMPORTED_MODULE_1__["getCommandsObj"])());
    }
  }

  if (e.keyCode == 9) {
    e.preventDefault();

    if (!cyclingThroughOptions) {
      keys["tab"] = true;

      if (!keys["shift"]) {
        switchContextAction('next');
      }
    } else {
      selectOption();
    }
  }

  if (e.keyCode == 40) {
    //down arrow
    e.preventDefault();
    navigateThroughList(+1);
  }

  if (e.keyCode == 38) {
    //up arrow
    e.preventDefault();
    navigateThroughList(-1);
  }

  if (e.keyCode == 16) {
    //shift
    keys["shift"] = true;
  }

  if (keys["shift"] && keys["tab"]) {
    e.preventDefault();
    switchContextAction('prev');
  }
}, false);
inputField.addEventListener('keyup', function (e) {
  if (e.keyCode != 40 && e.keyCode != 38) {
    //don't parse input on pressing ↑ or ↓ arrow
    parseInput();
  } // reset status of the keypress


  if (e.keyCode == 9) {
    keys["tab"] = false;
  }

  if (e.keyCode == 16) {
    //shift
    keys["shift"] = false;
  }
}); // function to replace current input value with the notation of selected option

function selectOption() {
  var optionsUlNodes = optionsUl.childNodes;

  for (var i = 0; i < optionsUlNodes.length; i++) {
    if ((" " + optionsUlNodes[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" is-active ") > -1) {
      var el = optionsUlNodes[i];
      setInputValue(el.dataset.notation + el.dataset.defaultOperator);
    }
  }
}

;

function parseInput() {
  if (DEBUG) console.log(Object(_shared__WEBPACK_IMPORTED_MODULE_1__["getCommandsObj"])());
  inputFieldValue = document.querySelector('.c-commander').value;
  commands = Object(_shared__WEBPACK_IMPORTED_MODULE_1__["getCommandsObj"])();
  commandsUl.innerHTML = ''; // remove existing elements

  for (var i = 0; i < commands.length; i++) {
    var commandType = commands[i].type;
    var commandTypeName = _shared__WEBPACK_IMPORTED_MODULE_1__["commandList"].filter(function (commandTypeName) {
      return commandTypeName.notation === commandType;
    })[0];
    commandTypeName = commandTypeName.name; // create the list

    var li = document.createElement('li');
    li.classList.add('c-commands-list__item');
    li.innerHTML = commandTypeName + " " + commands[i].operator + " " + commands[i].amount;
    commandsUl.append(li);
  } // one or more valid commands have been entered


  if (Object(_shared__WEBPACK_IMPORTED_MODULE_1__["getCommandsObj"])().length > 0) {
    optionsUl.style.display = "none";
    navigateThroughList('reset');
  } else {
    // no valid commands entered (yet)
    optionsUl.style.display = "block";
    filterActionlist();
  } // inputfield is empty


  if (inputFieldValue == "") {
    navigateThroughList('reset');
  }
}

function listCommands() {
  for (var key in _shared__WEBPACK_IMPORTED_MODULE_1__["commandList"]) {
    var commandTypeName = _shared__WEBPACK_IMPORTED_MODULE_1__["commandList"][key].name;
    var commandNotation = _shared__WEBPACK_IMPORTED_MODULE_1__["commandList"][key].notation;
    var commandTags = _shared__WEBPACK_IMPORTED_MODULE_1__["commandList"][key].tags;
    var commandDefaultOperator = _shared__WEBPACK_IMPORTED_MODULE_1__["commandList"][key].defaultOperator;
    var li = document.createElement('li');
    li.addEventListener("click", function (e) {
      setInputValue(e.target.dataset.notation);
      inputField.focus();
      parseInput();
    });
    li.classList.add('c-options-list__item');
    li.dataset.notation = commandNotation;
    li.dataset.name = commandTypeName;
    li.dataset.tags = commandTags;
    li.dataset.defaultOperator = commandDefaultOperator;
    li.innerHTML = commandTypeName;
    optionsUl.append(li);
    var span = document.createElement('span');
    span.classList.add('c-options-list__notation');
    span.innerHTML = commandNotation;
    li.prepend(span);
  }
}

;
listCommands(); // for filtering the action list as long as there are no matching commands found

function filterActionlist() {
  var optionsItems = document.querySelectorAll(".c-options-list__item");
  var optionsArray = Array.from(optionsItems);
  optionsArray.filter(function (el) {
    var filter = inputFieldValue.toLowerCase();
    var filteredItems = el.dataset.notation + " " + el.dataset.name + " " + el.dataset.tags; // console.log(el.dataset.name + ":   " + filteredItems.toLowerCase().indexOf(filter));

    if (filteredItems.toLowerCase().indexOf(filter) == -1) {
      el.classList.add("is-hidden");
    } else {
      el.classList.remove("is-hidden");
    }

    var result = optionsArray.sort(function (a, b) {
      if (inputFieldValue === a.dataset.notation) {
        return a.dataset.notation - b.dataset.notation;
      }

      return a.dataset.notation - b.dataset.notation;
    });
    console.log(result[0]);
    navigateThroughList('selectFirst');
  });
} // for switching task contexts


function switchContextAction(value) {
  if (value == 'next') currentContext = currentContext + 1;else if (value == 'prev') currentContext = currentContext - 1;else currentContext = value;
  var length = contextTabs.length;
  var index = mod(currentContext, length);
  contextTabs.forEach(function (el) {
    el.classList.remove('is-active');
  });
  contextList.forEach(function (el) {
    el.classList.remove('is-active');
  }); // triggers visibility of both active tab as the list below

  contextTabs[index].classList.toggle('is-active');
  contextList[index].classList.toggle('is-active');
  sketch_module_web_view_client__WEBPACK_IMPORTED_MODULE_0___default()('saveContext', index);
} // for navigating through the actionlist


var selectedAction = -1;

function navigateThroughList(value) {
  var listItems = document.querySelectorAll(".c-context-list.is-active .c-options-list__item:not(.is-hidden)");

  if (value == 'reset') {
    selectedAction = -1;
  } else if (value == 'selectFirst') {
    // used when filtering items
    selectedAction = 0;
  } else if (!value) {
    selectedAction++;
  } else {
    if (Number.isInteger(value)) selectedAction = selectedAction += value;
  }

  var length = listItems.length + 1; // so that it's possible to have nothing selected

  var index = mod(selectedAction, length);
  cyclingThroughOptions = true;
  listItems.forEach(function (el) {
    el.classList.remove('is-active');
  });

  if (listItems[index] != undefined) {
    listItems[index].classList.toggle('is-active'); // this useful sucker surprisingly works in safari/webview, but lets keep it disabled when debugging in FF

    if (DEBUG) listItems[index].scrollIntoViewIfNeeded(false);
  } else {
    cyclingThroughOptions = false;
  }
} // sets the active context when opening the webview (only runs once)


var setActiveContextOnInit = function () {
  // wait until there's an active context__item which is set in index.html. This can probably done with promises, but this ugly hack works...
  var waitTillActiveClassIsApplied = window.setInterval(function () {
    var elements = document.querySelectorAll('.c-context-tab__item');
    var isActive = document.querySelector('.c-context-tab__item.is-active');

    for (var i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains("is-active")) {
        switchContextAction(i);
        if (DEBUG) console.log("currentContext = " + currentContext);
        clearInterval(waitTillActiveClassIsApplied);
      }
    }
  }, 1);

  setActiveContextOnInit = function setActiveContextOnInit() {}; // overwrite self-invoked function so that it can only run once

}(); // lists the selected layers


var listSelectedLayers = function () {
  var selectedLayerList = document.querySelector('.c-selection-list'); // wait until there's input received from Sketch in index.html. This can probably done with promises, but this ugly hack works...

  var waitTillSketchInputIsReceived = window.setInterval(function () {
    // received array from Sketch is actually a string, lets convert it into a real array again
    if (artboardLayerNameArray) {
      // if (artboardLayerNameArray && selectedLayerNameArray) {
      artboardLayerNameArray = artboardLayerNameArray.split(',');
      selectedLayerNameArray = selectedLayerNameArray.split(',');

      for (var i = 0; i < artboardLayerNameArray.length; i++) {
        // create the list
        var li = document.createElement('li');
        li.classList.add('c-options-list__item');
        li.innerHTML = artboardLayerNameArray[i];
        selectedLayerList.append(li);
      }

      clearInterval(waitTillSketchInputIsReceived);
    }
  }, 10);

  listSelectedLayers = function listSelectedLayers() {}; // overwrite self-invoked function so that it can only run once

}(); // http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving/13163436#13163436


var mod = function mod(n, m) {
  var remain = n % m;
  return Math.floor(remain >= 0 ? remain : remain + m);
};

/***/ }),

/***/ "./Resources/shared.js":
/*!*****************************!*\
  !*** ./Resources/shared.js ***!
  \*****************************/
/*! exports provided: getCommandsObj, commandList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCommandsObj", function() { return getCommandsObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "commandList", function() { return commandList; });

var DEBUG = true,
    commandRegex = /(bdc)|(bdr)|(bdw)|(bd)|(fs)|(f)|(lh)|(ttu)|(ttl)|(o)|[lrtbwhaxynv]/g,
    operatorRegex = /[\/+\-*%\=]/g; // export var commandList = {
//     "bdc" : { "name" : "Border-color" },
//     "bdr" : { "name" : "Border-radius" },
//     "bdw" : { "name" : "Border-width" },
//     "bd" : { "name" : "Border" },
//     "fs" : { "name" : "Font-size" },
//     "f" : { "name" : "Fill color" },
//     "lh" : { "name" : "Line-height" },
//     "ttu" : { "name" : "Text-transform: uppercase" },
//     "ttl" : { "name" : "Text-transform: lowercase" },
//     "o" : { "name" : "Opacity" },
//     "l" : { "name" : "Left" },
//     "r" : { "name" : "Right" },
//     "t" : { "name" : "Top" },
//     "b" : { "name" : "Bottom" },
//     "w" : { "name" : "Width" },
//     "h" : { "name" : "Height" },
//     "a" : { "name" : "All directions" },
//     "x" : { "name" : "Move X" },
//     "y" : { "name" : "Move Y" },
//     "n" : { "name" : "Rename layer" },
//     "v" : { "name" : "Text value" }
// }

var commandList = [{
  "notation": "bd",
  "name": "Border",
  "tags": "",
  "defaultOperator": "+",
  "expectedDataType": "integer"
}, {
  "notation": "bdc",
  "name": "Border-color",
  "tags": "",
  "defaultOperator": "#",
  "expectedDataType": "color"
}, {
  "notation": "bdr",
  "name": "Border-radius",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "bdw",
  "name": "Border-width",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "f",
  "name": "Fill color",
  "tags": "",
  "defaultOperator": "#",
  "expectedDataType": "color"
}, {
  "notation": "fs",
  "name": "Font-size",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "lh",
  "name": "Line-height",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "ttu",
  "name": "Text-transform: uppercase",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "ttl",
  "name": "Text-transform: lowercase",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "o",
  "name": "Opacity",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "l",
  "name": "Left",
  "tags": "resize",
  "defaultOperator": "+",
  "expectedDataType": "integer"
}, {
  "notation": "r",
  "name": "Right",
  "tags": "resize",
  "defaultOperator": "+",
  "expectedDataType": "integer"
}, {
  "notation": "t",
  "name": "Top",
  "tags": "resize",
  "defaultOperator": "+",
  "expectedDataType": "integer"
}, {
  "notation": "b",
  "name": "Bottom",
  "tags": "resize",
  "defaultOperator": "+",
  "expectedDataType": "integer"
}, {
  "notation": "w",
  "name": "Width",
  "tags": "resize",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "h",
  "name": "Height",
  "tags": "resize",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "a",
  "name": "Resize all directions",
  "tags": "",
  "defaultOperator": "+",
  "expectedDataType": "integer"
}, {
  "notation": "x",
  "name": "Move X",
  "tags": "position",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "y",
  "name": "Move Y",
  "tags": "position",
  "defaultOperator": "=",
  "expectedDataType": "integer"
}, {
  "notation": "n",
  "name": "Rename layer",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "string"
}, {
  "notation": "v",
  "name": "Text value",
  "tags": "",
  "defaultOperator": "=",
  "expectedDataType": "string"
}];
var colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
var escapedValue,
    commandArray = [];

function getCommandsObj(userInput) {
  var userInput = document.getElementById("c-commander").value;
  var obj = [];
  userInput = userInput.toString();
  userInput = userInput.toLowerCase();
  userInput = userInput.replace(/(px)/g, "");
  userInput = userInput.replace(/ /g, "");
  userInput = userInput.replace(/ /g, ",");
  var num = 1; // check if there are multiple commands

  if (userInput.indexOf(",") > 0) {
    num = userInput.split(",").length;
    commandArray = userInput.split(",");
  } else {
    commandArray[0] = userInput;
  } // commandArray = array with all the commands that were put in, for example [0]=lr+20,[1]=h/2)
  // command = one single command, for example b-30 or lr+20


  for (var i = 0; i < commandArray.length; i++) {
    var command = commandArray[i]; // first check if command contains a hex color value. This check is necessary so that characters in colors are not seen as commands (like 'f' in #ff0000)

    if (command.match(colorRegex)) {
      var commandWithoutColor = command.replace(colorRegex, ''); //strip out the color values
      // check if input contains valid commands

      if (commandWithoutColor.match(commandRegex)) {
        // multiple commands are accepted (f.e. fbdc#ff0000) = fill & borderColor
        for (var j = 0; j < commandWithoutColor.match(commandRegex).length; j++) {
          commandType = commandWithoutColor.match(commandRegex)[j].toString();
          amount = command.match(colorRegex);
          obj.push({
            type: commandType,
            amount: amount[0],
            operator: "="
          });
        }
      }
    } else {
      var amount;
      var operator; // check which operator is being used (f.e. +, -, *, etc. )

      if (command.indexOf("*") >= 0) operator = "*";else if (command.indexOf("/") >= 0) operator = "/";else if (command.indexOf("%") >= 0) operator = "%";else if (command.indexOf("=") >= 0) operator = "=";else if (command.indexOf("-") >= 0) operator = "-";else if (command.indexOf("+") >= 0) operator = "+";else if (command.indexOf("#") >= 0) operator = "#"; // commandMinOperator = command.replace(operator, "");
      // amount = commandMinOperator.replace(commandRegex, "");

      var commandMinOperator = command.split(operator)[0];
      amount = command.split(operator)[1];
      var commandTypeArray = commandMinOperator.match(commandRegex); // loop through all the commands, like 'lr' in 'lr+20')

      if (commandTypeArray) {
        for (var j = 0; j < commandTypeArray.length; j++) {
          var _commandType = commandTypeArray[j].toString(); // get the expectedDataType to validate if the operation is allowed


          var expectedDataType = searchPropInArray(_commandType, "notation", commandList).expectedDataType; // if another notation is used like 'w20%' or w20

          if (amount == "" || amount == undefined) {
            var numbers = command.match(/\d+/g);

            if (numbers != null) {
              amount = numbers;
            }
          } // is amount a number?


          if (expectedDataType == "integer") {
            if (isNaN(amount) !== true) {
              // if no operator is used like 'w20'
              if (!operator) {
                // when resize directions are used set + as default, else =
                if (_commandType == "l" || _commandType == "r" || _commandType == "t" || _commandType == "b" || _commandType == "a" || _commandType == "w" || _commandType == "h") operator = "+";else operator = "=";
              }

              obj.push({
                type: _commandType,
                amount: amount,
                operator: operator
              });
            }
          } else if (expectedDataType == "string" || expectedDataType == "color") {
            if (operator) {
              obj.push({
                type: _commandType,
                amount: amount,
                operator: operator
              });
            }
          }

          if (DEBUG) {// console.log("commandType: " + commandType + "    amount: " + amount + "    operator: " + operator)
          }
        }
      }
    }
  }

  return obj;
} // function isNumericalAction( command ) {
//     operator = command.match(operatorRegex)[0];
//     if ( operator == '%' ) {
//         amount = command.replace(operatorRegex, "");
//         amount = command.replace(commandRegex, "");
//         // is amount a number?
//         if ( isNaN(amount) !== true ) {
//             
//         }
//     }
//     
//     return true;
// }
// search through array object - https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
// returns the object with the result


function searchPropInArray(nameKey, prop, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][prop] === nameKey) {
      return myArray[i];
    }
  }
}

/***/ }),

/***/ "./node_modules/sketch-module-web-view/client.js":
/*!*******************************************************!*\
  !*** ./node_modules/sketch-module-web-view/client.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CONSTANTS = __webpack_require__(/*! ./lib/constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports = function(actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  window[CONSTANTS.JS_BRIDGE].callNative(
    JSON.stringify([].slice.call(arguments))
  )
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/constants.js":
/*!**************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/constants.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  JS_BRIDGE: '__skpm_sketchBridge',
}


/***/ })

/******/ });
//# sourceMappingURL=preferences.js.map