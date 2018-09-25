"use strict";
export {
  commands,
  DEBUG,
  BROWSERDEBUG
};

// Useful to debug the webview outside Sketch (using Gulp).
// Do disable in production!
const DEBUG = false;
const BROWSERDEBUG = false; // sets a few variables that are normally received from Sketch

/*
  Regex (this is madness ;))
  1. check if there's a match with one of the commands that CAN NOT be combined (bdc, o, etc.)
  2. check if there's a group of commands that CAN be combined (e.g lrbt+100)
  3. also match any subsequent valid commands (e.b. rbt after l in previous example)

  Testing: https://regex101.com/r/TXQbhz/7
*/
const commandRegex = /^(bdc|bdr|bdw|bd|fs|lh|ttu|ttl|c|f|o|n|v)|(^[lrtbwhaxy]+(?!([lrtbwhaxy]))\2)/g,
  individualCommandsRegex = /^(bdc|bdr|bdw|bd|fs|lh|ttu|ttl|c|f|o|n|v)/g,
  groupedCommandsRegex = /^[lrtbwhaxy]+(?!([lrtbwhaxy]))/g,
  operatorRegex = /^([\/+\-*%#\=])/,
  colorRegex = /^\s*#?(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\s*$/;

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
    notation: "c",
    name: "Color",
    tags: "",
    defaultOperator: "#",
    expectedDataType: "color"
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
    tags: ""
  },
  {
    notation: "ttl",
    name: "Text-transform: lowercase",
    tags: ""
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

  // returns the matching command from commandList by commandType
  // f.e. 'commandType( bd )' returns the border object from commandList
  function getCommandByType(commandType) {
    if ( !commandType ) return;
    return searchPropInArray(commandType, "notation", commandList);
  }

  function splitCommands(input) {
    if ( !input ) return;

    // an array containing the command(s), e.g. ['lr100', 'x*2']
    input = input.split(",");

    for (let input of input) {
      input = String(stripSpace(input));


      // 1. splits the commands from the rest of the input, e.g. [ 'x', '*200' ], [ 'lr', '+10']
      // 2. filter out the undefined and empty ones
      const splitByCommandType = input.split(commandRegex).filter((val) => val);
      var commandType = '';
      if ( splitByCommandType ) commandType = splitByCommandType[0];

      // set up the base object
      let obj = {
        input: {
          literal: input,
          split: splitByCommandType
        },
        defaultOperator: false,
        isValid: false
      }

      // check if the command contains a valid commandtype. Else just add the object containing the input
      const noValidCommandType = !commandType || !commandType.match(individualCommandsRegex) && !commandType.match(groupedCommandsRegex);

      if ( input[0] === '>' ) {
        obj.selector = true;
        // when input is '>>' we want to expand the selection in stead of replacing it
        if ( input[1] === '>' ) obj.expandSelection = true;
        if ( input.replace( />/g, '' ).length > 0 ) obj.isValid = true; // when the '>' is followed by a character we're good
      };
      if ( noValidCommandType ) publicAddObj(obj);
      else {
        // check if there's a value given already. Else leave it '' while the user is typing
        let commandWithoutType = '';
        if ( splitByCommandType[1] ) commandWithoutType = splitByCommandType[1];

        // strip the operator including all leftovers before that (f.e. the invalid 'q' in 'lrq+100')
        let value = commandWithoutType.split(operatorRegex).pop();

        // regex only matches the operators that come right after the command type
        // (f.e. 'a+100' is valid, but 'a100+' as an operator is not.
        // latter will be interpret as 'command: a' 'defaultOperator: +' 'value: 100+')
        let operator = operatorRegex.exec(commandWithoutType);
        if (operator) operator = operator[0]; // check if operator is given. If so, set it to the first match

        // fill in the blanks
        obj.input.literal = input;
        obj.operator = operator;
        obj.value = value;

        // check if there are individual commands (e.g. ttu, bdc)
        if ( commandType.match(individualCommandsRegex) ) {
          buildObj(obj, function() {
            let command = commandType;
            obj.type = command;
          })
        }

        // if there are multiple commands from the groupedCommandsRegex (e.g. lr), loop through all of them individually
        else {
          buildObj(obj, function() {
            obj.type = [];
            for (var i = 0; i < commandType.length; i++) {
              obj.type[i] = commandType[i];
            }
          })
        }
      }
    }
  }

  function buildObj(obj, callback) {
    let operator = obj.operator;
    callback(obj);
    let commandType = obj.type;

    // are there multiple actions, like 'lrb'? Then just grab the first as the reference
    if( trueTypeOf(obj.type) === 'array' ) commandType = obj.type[0];

    // grab the command as specified in commandList as a reference
    const command = getCommandByType( commandType );
    const defaultOperator = command.defaultOperator;
    const expectedDataType = command.expectedDataType;

    // if no operator, get the default operator (if any)
    if ( !operator && defaultOperator ) {
      obj.operator = defaultOperator;
      obj.defaultOperator = true;
    }

    // validate the commands based on what datatype is expected (none, integer, color, string)

    // none — for single action commands that don't expect any arguments, like
    // ttu (text-transform: lowercase). These are always valid.
    if ( !defaultOperator && !expectedDataType ) {
      obj.isValid = true;
    }

    // integer — check if it contains numbers and strip out other values if necessary
    // (like '20foo' › '20'). As long as the string starts with a number it will be considered valid
    if ( expectedDataType === 'integer' && Number.isInteger( parseInt( obj.value ) ) && obj.operator !== '#' ) {
      obj.value = parseInt( obj.value );
      obj.isValid = true;
    }

    // color — check if given value is a valid color (and has '#', '+', '-', '=' as its operator)
    if ( expectedDataType === 'color' && colorRegex.test( obj.value ) && obj.operator.match(/[+=#]/g) ) {
      obj.isValid = true;
    }
    if ( expectedDataType === 'color' && !obj.value && operator === '-' ) {
      obj.isValid = true;
    }

    // string — when a string is expected, it's all good...
    if ( expectedDataType === 'string' ) obj.isValid = true;

    publicAddObj(obj);
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
