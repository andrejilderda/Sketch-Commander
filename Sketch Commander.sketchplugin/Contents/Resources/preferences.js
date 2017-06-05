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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function (actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  var args = [].slice.call(arguments).slice(1)
  var previousHash = (window.location.hash.split('?')[1] ? window.location.hash.split('?')[0] : window.location.hash)
  window.location.hash = previousHash +
    '?pluginAction=' + encodeURIComponent(actionName) +
    '&actionId=' + Date.now() +
    '&pluginArgs=' + encodeURIComponent(JSON.stringify(args))
  return
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
// TODO:
// [ ] if input is empty, list all options
// [ ] being able to navigate through options with ↑ ↓ arrows
// [ ] tab adds value to input-field

exports.getCommandsObj = getCommandsObj;


var DEBUG = false,
    commandRegex = /(bdc)|(bdr)|(bdw)|(bd)|(fs)|(f)|(lh)|(ttu)|(ttl)|(o)|[lrtbwhaxynv]/g,
    operatorRegex = /[\/+\-*%\=]/g;
// export var commandList = {
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

var commandList = exports.commandList = [{
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
    "notation": "fs",
    "name": "Font-size",
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

    var num = 1;
    // check if there are multiple commands
    if (userInput.indexOf(",") > 0) {
        num = userInput.split(",").length;
        commandArray = userInput.split(",");
    } else {
        commandArray[0] = userInput;
    }

    // commandArray = array with all the commands that were put in, for example [0]=lr+20,[1]=h/2)
    // command = one single command, for example b-30 or lr+20
    for (var i = 0; i < commandArray.length; i++) {
        command = commandArray[i];

        // first check if command contains a hex color value. This check is necessary so that characters in colors are not seen as commands (like 'f' in #ff0000)
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
            var operator;

            // check which operator is being used (f.e. +, -, *, etc. )
            if (command.indexOf("*") >= 0) operator = "*";else if (command.indexOf("/") >= 0) operator = "/";else if (command.indexOf("%") >= 0) operator = "%";else if (command.indexOf("=") >= 0) operator = "=";else if (command.indexOf("-") >= 0) operator = "-";else if (command.indexOf("+") >= 0) operator = "+";else if (command.indexOf("#") >= 0) operator = "#";

            // commandMinOperator = command.replace(operator, "");
            // amount = commandMinOperator.replace(commandRegex, "");
            commandMinOperator = command.split(operator)[0];
            amount = command.split(operator)[1];
            commandTypeArray = commandMinOperator.match(commandRegex);

            // loop through all the commands, like 'lr' in 'lr+20')
            if (commandTypeArray) {
                for (var j = 0; j < commandTypeArray.length; j++) {
                    commandType = commandTypeArray[j].toString();
                    // get the expectedDataType to validate if the operation is allowed
                    var expectedDataType = searchPropInArray(commandType, "notation", commandList).expectedDataType;

                    // if another notation is used like 'w20%' or w20
                    if (amount == "" || amount == undefined) {
                        var numbers = command.match(/\d+/g);
                        if (numbers != null) {
                            amount = numbers;
                        }
                    }

                    // is amount a number?
                    if (expectedDataType == "integer") {
                        if (isNaN(amount) !== true) {
                            // if no operator is used like 'w20'
                            if (!operator) {
                                // when resize directions are used set + as default, else =
                                if (commandType == "l" || commandType == "r" || commandType == "t" || commandType == "b" || commandType == "a" || commandType == "w" || commandType == "h") operator = "+";else operator = "=";
                            }

                            obj.push({
                                type: commandType,
                                amount: amount,
                                operator: operator
                            });
                        }
                    } else if (expectedDataType == "string" || expectedDataType == "color") {
                        if (operator) {
                            obj.push({
                                type: commandType,
                                amount: amount,
                                operator: operator
                            });
                        }
                    }
                    if (DEBUG) {
                        // console.log("commandType: " + commandType + "    amount: " + amount + "    operator: " + operator)
                    }
                }
            }
        }
    }
    return obj;
}

// function isNumericalAction( command ) {
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var _client = __webpack_require__(0);

var _client2 = _interopRequireDefault(_client);

var _shared = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var btn = document.querySelector('#btn');
var inputField = document.querySelector('.c-commander');
var replace = document.querySelector('#replace');

var actionContext = document.querySelectorAll(".c-action-context__item");
var actionContextLists = document.querySelectorAll(".c-action-context-list");
var currentAction = 0;
var commandsUl = document.querySelector(".c-commands-list");
var optionsUl = document.querySelector(".c-command-options-list");

var inputFieldValue = document.querySelector('.c-commander').value;
var commands;
var cyclingThroughOptions = false;

var DEBUG = false;

function setInputValue(value) {
    inputField.value = value;
}
inputField.focus();

// Key event listeners
var keys = {
    shift: false,
    tab: false
};

inputField.addEventListener('keydown', function (e) {
    // close on keydown enter or escape key
    if (e.keyCode === 27) {
        (0, _client2['default'])('closeModal');
    }
    if (e.keyCode === 13) {
        if (cyclingThroughOptions) {
            selectOption();
        } else {
            (0, _client2['default'])('returnUserInput', inputField.value);
            (0, _client2['default'])('nativeLog', (0, _shared.getCommandsObj)());
        }
    }
    if (e.keyCode == 9) {
        e.preventDefault();
        if (!cyclingThroughOptions) {
            keys["tab"] = true;
            if (!keys["shift"]) {
                switchContextAction(+1);
            }
        } else {
            selectOption();
        }
    }
    if (e.keyCode == 40) {
        //down arrow
        e.preventDefault();
        navigateThroughActionlist(+1);
    }
    if (e.keyCode == 38) {
        //up arrow
        e.preventDefault();
        navigateThroughActionlist(-1);
    }
    if (e.keyCode == 16) {
        //shift
        keys["shift"] = true;
    }
    if (keys["shift"] && keys["tab"]) {
        e.preventDefault();
        switchContextAction(-1);
    }
}, false);

inputField.addEventListener('keyup', function (e) {
    if (e.keyCode != 40 && e.keyCode != 38) {
        //don't parse input on pressing ↑ or ↓ arrow
        parseInput();
    }

    // reset status of the keypress
    if (e.keyCode == 9) {
        keys["tab"] = false;
    }
    if (e.keyCode == 16) {
        //shift
        keys["shift"] = false;
    }
});

// function to replace current input value with the notation of selected option
function selectOption() {
    var optionsUlNodes = optionsUl.childNodes;
    for (var i = 0; i < optionsUlNodes.length; i++) {
        if ((" " + optionsUlNodes[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" is-active ") > -1) {
            var el = optionsUlNodes[i];
            setInputValue(el.dataset.notation + el.dataset.defaultOperator);
        }
    }
};

function parseInput() {
    if (DEBUG) console.log((0, _shared.getCommandsObj)());

    inputFieldValue = document.querySelector('.c-commander').value;
    commands = (0, _shared.getCommandsObj)();
    commandsUl.innerHTML = ''; // remove existing elements

    for (var i = 0; i < commands.length; i++) {
        var commandType = commands[i].type;
        var commandTypeName = _shared.commandList.filter(function (commandTypeName) {
            return commandTypeName.notation === commandType;
        })[0];
        commandTypeName = commandTypeName.name;

        // create the list
        var li = document.createElement('li');
        li.classList.add('c-commands-list__item');
        li.innerHTML = commandTypeName + " " + commands[i].operator + " " + commands[i].amount;
        commandsUl.append(li);
    }
    // one or more valid commands have been entered
    if ((0, _shared.getCommandsObj)().length > 0) {
        optionsUl.style.display = "none";
        navigateThroughActionlist('reset');
    } else {
        // no valid commands entered (yet)
        optionsUl.style.display = "block";
        filterActionlist();
    }

    // inputfield is empty
    if (inputFieldValue == "") {
        navigateThroughActionlist('reset');
    }
}

function listCommands() {
    for (var key in _shared.commandList) {
        var commandTypeName = _shared.commandList[key].name;
        var commandNotation = _shared.commandList[key].notation;
        var commandTags = _shared.commandList[key].tags;
        var commandDefaultOperator = _shared.commandList[key].defaultOperator;
        var li = document.createElement('li');

        li.addEventListener("click", function (e) {
            setInputValue(e.target.dataset.notation);
            inputField.focus();
            parseInput();
        });
        li.classList.add('c-command-options-list__item');
        li.dataset.notation = commandNotation;
        li.dataset.name = commandTypeName;
        li.dataset.tags = commandTags;
        li.dataset.defaultOperator = commandDefaultOperator;
        li.innerHTML = commandTypeName;
        optionsUl.append(li);

        var span = document.createElement('span');
        span.classList.add('c-command-options-list__notation');
        span.innerHTML = commandNotation;
        li.prepend(span);
    }
};
listCommands();

// sets the active context when opening the webview (only runs once)
var setActionContext = function () {
    var elements = document.querySelectorAll('.c-action-context__item');
    var isActive = document.querySelector('.c-action-context__item.is-active');
    // wait until there's an active context__item which is set in index.html. Consider this an ugly hack...
    var waitTillActiveClassIsApplied = window.setInterval(function () {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains("is-active")) {
                currentAction = i;
                if (DEBUG) console.log("currentAction = " + currentAction);
                clearInterval(waitTillActiveClassIsApplied);
            }
        }
    }, 1);
    setActionContext = function setActionContext() {}; // only run once
}();

