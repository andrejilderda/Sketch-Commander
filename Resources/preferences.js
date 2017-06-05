import pluginCall from 'sketch-module-web-view/client'
import { getCommandsObj, obj, commandList } from './shared'


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

inputField.addEventListener('keydown', function(e){
    // close on keydown enter or escape key
    if (e.keyCode === 27) {
        pluginCall('closeModal');
    }
    if (e.keyCode === 13) {
        if (cyclingThroughOptions) {
            selectOption();
        }
        else {
            pluginCall('returnUserInput', inputField.value);
            pluginCall('nativeLog', getCommandsObj());
        }
    }
    if (e.keyCode == 9) {
        e.preventDefault();
        if(!cyclingThroughOptions) {
            keys["tab"] = true;
            if(!keys["shift"]) {        
                switchContextAction(+1);
            }
        } else {
            selectOption();
        }
    }
    if (e.keyCode == 40) { //down arrow
        e.preventDefault();
        navigateThroughActionlist(+1);
    }
    if (e.keyCode == 38) { //up arrow
        e.preventDefault();
        navigateThroughActionlist(-1);
    }
    if (e.keyCode == 16) { //shift
        keys["shift"] = true;
    }
    if (keys["shift"] && keys["tab"]) {
        e.preventDefault();
        switchContextAction(-1);
    }
},false);

inputField.addEventListener('keyup', function(e){
    if ( e.keyCode != 40 && e.keyCode != 38 ) { //don't parse input on pressing ↑ or ↓ arrow
        parseInput();
    }
    
    // reset status of the keypress
    if (e.keyCode == 9) {
        keys["tab"] = false;
    }
    if (e.keyCode == 16) { //shift
        keys["shift"] = false;
    }
});

// function to replace current input value with the notation of selected option
function selectOption() {
    var optionsUlNodes = optionsUl.childNodes;
    for (var i = 0; i < optionsUlNodes.length; i++) {
        if ( (" " + optionsUlNodes[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" is-active ") > -1 ) {
            var el = optionsUlNodes[i];
            setInputValue(el.dataset.notation + el.dataset.defaultOperator);
        }
    }
};


function parseInput() {
    if (DEBUG) console.log(getCommandsObj());
    
    inputFieldValue = document.querySelector('.c-commander').value;
    commands = getCommandsObj();
    commandsUl.innerHTML = ''; // remove existing elements
    
    for(var i = 0; i < commands.length; i++) {
        var commandType = commands[i].type;
        var commandTypeName = commandList.filter(function ( commandTypeName ) {
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
    if( getCommandsObj().length > 0 ) { 
        optionsUl.style.display = "none";
        navigateThroughActionlist('reset');
    } else { // no valid commands entered (yet)
        optionsUl.style.display = "block";
        filterActionlist();
    }
    
    // inputfield is empty
    if( inputFieldValue == "") {
        navigateThroughActionlist('reset');
    }
}



function listCommands() {
    for (var key in commandList) {
        var commandTypeName = commandList[key].name;
        var commandNotation = commandList[key].notation;
        var commandTags = commandList[key].tags;
        var commandDefaultOperator = commandList[key].defaultOperator;
        var li = document.createElement('li');
        
        li.addEventListener("click", function(e) {
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
var setActionContext = (function() {    
    var elements = document.querySelectorAll('.c-action-context__item');
    var isActive = document.querySelector('.c-action-context__item.is-active');
    // wait until there's an active context__item which is set in index.html. Consider this an ugly hack...
    var waitTillActiveClassIsApplied = window.setInterval(function() {    
        for(var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains("is-active")) {
                currentAction = i;
                if (DEBUG) console.log("currentAction = " + currentAction);
                clearInterval(waitTillActiveClassIsApplied);
            }
        }
    }, 1);
    setActionContext = function(){}; // only run once
})();

// for filtering the action list as long as there are no matching commands found
function filterActionlist() {
    var optionsItems = document.querySelectorAll(".c-command-options-list__item");
    var optionsArray = Array.from(optionsItems);

    optionsArray.filter( function( el ) {
        var filter = inputFieldValue.toLowerCase();
        var filteredItems = el.dataset.notation + " " + el.dataset.name + " " + el.dataset.tags;
        // console.log(el.dataset.name + ":   " + filteredItems.toLowerCase().indexOf(filter));
        if (filteredItems.toLowerCase().indexOf(filter) == -1 ) {
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
    
    actionContext.forEach(function(el){
        el.classList.remove('is-active');
    })
    actionContextLists.forEach(function(el){
        el.classList.remove('is-active');
    })
    actionContext[index].classList.toggle('is-active');
    actionContextLists[index].classList.toggle('is-active');
    pluginCall('saveContext', index);
}

// for navigating through the actionlist
var selectedAction = -1;
function navigateThroughActionlist(value) {
    if ( value == 'reset' ) {
        selectedAction = -1;
    }
    else if ( value == 'selectFirst' ) {
        selectedAction = 0;
        var newAction = 0;
    }
    else {
        var newAction = selectedAction += value;
    }

    var actionList = document.querySelectorAll(".c-command-options-list__item:not(.is-hidden)");

    var length = actionList.length + 1;
    var index = mod(newAction, length);
    cyclingThroughOptions = true;
    if (!value) { selectedAction++ }
    
    actionList.forEach(function(el){
        el.classList.remove('is-active');
    })

    if (actionList[index] != undefined) {
        actionList[index].classList.toggle('is-active');
        // this useful sucker surprisingly works in safari/webview
        if (DEBUG) actionList[index].scrollIntoViewIfNeeded(false);
    }
    else {
        cyclingThroughOptions = false;
    }
}

// lists the selected layers
var listSelectedLayers = (function() {    
    var selectedLayerList = document.querySelector('.c-selection-list');
    // wait until there's input received from Sketch in index.html. Consider this an ugly hack...
    var waitTillSketchInputIsReceived = window.setInterval(function() {    
        // received array from Sketch is actually a string, lets convert it into a real array again
        layerNameArray = layerNameArray.split(',');
        
        for(var i = 0; i < layerNameArray.length; i++) {
            // create the list
            var li = document.createElement('li');
            li.classList.add('c-selection-list__item');
            li.innerHTML = layerNameArray[i];
            selectedLayerList.append(li);
        }
        clearInterval(waitTillSketchInputIsReceived);
    }, 1);
    listSelectedLayers = function(){}; // only run once
})();

// http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving/13163436#13163436
var mod = function (n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};
