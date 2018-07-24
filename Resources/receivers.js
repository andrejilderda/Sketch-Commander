// Receiver functions that receive input from Sketch
// attached to the window object so that it can be called by the Sketch plugin
(function initReceivers() {
  // receive previous user input from Sketch
  window.prevUserInput = function(input) {
    if (input) {
      if (DEBUG) console.log('Received prevUserInput:');
      if (DEBUG) console.log(input);
      document.querySelector('.c-commander').value = input;
      document.querySelector('.c-commander').select();
    }
  }

  // receive active context from Sketch
  window.contextTabsInit = function(input) {
    if (input) {
      const activeContext = Number(input);
      switchContextAction(activeContext);
    }
  }

  // receive selected layer names
  window.selectedLayers = function(input) {
    if (input) {
      selectedLayerNames = input;
    }
    listSelectedLayers();
  }

  // receive artboard names
  window.artboardLayers = function(input) {
    if (input) {
      artboardNames = input;
    }
  }
})()
