import selection from './commander'
import { commandList, DEBUG, BROWSERDEBUG } from './shared';

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
const currentPage =  document.selectedPage;

// selection argument is only required for determining current artboard
// scope is either 'document', 'page' or 'artboard'
export function searchLayers( name, scope, selection ) {
    // artboard
    if ( scope === 0 ) {
        const searchScope = parentArtboardsFromSelection( selection );
        
        return loopThroughChildLayers( searchScope, function( match, layer ) {
            if ( name && layer.name === name ) match.push( layer )
            else if ( !name ) match.push( layer ) // add all layers when no filter is given
        });
    }
    // page
    else if ( scope === 1 ) {
        return loopThroughChildLayers( currentPage, function( match, layer ) {
            if ( name && layer.name === name ) match.push( layer )
            else if ( !name ) match.push( layer ) // add all layers when no filter is given
        } );
    }
    // document
    else if ( scope === 2 ) {
        return document.getLayersNamed( name );
    }
    else {
        if (DEBUG) console.log('Invalid scope passed to searchLayers');
    }
}

// woah, replace all characters that could break the webview (like: "'{}).
export function replaceDangerousCharacters( match, layer ) {
    match.push({
        name: layer.name.replace(/"/g, 'charDoubleQuote').replace(/'/g, 'charSingleQuote').replace(/{/g, 'charAccoladeOpen').replace(/}/g, 'charAccoladeClose'),
        type: layer.type,
        isSelected: layer.selected
    });
}

// loop through child layers and optionally filter by layer name
export function loopThroughChildLayers( layerGroup, callback ) {
    let match = [];
    
    function recursiveFn( layerGroup, callback ) {
        layerGroup.layers.forEach( layer => {
            callback(match, layer);
            
            // does the layerGroup contain child layers? If so, perform a (recursive) loop
            if ( layer.layers ) recursiveFn( layer, callback );
        })
    }
    // if layerGroup that's passed is an array (f.e. 2 artboards), loop through all of them
    if ( Array.isArray( layerGroup ) ) layerGroup.forEach( item => recursiveFn( item, callback ) );
    else recursiveFn( layerGroup, callback );
    
    return match;
}

// hacky method to use the parentArtboard()-method that is not present in the Javascript API yet
// After the method is called we turn it into a wrapped object again.
// Difference is we can use the Javascript API again: 
// 'selection.frame.height = 10' in stead of 'selection.frame().setHeight(10);'
// More info: https://developer.sketchapp.com/reference/api/#sketch-components
export function parentArtboardsFromSelection( selection ) {
    if ( !selection ) {
        returnToSketch('toast', 'No layers selected');
        return;
    }
    
    let parentArtboards = [];
    
    selection.forEach( layer => {
        const parentArtboard = layer.getParentArtboard();
        
        // check if this artboard was already added
        if ( !parentArtboards.includes( parentArtboard ) ) {
            parentArtboards.push( parentArtboard );
        }
    });
    
    // no parent artboards found?
    if ( !parentArtboards ) {
        returnToSketch('toast', 'No parent artboards found');
        return;
    }
    
    return parentArtboards;
}
