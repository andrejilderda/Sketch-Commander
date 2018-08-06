// Parts of the code below were copied from Donnie D'Amato's helpful Medium post:
// https://medium.com/compass-true-north/a-dancing-caret-the-unknown-perils-of-adjusting-cursor-position-f252734f595e

const caret = {
  input: inputField,
  _position: 0,
  get position() {
    return this._position;
  },
  set position( value ) {
    this._position = value;
    handleCaretPos();
  }
}

function getCaretPos( el ) {
  var caretOffset = 0, sel;
  if (typeof window.getSelection !== "undefined") {
    var range = window.getSelection().getRangeAt(0);
    var selected = range.toString().length;
    var preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(el);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length - selected;
  }
  return caretOffset;
}


function getAllTextnodes( el ) {
  var el = el || caret.input;
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function getCaretNode( el, position ){
  var el = el || caret.input;
  var position = position || caret.position;
  var node; 
  var nodes = getAllTextnodes(el);
  for(var n = 0; n < nodes.length; n++) {
    if (position > nodes[n].nodeValue.length && nodes[n+1]) {
      // remove amount from the position, go to next node
      position -= nodes[n].nodeValue.length;
    } else {
      node = nodes[n];
      break;
    }
  }
  // you'll need the node and the position (offset) to set the caret
  return { node: node, position: position };
}


function handleCaretPos( caretPos ) {
  handleLists();
  
  try {
    if ( caret.position > 0 ) setCaretPos();
  } catch (e) {
    if ( e instanceof DOMException ) {
      // user input is stripped from spaces on the beginning of the command (using stripSpace()).
      // if the user attempts to add a space after a ',' the setCaretPos attempts to move the caret
      // to the position after the space which was stripped, resulting in a DOMException, since the
      // DOM el couldn't be found. So in that case we'll shift the caretPos to - 1
      console.log('DOMException: caret.position will shift to -1.');
      if (caret.position > 0 ) caret.position += -1;
      else caret.position = 0
    }
    if ( e instanceof TypeError ) {
      // catch other errors. Most likely a space was entered in the input field and nothing else.
      // This will trigger a 'TypeError: "Argument 1 of Range.setStart is not an object."'
      console.log('TypeError: setCaretPosition has triggered an error. We\'ll reset the caret to the start of the input field.');
      caret.position = 0;
    }
    else {
      // Just log the message for any errors I oversaw...
      console.log(e);
    }
  }
}

function setCaretPos(d) {
  var d = d || getCaretNode();
  var sel = window.getSelection(),
  range = document.createRange();
  range.setStart(d.node, d.position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function getTotalNodeLength() {
  let totalLength = 0;
  getAllTextnodes().forEach( node => totalLength += node.length );
  return totalLength;
}

function setCaretPosToEnd() {
  caret.position = getTotalNodeLength();
}

// Set caretPositioning when user presses ← or →
caret.input.addEventListener('keydown', function( e ) {
  let newCaretPos;
  // if ( e.keyCode === 16 ) {
  //   caret.position = 2;
  // }
  if ( e.keyCode === 37 || e.keyCode === 39 ) {
    if ( e.keyCode ==  37 && caret.position >= 0 ) caret.position += -1;
    else caret.position += 1;
    e.preventDefault()
  }
}, false);
