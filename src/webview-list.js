class List {
  constructor() {
    this.data;
    this.filteredData;
    this.active = false;
  }
  
  render() {
    // render template into element
    this.element.innerHTML = this.template;
    
    // setup event listeners
    const items = Array.from( this.element.querySelectorAll('[data-item]') );
    items.forEach( item => item.addEventListener('click', function(e) {
      console.log('clicked item in list');
    }))
  }
}

const listCommands = new List();
listCommands.data = commandList;
listCommands.element = document.querySelector('[data-list="commands"]');
listCommands.template =  `
  <div>Template was rendered</div>
  <ul class="c-list">
    ${listCommands.data.map(item => `
      <li class="c-list__item" data-item>
        ${item.name}
        <span class="c-list__notation">${item.notation}</span>
      </li>
    `).join('')}
  </ul>
`;

listCommands.filterList = function ( wordToMatch ) {
  // see if filter value was provided.
  if ( !wordToMatch ) return this.data;
  
  // filter and sort results
  return this.data.filter( item => {
    const regex = new RegExp(wordToMatch, 'gi');
    return item.name.match(regex) || item.notation.match(regex);
  }).sort( function( a,b ) {
    // TODO: exact match = highest score
    if (inputFieldValue === a.notation) {
      return a.notation - b.notation;
    }
    var textA = a.notation.toUpperCase();
    var textB = b.notation.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  })
}


listCommands.render( listCommands.filterList('c') );





document.addEventListener('keydown', navigateList);
function navigateList(e) {
  // only continue when ↑ & ↓ keys are pressed
  if ( !e.keyCode === 40 || !e.keyCode === 38 ) return;
  
}














// for filtering the action list as long as there are no matching commands found
// function filterActionlist() {
//   var optionsItems = document.querySelectorAll(".c-options-list__item");
//   var optionsArray = Array.from(optionsItems);
//   this.data.filter(function(el) {
//     var filter = inputFieldValue.toLowerCase();
//     var filteredItems = el.dataset.notation + " " + el.dataset.name + " " + el.dataset.tags;
//     // console.log(el.dataset.name + ":   " + filteredItems.toLowerCase().indexOf(filter));
//     if (filteredItems.toLowerCase().indexOf(filter) == -1) {
//       el.classList.add("is-hidden");
//     } else {
//       el.classList.remove("is-hidden");
//     }
// 
//     var result = optionsArray.sort(function(a, b) {
//       if (inputFieldValue === a.dataset.notation) {
//         return a.dataset.notation - b.dataset.notation;
//       }
//       return a.dataset.notation - b.dataset.notation;
//     });
//     navigateThroughList('selectFirst');
//   });
// }
// 
// // for navigating through the actionlist
// var selectedAction = -1;
// 
// function navigateThroughList(value) {
//   var listItems = document.querySelectorAll(".c-context-list.is-active .c-options-list__item:not(.is-hidden)");
// 
//   if (value == 'reset') {
//     selectedAction = -1;
//   } else if (value == 'selectFirst') { // used when filtering items
//     selectedAction = 0;
//   } else if (!value) {
//     selectedAction++;
//   } else {
//     if (Number.isInteger(value))
//       selectedAction = selectedAction += value;
//   }
// 
//   var length = listItems.length + 1; // so that it's possible to have nothing selected
//   var index = mod(selectedAction, length);
//   cyclingThroughOptions = true;
// 
//   listItems.forEach(function(el) {
//     el.classList.remove('is-active');
//   })
// 
//   if (listItems[index] != undefined) {
//     listItems[index].classList.toggle('is-active');
//     // this useful sucker surprisingly works in safari/webview, but lets keep it disabled when debugging in FF
//     if (!BROWSERDEBUG) listItems[index].scrollIntoViewIfNeeded(false);
//   } else {
//     cyclingThroughOptions = false;
//   }
// }
