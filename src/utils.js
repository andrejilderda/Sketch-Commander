/*
Handy helper function for true type checking by Chris Ferdinandi:
https://gomakethings.com/true-type-checking-with-vanilla-js
*/
var trueTypeOf = function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

// search through array object - https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
// returns the object with the result
function searchPropInArray(nameKey, prop, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][prop] === nameKey) {
            return myArray[i];
        }
    }
}

// Get remainder from modulo
// http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving/13163436#13163436
var mod = function(n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};

// Removing leading whitespace in ES6 template strings
// https://muffinresearch.co.uk/removing-leading-whitespace-in-es6-template-strings/
var singleLineString = function(strings) {
    var values = Array.prototype.slice.call(arguments, 1);
    
    // Interweave the strings with the 
    // substitution vars first.
    var output = '';
    for (var i = 0; i < values.length; i++) {  
        output += strings[i] + values[i];
    }
    output += strings[values.length];
    
    // Split on newlines.
    var lines = output.split(/(?:\r\n|\n|\r)/);
    
    // Rip out the leading whitespace.
    return lines.map(function(line) {
        return line.replace(/^\s+/gm, '');  
    }).join('').trim();
};
