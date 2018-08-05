// Parts of the code below were copied from Donnie D'Amato's helpful Medium post:
// https://medium.com/compass-true-north/a-dancing-caret-the-unknown-perils-of-adjusting-cursor-position-f252734f595e

function getCaretPos(el){
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


function getAllTextnodes(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function getCaretNode(el, position){
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

function handleCaretPos( element, caretPos ) {
  console.log(getCaretNode(element, caretPos));
  try {
    var data = getCaretNode(element, caretPos);
    setCaretPos(data);
  } catch (e) {
    if ( e instanceof DOMException ) {
      // user input is stripped from spaces on the beginning of the command (using stripSpace()).
      // if the user attempts to add a space after a ',' the setCaretPos attempts to move the caret
      // to the position after the space which was stripped, resulting in a DOMException, since the
      // DOM element couldn't be found. So in that case we'll shift the caretPos to - 1
      console.log('DOMException: caretPos will shift to -1.');
      var data = getCaretNode(element, caretPos - 1);
      setCaretPos(data);
    }
    else if ( e instanceof TypeError ) {
      // catch other errors. Most likely a space was entered in the input field and nothing else.
      // This will trigger a 'TypeError: "Argument 1 of Range.setStart is not an object."'
      // In this case we'll just reset the caret position to the start of the input like nothing happened
      console.log('TypeError: setCaretPos has triggered an error. We\'ll reset the caret to the start of the input field.');
      var data = getCaretNode(element, 0);
      setCaretPos(data);
    } 
    else {
      // Just log the message for any errors I oversaw...
      console.log(e);
    }
  }
}

function setCaretPos(d) {
  var sel = window.getSelection(),
  range = document.createRange();
  range.setStart(d.node, d.position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function setCaretPosToEnd( element ) {
  let totalLength = 0;
  getAllTextnodes( element ).forEach( node => totalLength += node.length )
  handleCaretPos( element, totalLength );
}

// Set caretPositioning when user presses ← or →
inputField.addEventListener('keydown', handleCaretLeftRight, false);

function handleCaretLeftRight( e ) {
  let newCaretPos;
  if ( e.keyCode === 37 || e.keyCode === 39 ) {
    if ( e.keyCode ==  37 ) newCaretPos = getCaretPos( inputField ) - 1;
    else newCaretPos = getCaretPos( inputField ) + 1; 
    handleCaretPos( inputField, newCaretPos );
    e.preventDefault()
  }
};
