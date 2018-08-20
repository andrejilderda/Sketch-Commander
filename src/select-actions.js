import selection from './commander'
import { commandList, DEBUG, DEVMODE, BROWSERDEBUG } from './shared';

//////////////////////////////////////////////////////////////////
//  SELECT ACTIONS                                              //
//////////////////////////////////////////////////////////////////

var Page =  require('sketch/dom').Page;
var Shape = require('sketch/dom').Shape;
var Group = require('sketch/dom').Group;
var Text = require('sketch/dom').Text;
var Artboard = require('sketch/dom').Artboard;
var SymbolInstance = require('sketch/dom').SymbolInstance;

var document = require('sketch/dom').getSelectedDocument();

// hacky method to use the parentArtboard()-method that is not present in the Javascript API yet
// After the method is called we turn it into a wrapped object again.
// Difference is we can use the Javascript API again: 
// 'selection.frame.height = 10' in stead of 'selection.frame().setHeight(10);'
// More info: https://developer.sketchapp.com/reference/api/#sketch-components
// selection = Artboard.fromNative( selection[0].sketchObject.parentArtboard() );

const currentPage = context.document.currentPage();
const currentPageObj = Page.fromNative(currentPage);

// selection argument is optional for if you want to only 
export function searchLayers( name, scope, selection ) {
  // scope is either 'document', 'page' or 'artboard'
  let searchScope;
  let result = [];
  
  // by default search in current page
  if ( !scope ) searchScope = currentPage;
  
  if ( scope === 'page' ) searchScope = currentPage;
  else if ( scope === 'artboard' ) searchScope = parentArtboardsFromSelection( selection )

  if ( scope === 'artboard' ) {
    searchScope.forEach( artboard => {
      artboard.children().forEach( item => {
        if ( item.name() == name ) {
          result.push( item );
        }
      });
    }); 
  }
  else if ( scope === 'page' ){
    searchScope.children().forEach( item => {
      if ( item.name() == name ) {
        result.push( item );
      }
    });
  } 
  else if ( scope === 'document' ) result = createNativeLayers( document.getLayersNamed( name ) );
  else {
    if (DEBUG) console.log('Invalid scope passed to searchLayers');
  }
  return result;
}

export function selectLayers( name, scope, selection ) {
  // currentPage.changeSelectionBySelectingLayers( searchLayers( name, scope, selection ) )
}

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

function createNativeLayers( selection ) {
  let nativeLayers = selection.map( item => {
    console.log(item.type);
    switch ( item.type ) {
      case 'Group':
        return Group.fromNative( item );
      case 'Shape':
        return Shape.fromNative( item );
      case 'Text':
        return Text.fromNative( item );
      case 'SymbolInstance':
        return SymbolInstance.fromNative( item );
      case 'SymbolInstance':
        return Artboard.fromNative( item );
    }
  });
  return nativeLayers;
}

function createSketchObject( selection ) {
  let sketchObjects = selection.map( item => {
    return item.sketchObject;
  });
  return nativeLayers;
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
