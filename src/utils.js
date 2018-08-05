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
