const contextTabs = document.querySelectorAll(".c-context-tab__item");
const contextList = document.querySelectorAll(".c-context-list");
let currentContext = 0;
let tabKeyPressed = false;

function onTabPress(e) {
  if (!cyclingThroughOptions) {
    tabKeyPressed = true;
    if (!e.shiftKey) switchContextAction('next');
  }
  else selectOption();
  if (e.shiftKey && tabKeyPressed) {
    e.preventDefault();
    switchContextAction('prev');
  }
}

// for switching task contexts
function switchContextAction(value) {
  if (value == 'next') currentContext = currentContext + 1;
  else if (value == 'prev') currentContext = currentContext - 1;
  else currentContext = value;
  
  var length = contextTabs.length;
  var index = mod(currentContext, length);
  contextTabs.forEach(function(el) {
    el.classList.remove('is-active');
  })
  // triggers visibility of both active tab as the list below
  contextTabs[index].classList.toggle('is-active');
  returnToSketch('saveContext', index);
}
