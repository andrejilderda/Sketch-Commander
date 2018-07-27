/*
  Handy helper function for true type checking by Chris Ferdinandi:
  https://gomakethings.com/true-type-checking-with-vanilla-js
*/
var trueTypeOf = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};
