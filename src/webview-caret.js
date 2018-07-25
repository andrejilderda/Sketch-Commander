// Code below is based on/copied from Donnie D'Amato's helpful Medium post:
// https://medium.com/compass-true-north/a-dancing-caret-the-unknown-perils-of-adjusting-cursor-position-f252734f595e

function getCaretPosition(el){
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

function getCaretData(el, position){
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

// setting the caret with this info  is also standard
function setCaretPosition(d) {
  var sel = window.getSelection(),
  range = document.createRange();
  range.setStart(d.node, d.position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}
