"use strict";

export {
  commands,
  DEBUG,
  DEVMODE,
  BROWSERDEBUG
};

// DEVMODE sets a few variables that are normally received from Sketch
// Useful to debug the webview outside Sketch (using Gulp). 
// Do disable in production!
const DEBUG = true;
const DEVMODE = true;
const BROWSERDEBUG = true;

/* 
  Regex (this is madness ;))
  1. check if there's a match with one of the commands that CAN NOT be combined (bdc, o, etc.)
  2. check if there's a group of commands that CAN be combined (e.g lrbt+100)
  3. also match any subsequent valid commands (e.b. rbt after l in previous example)
  
  Testing: https://regex101.com/r/TXQbhz/7
*/
const commandRegex = /^(bdc|bdr|bdw|bd|fs|f|lh|ttu|ttl|o|n|v)|(^[lrtbwhaxy]+(?!([lrtbwhaxy]))\2)/g,
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

  const init = (function() {
    publicParse();
  })();

  function publicGetObj() {
    return obj;
  };

  function publicSetObj(newObj) {
    const props = ['type', 'operator', 'value'];
    const command = {};
    for (var key in newObj) {
      command[props[key]] = newObj[key];
    };
    obj.push(command);
  }

  function publicParse() {
    splitCommands();
  }

  function publicClearObj() {
    obj = [];
  }


  function stripSpace(str) {
    if (str == null) return str;
    return str.replace(/^\s+/g, ''); // remove just the space at the beginning of a line
  }

  function splitCommands() {
    // an array containing the command(s), e.g. ['lr100', 'x*2']
    const commands = document.querySelector(".c-commander").value.split(",");

    for (let item of commands) {
      item = String(stripSpace(item));

      // 1. splits the commands from the rest of the item, e.g. [ 'x', '*200' ], [ 'lr', '+10']
      // 2. filter out the undefined and empty ones
      const splitByCommandType = item.split(commandRegex).filter((val) => val);
      const commandType = splitByCommandType[0];
      const commandWithoutType = '';
      if (!commandType) return;
      
      // check if there's a value given or it's just a command while the user's typing
      if ( splitByCommandType[1] ) {
          commandWithoutType = splitByCommandType[1];
      }

      // strip the operator including all leftovers before that (f.e. the invalid 'q' in 'lrq')
      let value = commandWithoutType.split(operatorRegex).pop();

      // check if there are multiple commands (e.g. lr) and loop through all of them
      commandType.match(groupedCommandsRegex).forEach(function(command) { // array, e.g. ['l','r']

        let operator = commandWithoutType.match(operatorRegex);
        // check if operator is given -> if not, set default operator
        if (operator) operator = operator[0];
        else {
          operator = searchPropInArray(command, "notation", commandList).defaultOperator
        };

        publicSetObj([command, operator, value]);
      });
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
    get: publicGetObj,
    set: publicSetObj,
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
