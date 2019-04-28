// Receiver functions that receive input from Sketch
// attached to the window object so that it can be called by the Sketch plugin
(function initReceivers() {
    // receive previous user input from Sketch
    window.prevUserInput = function(input) {
        if (input) {
            if (DEBUG) console.log('Received prevUserInput: ' + input);
            setInputValue( input );
            requestAnimationFrame(function() {
                let range = document.createRange();
                let el = inputField;
                range.selectNodeContents(el);
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            });
            inputField.classList.add('previous-user-input');
        }
        // don't send any arguments (ignore input field value) when rendering
        // listCommands after setting the prevUserInput
        listCommands.active = true;
        listCommands.render();
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
    
    // receive active context from Sketch
    window.contextTabsInit = function(input) {
        if (DEBUG) console.log('Received contextTabsInit:');
        if (DEBUG) console.log(input);
        if (input) {
            const activeContext = Number(input);
            contextTabs.switch( activeContext );
        }
    }
})()

if (BROWSERDEBUG) window.prevUserInput( prevUserInputMockData );
