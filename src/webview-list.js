class List {
  constructor() {
    this.data;
    this.filteredData;
    this.active = false;
  }
  
  filterList( wordToMatch, filterBy ) {
    // see if filter value was provided.
    if ( !wordToMatch ) return this.data;
    // property to filter by, (name) by default
    const prop = filterBy || 'name';
    
    // filter and sort results
    return this.data.filter( item => {
      const regex = new RegExp( wordToMatch, 'gi' );
      
      // add the ability to pass an array of 2 props to match by
      if ( trueTypeOf(prop) === 'array' && prop.length === 2 ) {
        return item[prop[0]].match(regex) || item[prop[1]].match(regex)
      }
      return item[prop].match(regex);
    }).sort( function( a, b ) {
      // TODO: exact match = highest score
      // if (inputFieldValue === a[prop]) {
      //   return a[prop] - b[prop];
      // }
      
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    
  }
  
  render( wordToMatch ) {
    let data;
    if ( wordToMatch ) data = listCommands.filterList( wordToMatch, [ 'name', 'notation' ] );
    else data = this.data;
    
    // render markup into element
    this.element.innerHTML = `
      <ul class="c-list  ${this.active ? `is-active` : ``}">
        ${this.template( data )}
      </ul>
    `;
    
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
listCommands.template = function( data ) {
  return `
    ${data.map(item => `
      <li class="c-list__item" data-item>
        ${item.name}
        <span class="c-list__notation">${item.notation}</span>
      </li>
    `).join('')}
  `
};
listCommands.render();



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
