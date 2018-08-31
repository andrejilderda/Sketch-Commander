// Array containing all instances created with List
let listInstances = [];
listInstances.updateState = function( listName ) {
  if ( !listInstances ) return;
  listInstances.forEach( item => {
    if ( item.name !== listName ) item.active = false;
  })
}

class List {
  constructor() {
    this.data;
    this.filteredData;
    this._active = false;
    listInstances.push(this);
    document.addEventListener( 'keydown', ( e ) => this.onKeydown( e ) );
  }
  
  set active( state ) {
    if ( this._active !== state ) {
      this.changeState( state )
      if (DEBUG) console.log('state changed: ' + this.name);
      listInstances.updateState( this.name );
      this._active = state;
    }
    // console.log(listInstances);
  }
  
  get active() {
    return this._active;
  }
  
  changeState( active ) {
    const activeClass = 'is-active'
    if ( active === true ) this.element.classList.add( activeClass )
    else this.element.classList.remove( activeClass )
  }
  
  filterList( wordToMatch, filterBy ) {
    wordToMatch = wordToMatch || '';
    // see if filter value was provided.
    if ( !wordToMatch ) return this.data;
    // property to filter by, (name) by default
    const prop = filterBy || 'name';

    // filter and sort results
    var filteredData =  this.data.filter( item => {
      const regex = new RegExp( wordToMatch, 'gi' ); 

      // add the ability to pass an array of 2 props to match by
      if ( trueTypeOf( prop ) === 'array' && prop.length === 2 ) {
        return item[prop[0]].match(regex) || item[prop[1]].match(regex)
      }
      return item[prop].match(regex);
    }).sort( function( a, b ) {
      // TODO: exact match = highest score
      // if (inputFieldValue === a[prop]) {
      //   return a[prop] - b[prop];
      // }
      let textA = a[filterBy[0]].toUpperCase() || a.name;
      let textB = b[filterBy[0]].toUpperCase() || b.name;

      if ( wordToMatch ) wordToMatch = wordToMatch.toUpperCase() || ''
      if ( wordToMatch === textB ) return 1; // exact match
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    return filteredData;
  }
  
  render( wordToMatch, filterBy ) {
    let data;
    filterBy = filterBy || 'notation';
    
    if ( wordToMatch ) {
      data = listCommands.filterList( wordToMatch, filterBy );
    }
    else data = this.data;
    // render markup into element
    this.element.innerHTML = `${this.template( data )}`;
    
    // create click event listeners for all the list items
    const listItems = this.element.querySelectorAll('li');
    listItems.forEach( 
      item => item.addEventListener('click', ( e ) => {
        this.onListItemClick( e );
      })
    );
  }
}

// call relevant functions when ↑ & ↓ or enter key is pressed. Else return.
List.prototype.onKeydown = function( e ) {
  if ( !this.active ) return false;
  
  if ( e.keyCode === 40 || e.keyCode === 38 ) this.onUpDownKey( e );
  else if ( e.keyCode === 13 ) this.onEnterKey( e );
  else return false;
}

List.prototype.onUpDownKey = function( e ) {
  e.preventDefault();
  
  let increment = -1; // have nothing selected by default
  const listItems = this.element.querySelectorAll( '[data-item]' );
  const length = listItems.length + 1; // so that it's possible to have nothing selected
  
  // check if there already is an element selected, so that we can use its index;
  listItems.forEach( ( el, elIndex ) => {
    if ( el.classList.contains('is-active') === true ) increment = elIndex;
  });
  increment = e.keyCode === 40 ? increment += 1 : increment = increment - 1;
  
  const index = mod( increment, length );
  cyclingThroughOptions = true;
  
  listItems.forEach( el => el.classList.remove( 'is-active' ) );
  
  if ( listItems[index] != undefined ) {
    listItems[index].classList.toggle('is-active');
    // this useful sucker surprisingly works in safari/webview. Keep it disabled when debugging in FF
    if ( !BROWSERDEBUG ) listItems[index].scrollIntoViewIfNeeded( false );
  } 
  else cyclingThroughOptions = false;
}

// function to replace current input value with the notation of selected option
List.prototype.onEnterKey = function( e ) {
  let firstRun = inputField.classList.contains( 'prevUserInput' );
  var ul = this.element.querySelector("ul");
  var ulNodes = ul.children;
  for (var i = 0; i < ulNodes.length; i++) {
    if ( ulNodes[i].classList.contains("is-active")) {
      setInputValue( ulNodes[i].dataset.notation, !firstRun );
    }
  }
  inputField.classList.remove( 'prevUserInput' );
}

// called when a list item is clicked
List.prototype.onListItemClick = function( e ) {
  let notation = e.target.dataset.notation;
  let firstRun = inputField.classList.contains( 'prevUserInput' );
  setInputValue( notation, !firstRun );
  inputField.classList.remove( 'prevUserInput' );
}

function handleListsState() {
  // returns command node where caret is currently at
  const node = getCaretCommandNode();
  let nodeText;
  if ( node ) nodeText = getCaretCommandNode().textContent;

  // is caret at '>|'? Then open layer select list
  if ( nodeText && nodeText[0] === '>' ) {
    if (DEBUG) console.log('Command started with >, request page layers from Sketch');
  
    listLayers.active = true;
  
    // request pagelayers from Sketch, unless browser debug mode is active
    if ( !BROWSERDEBUG && !window.pageLayers ) returnToSketch('requestPageLayers');
    else setPageLayers();
  }
  else listLayers.active = false;
  
  // rules for when commandList is shown/hidden
  // grab the textContent from '.c-command', which we use to filter commands
  if ( !node || node.children[0] && node.children[0].classList.contains( 'c-command__type' ) ) {
    listCommands.active = true;
    listCommands.render( nodeText, ['notation', 'name'] );
  }
  else listCommands.active = false;
}

//////////////////////////////////////////////////////////////////
//  LIST: Commands                                              //
//////////////////////////////////////////////////////////////////

const listCommands = new List();
listCommands.name = 'commandList';
listCommands.data = commandList;
listCommands.element = document.querySelector('[data-list="commands"]');
listCommands.active = true;
listCommands.template = function( data ) {
  return `
    <ul class="c-list">
      ${data.map(item => `
        <li class="c-list__item" data-item data-notation="${item.notation}">
          <span class="c-list__notation">${item.notation}</span>
          ${item.name}
        </li>
      `).join('')}
    </ul>
  `
};
listCommands.render();


//////////////////////////////////////////////////////////////////
//  LIST: layers                                                //
//////////////////////////////////////////////////////////////////

const listLayers = new List();
listLayers.name = 'layerList';
listLayers.data = window.pageLayers || [];
listLayers.element = document.querySelector('[data-list="layers"]');
listLayers.template = function( data ) {
  return `
    <ul class="c-list">
      ${data.map(item => `
        <li class="c-list__item" data-item>
          <span class="c-list__notation">${item.type}</span>
          ${item.name}
        </li>
      `).join('')}
    </ul>
  `
};
