// Receiver functions that receive input from Sketch
// attached to the window object so that it can be called by the Sketch plugin
(function initReceivers() {
  // receive previous user input from Sketch
  window.prevUserInput = function(input) {
    if (input) {
      if (DEBUG) console.log('Received prevUserInput:');
      if (DEBUG) console.log(input);
      setInputValue( input );
      requestAnimationFrame(function() {
        let range = document.createRange();
        let el = inputField;
        range.selectNodeContents(el);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });
    }
  }

  // receive selected layer names
  window.setPageLayers = function(input) {
    if (DEBUG) console.log('Received setPageLayers:');
    if (BROWSERDEBUG) input = JSON.stringify( pageLayersMockData );
    if (input) {
      window.pageLayers = JSON.parse( input );
      window.pageLayers.forEach( layer => {
        layer.name = layer.name.replace(/charDoubleQuote/g, "\"").replace(/charSingleQuote/g, "'").replace(/charSingleQuote/g, "'").replace(/charAccoladeOpen/g, "{").replace(/charAccoladeClose/g, "}")
      });
    }
    listLayers.data = window.pageLayers;
    listLayers.render();
    if (DEBUG) console.log(window.pageLayers);
  }
})()

if (BROWSERDEBUG) window.prevUserInput( prevUserInputMockData );
