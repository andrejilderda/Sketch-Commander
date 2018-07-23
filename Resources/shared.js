"use strict";

export {
  commands,
  DEBUG,
  DEVMODE,
  BROWSERDEBUG
};

// Useful to debug the webview outside Sketch (using Gulp). 
// Do disable in production!
const DEBUG = false;
const DEVMODE = false;
const BROWSERDEBUG = false; // sets a few variables that are normally received from Sketch

/* 
  Regex (this is madness ;))
  1. check if there's a match with one of the commands that CAN NOT be combined (bdc, o, etc.)
  2. check if there's a group of commands that CAN be combined (e.g lrbt+100)
  3. also match any subsequent valid commands (e.b. rbt after l in previous example)
  
  Testing: https://regex101.com/r/TXQbhz/7
*/
const commandRegex = /^(bdc|bdr|bdw|bd|fs|f|lh|ttu|ttl|o|n|v)|(^[lrtbwhaxy]+(?!([lrtbwhaxy]))\2)/g,
  individualCommandsRegex = /(bdc|bdr|bdw|bd|fs|f|lh|ttu|ttl|o|n|v)/g,
  groupedCommandsRegex = /[lrtbwhaxy]/g,
  operatorRegex = /([\/+\-*%\=])/g,
  colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

export const commandList = [{
    notation: "bd",
    name: "Border",
    tags: "",
    defaultOperator: "+",
    expectedDataType: "integer"
  },
  {
    notation: "bdc",
    name: "Border-color",
    tags: "",
    defaultOperator: "#",
    expectedDataType: "color"
  },
  {
    notation: "bdr",
    name: "Border-radius",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "bdw",
    name: "Border-width",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "f",
    name: "Fill color",
    tags: "",
    defaultOperator: "#",
    expectedDataType: "color"
  },
  {
    notation: "fs",
    name: "Font-size",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "lh",
    name: "Line-height",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "ttu",
    name: "Text-transform: uppercase",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "ttl",
    name: "Text-transform: lowercase",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "o",
    name: "Opacity",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "l",
    name: "Left",
    tags: "resize",
    defaultOperator: "+",
    expectedDataType: "integer"
  },
  {
    notation: "r",
    name: "Right",
    tags: "resize",
    defaultOperator: "+",
    expectedDataType: "integer"
  },
  {
    notation: "t",
    name: "Top",
    tags: "resize",
    defaultOperator: "+",
    expectedDataType: "integer"
  },
  {
    notation: "b",
    name: "Bottom",
    tags: "resize",
    defaultOperator: "+",
    expectedDataType: "integer"
  },
  {
    notation: "w",
    name: "Width",
    tags: "resize",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "h",
    name: "Height",
    tags: "resize",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "a",
    name: "Resize all directions",
    tags: "",
    defaultOperator: "+",
    expectedDataType: "integer"
  },
  {
    notation: "x",
    name: "Move X",
    tags: "position",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "y",
    name: "Move Y",
    tags: "position",
    defaultOperator: "=",
    expectedDataType: "integer"
  },
  {
    notation: "n",
    name: "Rename layer",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "string"
  },
  {
    notation: "v",
    name: "Text value",
    tags: "",
    defaultOperator: "=",
    expectedDataType: "string"
  }
]


const commands = function() {
  let obj = [];

  function publicGetObj() {
    return obj;
  };

  function publicAddObj(newObj) {
    obj.push(newObj);
  }

  function publicParse(input) {
    splitCommands(input);
  }

  function publicClearObj() {
    obj = [];
  }


  function stripSpace(str) {
    if (str == null) return str;
    return str.replace(/^\s+/g, ''); // remove just the space at the beginning of a line
  }

  function getDefaultOperator(commandType) {
    let operator = searchPropInArray(commandType, "notation", commandList).defaultOperator;
    return operator;
  }

  function splitCommands(input) {
    // an array containing the command(s), e.g. ['lr100', 'x*2']
    input = input.split(",");

    for (let input of input) {
      input = String(stripSpace(input));
      
      // set up the base object
      var obj = {
        input: input,
        defaultOperator: false,
        isValid: false
      }

      // 1. splits the commands from the rest of the input, e.g. [ 'x', '*200' ], [ 'lr', '+10']
      // 2. filter out the undefined and empty ones
      const splitByCommandType = input.split(commandRegex).filter((val) => val);
      const commandType = splitByCommandType[0];
      // check if the command exists and it starts with a valid command. Else bail
      if (!commandType || !commandType.match(commandRegex)) {
        publicAddObj(obj);
        return;
      }; 
      
      // check if there's a value given already. Else leave it '' while the user is typing
      const commandWithoutType = '';
      if ( splitByCommandType[1] ) commandWithoutType = splitByCommandType[1];

      // strip the operator including all leftovers before that (f.e. the invalid 'q' in 'lrq+100')
      let value = commandWithoutType.split(operatorRegex).pop();
      
      let operator = commandWithoutType.match(operatorRegex);
      if (operator) operator = operator[0]; // check if operator is given. If not, set it to the first match
      
      // this is where the object with all commands is build
      
      // check if there are individual commands (e.g. ttu, bdc)
      if ( commandType.match(individualCommandsRegex) ) {
        let command = commandType;
        
        // if no operator, get the default operator
        if ( !operator ) operator = getDefaultOperator(command)
        if ( !operator ) obj.defaultOperator = true;
        
        // check if the command is valid (contains a valid commandtype, operator & value)
        if ( obj.type && obj.operator && obj.value ) obj.isValid = true
        // fill in the blanks
        obj.input = input;
        obj.type = command;
        obj.operator = operator;
        obj.value = value;
        publicAddObj(obj);
      }
      
      // if there are multiple commands from the groupedCommandsRegex (e.g. lr), loop through all of them individually
      else {
        var obj = {
          input: input,
          defaultOperator: false,
          isValid: false,
          items: []
        }
        commandType.match(groupedCommandsRegex).forEach((command, i) => { // array, e.g. ['l','r']
          obj.items[i] = {}
          // if no operator, get the default operator
          if ( !operator ) {
            operator = getDefaultOperator(command)
            obj.defaultOperator = true;
            obj.operator = operator;
          };
          obj.items[i].type = command;
          obj.items[i].operator = operator;
          obj.items[i].value = value;
          if ( obj.items[i].type && obj.items[i].operator && obj.items[i].value ) {
            obj.isValid = true
          }
        });
        publicAddObj(obj);
      }
    }
  }

  // function stripInput(input) {
  //   userInput = userInput.toString();
  //   userInput = userInput.toLowerCase();
  //   userInput = userInput.replace(/(px)/g, "");
  //   userInput = userInput.replace(/ /g, "");
  //   userInput = userInput.replace(/ /g, ",");
  // }

  return {
    add: publicAddObj,
    get: publicGetObj,
    clear: publicClearObj,
    parse: publicParse
  }
}();

// search through array object - https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
// returns the object with the result
function searchPropInArray(nameKey, prop, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][prop] === nameKey) {
      return myArray[i];
    }
  }
}
