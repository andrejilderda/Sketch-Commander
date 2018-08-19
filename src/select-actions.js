import selection from './commander'

//////////////////////////////////////////////////////////////////
//  SELECT ACTIONS                                              //
//////////////////////////////////////////////////////////////////

var Page =  require('sketch/dom').Page;

// hacky method to use the parentArtboard()-method that is not present in the Javascript API yet
// After the method is called we turn it into a wrapped object again.
// Difference is we can use the Javascript API again: 
// 'selection.frame.height = 10' in stead of 'selection.frame().setHeight(10);'
// More info: https://developer.sketchapp.com/reference/api/#sketch-components
// selection = Artboard.fromNative( selection[0].sketchObject.parentArtboard() );

const currentPage = context.document.currentPage();
const currentPageObj = Page.fromNative(currentPage);

export function searchLayers( selection, name, searchField ) {
  // searchField is either 'document', 'page' or 'artboard'
  if ( !searchField ) searchField = currentPage
  if ( searchField === 'page' ) searchField = currentPage;
  if ( searchField === 'artboard' ) searchField = parentArtboardsFromSelection( selection )
  console.log(searchField);
  // TODO: Document
  let result = [];
  
  if ( Array.isArray( searchField ) ) {
    console.log('true that');
    searchField.forEach( artboard => {
      artboard.children().forEach( item => {
        if ( item.name() == name ) {
          result.push( item );
        }
      });
    }); 
  }
  else {
    searchField.children().forEach( item => {
      if ( item.name() == name ) {
        result.push( item );
      }
    });
  }
  return result;
}

export function selectOnCurrentPage( selection, name ) {
  currentPage.changeSelectionBySelectingLayers( searchLayers( selection, name, 'page') )
}

// filterOnCurrentPage('testie');
// console.log(temp);

export function parentArtboardsFromSelection( selection ) {
  let parentArtboards = [];
  selection.forEach( layer => {
    const parentArtboard = layer.sketchObject.parentArtboard();
    
    // check if this artboard was already added
    if ( !parentArtboards.includes( parentArtboard ) ) {
      parentArtboards.push( layer.sketchObject.parentArtboard() );
    }
  })
  return parentArtboards;
}

// parentArtboardsFromSelection.forEach( artboard => {
//   var layers = document.getLayersNamed('zelfde naam');
//   layers.forEach( layer => {
//     let parentArtboard = layer.sketchObject.parentArtboard();
// 
//     if( parentArtboard === artboard ) {
//       console.log('Yes same: ' + parentArtboard);
//     }
//     else {
//       console.log('Nope, not the same: ' + parentArtboard);
//     }
//   })
// })
