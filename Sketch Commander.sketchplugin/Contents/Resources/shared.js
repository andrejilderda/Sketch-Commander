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
/******/ 	return __webpack_require__(__webpack_require__.s = "./Resources/shared.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ })

/******/ });
//# sourceMappingURL=shared.js.map