// for filtering the action list as long as there are no matching commands found
function filterActionlist() {
    var optionsItems = document.querySelectorAll(".c-command-options-list__item");
    var optionsArray = Array.from(optionsItems);

    optionsArray.filter(function (el) {
        var filter = inputFieldValue.toLowerCase();
        var filteredItems = el.dataset.notation + " " + el.dataset.name + " " + el.dataset.tags;
        // console.log(el.dataset.name + ":   " + filteredItems.toLowerCase().indexOf(filter));
        if (filteredItems.toLowerCase().indexOf(filter) == -1) {
            el.classList.add("is-hidden");
        } else {
            el.classList.remove("is-hidden");
        }
        navigateThroughActionlist('selectFirst');
    });
}

// for switching task contexts
function switchContextAction(value) {
    var newAction = currentAction += value;
    var length = actionContext.length;
    var index = mod(newAction, length);

    actionContext.forEach(function (el) {
        el.classList.remove('is-active');
    });
    actionContextLists.forEach(function (el) {
        el.classList.remove('is-active');
    });
    actionContext[index].classList.toggle('is-active');
    actionContextLists[index].classList.toggle('is-active');
    (0, _client2['default'])('saveContext', index);
}

// for navigating through the actionlist
var selectedAction = -1;
function navigateThroughActionlist(value) {
    if (value == 'reset') {
        selectedAction = -1;
    } else if (value == 'selectFirst') {
        selectedAction = 0;
        var newAction = 0;
    } else {
        var newAction = selectedAction += value;
    }

    var actionList = document.querySelectorAll(".c-command-options-list__item:not(.is-hidden)");

    var length = actionList.length + 1;
    var index = mod(newAction, length);
    cyclingThroughOptions = true;
    if (!value) {
        selectedAction++;
    }

    actionList.forEach(function (el) {
        el.classList.remove('is-active');
    });

    if (actionList[index] != undefined) {
        actionList[index].classList.toggle('is-active');
        // this useful sucker surprisingly works in safari/webview
        if (DEBUG) actionList[index].scrollIntoViewIfNeeded(false);
    } else {
        cyclingThroughOptions = false;
    }
}

// lists the selected layers
var listSelectedLayers = function () {
    var selectedLayerList = document.querySelector('.c-selection-list');
    // wait until there's input received from Sketch in index.html. Consider this an ugly hack...
    var waitTillSketchInputIsReceived = window.setInterval(function () {
        // received array from Sketch is actually a string, lets convert it into a real array again
        layerNameArray = layerNameArray.split(',');

        for (var i = 0; i < layerNameArray.length; i++) {
            // create the list
            var li = document.createElement('li');
            li.classList.add('c-selection-list__item');
            li.innerHTML = layerNameArray[i];
            selectedLayerList.append(li);
        }
        clearInterval(waitTillSketchInputIsReceived);
    }, 1);
    listSelectedLayers = function listSelectedLayers() {}; // only run once
}();

// http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving/13163436#13163436
var mod = function mod(n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};

/***/ })
/******/ ]);