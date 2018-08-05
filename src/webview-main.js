import pluginCall from 'sketch-module-web-view/client'

// DEVMODE sets a few variables that are normally received from Sketch
// Useful to debug the webview outside Sketch (using Gulp). 
// Do disable in production!
if (BROWSERDEBUG) {
  // prevUserInput = " ";
  let prevUserInput = "lr100, lr-100, tv=bla, x*200";
  let contextTabs = 0;
  let selectedLayerNameArray = 'testlayer 1,testlayer 2';
  let artboardLayerNameArray = 'testlayer 1,testlayer 2';
};

function returnToSketch(name, args) {
  if (DEBUG) console.log('triggered returnToSketch():' + name + '       Arguments: ' + args);
  if (BROWSERDEBUG) return;
  pluginCall(name, args);
}

var btn = document.querySelector('#btn');
var inputField = document.querySelector('.c-commander');
var replace = document.querySelector('#replace');

var contextTabs = document.querySelectorAll(".c-context-tab__item");
var contextList = document.querySelectorAll(".c-context-list");
var currentContext = 0;
var commandsUl = document.querySelector(".c-commands-list");
var optionsUl = document.querySelector(".c-options-list");

var inputFieldValue = document.querySelector('.c-commander').innerText;
var cyclingThroughOptions = false;

let valueHistory = [];
let prevInputLength = inputField.textContent.length;
let inputArray = [];


function setInputValue(value) {
  inputField.value = value;
}
inputField.focus();

// Key event listeners
let tabKeyPressed = false;

function getInputValue() {
  return document.querySelector(".c-commander").innerText.replace(/\n/g,'');
}

inputField.addEventListener('input', onInput);
inputField.addEventListener('keydown', onKeydown, false);
inputField.addEventListener('keyup', onKeyup);

function onInput(e) {
  inputFieldValue = this.innerText;
  
  valueHistory.unshift(inputFieldValue); // add to history array
  if ( valueHistory.length >= 20 ) valueHistory.pop(); // limit history length
  
  parseInput();
};

function onKeydown(e) {
  
  // when user presses cmd+z
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    e.preventDefault();
    handleUndo();
  }
  
  // close on keydown enter or escape key
  if (e.keyCode === 27) {
    returnToSketch('closeModal');
  }
  if (e.keyCode === 13) {
    if (cyclingThroughOptions) {
      selectOption();
    } else {
      returnToSketch('returnUserInput', getInputValue());
      returnToSketch('closeExecute', JSON.stringify(commands.get()));
    }
  }
  if (e.keyCode == 9) { // tab
    e.preventDefault();
    if (!cyclingThroughOptions) {
      tabKeyPressed = true;
      if (!e.shiftKey) {
        switchContextAction('next');
      }
    } else {
      selectOption();
    }
  }
  if (e.keyCode == 40) { //down arrow
    e.preventDefault();
    navigateThroughList(+1);
  }
  if (e.keyCode == 38) { //up arrow
    e.preventDefault();
    navigateThroughList(-1);
  }
  if (e.shiftKey && tabKeyPressed) {
    e.preventDefault();
    switchContextAction('prev');
  }
};

function onKeyup(e) {
  // reset status of tab keypress
  if (e.keyCode == 9) tabKeyPressed = false;
};

function parseInput() {
  inputFieldValue = getInputValue();
  if ( !inputFieldValue ) return;
  commands.clear();
  commands.parse(getInputValue());
  renderInput();
}

function renderInput() {
  let currentCaretPosition = getCaretPosition(inputField);
  const commandsLength = commands.get().length;
  
  let html = '';
  commands.get().forEach( function(item, index) {
    let inputLiteral = item.input.literal;
    let inputSplit = item.input.split;
    let type = item.type;
    let element = '';
    const notLastNotOnly = commandsLength > 0 && commandsLength - 1 !== index;

    // * ⚠️ BEWARE: don't try to format the elements below nicely, since it will be interpreted as text and mess up the caret positioning
    // by default just output the users' literal input
    let input = item.input.literal;
    // format the input differently when the default operator is applied
    if ( type && item.defaultOperator === true ) {
      input = `<span class="c-command__type" data-default-operator='${item.operator}'>${inputSplit[0]}</span>${inputSplit[1] ? inputSplit[1] : ''}`;
    }
    if ( inputLiteral ) {
      element = `<span class="c-command  ${item.isValid ? 'c-command--is-valid' : '' }">${input}</span>`
    }
    
    html += element;
    // we append the , comma again when it's not the last and only command
    if ( notLastNotOnly ) html += '<span class=c-command__seperator>,</span>';
  })
  
  inputField.innerHTML = html.trim().replace(/\n/g,'');
  
  handleCaretPosition( inputField, currentCaretPosition );
}




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
// function renderCommandsList() {
//   commandsUl.innerHTML = ''; // remove existing elements
//   for (var i = 0; i < items.length; i++) {
//     // var commandType = items[i].type;
//     // var commandTypeName = commandList.filter(function(commandTypeName) {
//     //   return commandTypeName.notation === commandType;
//     // })[0];
//     // commandTypeName = commandTypeName.name;
//     // 
//     // // create the list
//     // var li = document.createElement('li');
//     // li.classList.add('c-commands-list__item');
//     // li.innerHTML = commandTypeName + " " + items[i].operator + " " + items[i].amount;
//     // commandsUl.append(li);
//   }
//   // one or more valid commands have been entered
//   if (items.length > 0) {
//     optionsUl.style.display = "none";
//     navigateThroughList('reset');
//   } else { // no valid commands entered (yet)
//     optionsUl.style.display = "block";
//     filterActionlist();
//   }
// 
//   // inputfield is empty
//   if (inputFieldValue == "") {
//     navigateThroughList('reset');
//   }
// }

// triggered whenever the user presses cmd + z
function handleUndo() {
  if ( valueHistory[0] ) {
    inputFieldValue = valueHistory[1];
    valueHistory.shift();
    renderInput();
  };
}

// for switching task contexts
function switchContextAction(value) {
  if (value == 'next')
    currentContext = currentContext + 1;
  else if (value == 'prev')
    currentContext = currentContext - 1;
  else
    currentContext = value;

  var length = contextTabs.length;
  var index = mod(currentContext, length);

  contextTabs.forEach(function(el) {
    el.classList.remove('is-active');
  })
  contextList.forEach(function(el) {
    el.classList.remove('is-active');
  })
  // triggers visibility of both active tab as the list below
  contextTabs[index].classList.toggle('is-active');
  contextList[index].classList.toggle('is-active');

  returnToSketch('saveContext', index);
}

// lists the selected layers
const listSelectedLayers = function() {
  var selectedLayerList = document.querySelector('.c-selection-list');
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
  }
};
