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

  // receive selected layer names
  window.setPageLayers = function(input) {
    if (DEBUG) console.log('Received setPageLayers:');
    if (input) {
      window.pageLayers = JSON.parse(input);
      window.pageLayers.forEach( layer => {
        layer.name = layer.name.replace(/charDoubleQuote/g, "\"").replace(/charSingleQuote/g, "'").replace(/charSingleQuote/g, "'").replace(/charAccoladeOpen/g, "{").replace(/charAccoladeClose/g, "}")
      });
    }
    createLayerList();
    if (DEBUG) console.log(window.pageLayers);
  }

  // receive active context from Sketch
  window.contextTabsInit = function(input) {
    if (DEBUG) console.log('Received contextTabsInit:');
    if (DEBUG) console.log(input);
    if (input) {
      const activeContext = Number(input);
      switchContextAction(activeContext);
    }
  }
})()
