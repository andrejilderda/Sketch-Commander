//////////////////////////////////////////////////////////////////
//  LAYER ACTIONS                                               //
//////////////////////////////////////////////////////////////////

export function resizeObject(layer, command, value, operator) {
  var calcAmount = Math.round(value);
  if (operator == "-")
    calcAmount *= -1;

  switch (command) {
    case "a":
      resize(layer, calcAmount, calcAmount, calcAmount, calcAmount);
      break;
    case "l":
      resize(layer, 0, 0, 0, calcAmount);
      break;
    case "r":
      resize(layer, 0, calcAmount, 0, 0);
      break;
    case "t":
      resize(layer, calcAmount, 0, 0, 0);
      break;
    case "b":
      resize(layer, 0, 0, calcAmount, 0);
      break;
  }
}

export function moveObject(layer, command, value, operator) {
  layer = layer.sketchObject;
  
  let xAmount = Number(value);
  let yAmount = Number(value);
  let xCurrent = layer.absoluteRect().rulerX();
  let yCurrent = layer.absoluteRect().rulerY();

  if (operator == "-" || operator == "+") {
    if (operator == "-") {
      xAmount *= -1;
      yAmount *= -1;
    }
    if (command === "x") {
      layer.absoluteRect().setRulerX(xCurrent + xAmount);
    } else if (command === "y") {
      layer.absoluteRect().setRulerY(yCurrent + yAmount);
    }
    return;
  }
  if (operator == "=") {
    if (command === "x") {
      layer.absoluteRect().setRulerX(xAmount);
    } else if (command === "y") {
      layer.absoluteRect().setRulerY(yAmount);
    }
  }
}

// function is triggered when using operators = / * %
export function setWidthHeightObject(layer, command, value, operator) {
  let frame = layer.frame;
  let frameHeight = frame.height;
  let frameWidth = frame.width;
  
  let calcAmount = Math.round(value);
  let calcAmountPercentage = calcAmount / 100;

  // Set width or height =
  if (operator == "=") {
    if (command === "w") {
      frame.width = value;
    }
    else if (command === "h") {
      frame.height = value;
    }
  }
  // add or subtract width/height
  if (operator == "+" || operator == "-") {
    if (operator == "-") {
      calcAmount = calcAmount *= -1;
    }
    if (command === "w")
      resize(layer, 0, calcAmount, 0, 0);
    else if (command === "h")
      resize(layer, 0, 0, calcAmount, 0);
  }
  // Set percentage %
  else if (operator == "%") {
    if (command == 'h')
      frame.height = Math.round(calcAmountPercentage * frameHeight);
    else
      frame.width = Math.round(calcAmountPercentage * frameWidth);
  }
  // Divide /
  else if (operator == "/") {
    if (command == 'h')
      frame.height = Math.round(frameHeight / value);
    else
      frame.width = Math.round(frameWidth / value);
  }
  // Multiply *
  else if (operator == "*") {
    if (command == 'h')
      frame.height = Math.round(frameHeight * value);
    else
      frame.width = Math.round(frameWidth * value);
  }
}

// Function below is exactly the same as in Keyboard Resize
export function resize(layer, t, r, b, l) {
  let frame = layer.frame;
  
  // if layer is a textlayer, set width to fixed
  if (layer.type == "Text") {
    layer.fixedWidth = true;
  }
  
  // Top
  if (t) {
    if (frame.height + t < 0) {
      frame.height = 1; // When contracting size prevent object to get a negative height (e.g. -45px).
      frame.y += - 1; // reposition the object
    } else {
      frame.y += - t; // push/pull object to correct position
      frame.height += t;
    }
  }

  // Right
  if (r) {
    frame.width = frame.width + r;
    if (frame.width <= 1) frame.width = 1;
  }

  // Bottom
  if (b) {
    frame.height = frame.height + b;
    if (frame.height <= 1) frame.height = 1;
  }

  // Left
  if (l) {
    if (frame.width + l <= 0) {
      frame.width = 1;
      frame.x += - 1;
    } else {
      frame.x += - l; // push/pull object to correct position
      frame.width += l;
    }
  }
}

//////////////////////////////////////////////////////////////////
//  BORDER ACTIONS                                              //
//////////////////////////////////////////////////////////////////

export var borderActions = {
  checkOperator: function(layer, color, operator) {
    switch (operator) {
      case '-':
        borderActions.remove(layer);
        break;
      case '+':
        borderActions.add(layer, color);
        break;
      case '#':
      case '=':
        borderActions.setColor(layer, color);
        break;
    }
  },
  
  setColor: function(layer, color) {
    let style = new sketch.Style(); // requires access to the Sketch js API
    let borders = layer.style().borders();

    // check if there's a border, if not add a new one
    if (borders.count() <= 0) layer.style().addStylePartOfType(1);

    let border = borders.lastObject();
    color = color.replace("#", "");

    border.color = style.colorFromString("#" + color);
  },
  
  add: function(layer, color) {
    let style = new sketch.Style();
    let border = layer.style().addStylePartOfType(1);

    // if no color is given (like bd+) set the color to black
    color = (color !== "") ? color : "000000";
    // basic check to find out if the user tries to add a width in stead of a color
    if (color.length > 2) {
      color = color.replace("#", "");
      border.color = style.colorFromString("#" + color);
    } else {
      let thickness = color;
      border.thickness = thickness;
    }
  },
  
  remove: function(layer) {
    let style = new sketch.Style();
    let borderCount = layer.style().borders().length - 1;
    let border = layer.style().removeStyleBorderAtIndex(borderCount);
  },
  
  radius: function(layer, value, operator) {
    if (!layer && !layer.isKindOfClass(MSShapeGroup)) return;
    
    let shape = layer.layers().firstObject();
    if (shape && shape.isKindOfClass(MSRectangleShape)) {
      var radius = shape.cornerRadiusFloat();
      shape.cornerRadiusFloat = mathOps(radius, value, operator);
    }
  },
  
  thickness: function(layer, thickness, operator) {
    thickness = Number(thickness);
    // are there any borders?
    let border = layer.style().borders().lastObject();
    if (border !== null) {
      var borderThickness = layer.style().borders().lastObject().thickness();
      border.thickness = mathOps(borderThickness, thickness, operator);
    } else {
      this.add(layer, thickness);
    }
  }
}

//////////////////////////////////////////////////////////////////
//  TEXT ACTIONS                                                //
//////////////////////////////////////////////////////////////////

export var textActions = {
  setSize: function(layer, value, operator) {
    value = Number(value);
    if (layer.className() == "MSTextLayer") {
      let fontSize = layer.fontSize();
      layer.fontSize = mathOps(fontSize, value, operator);
    }
  },
  
  setLineheight: function(layer, value, operator) {
    value = Number(value);
    if (layer.className() == "MSTextLayer") {
      let prevLineHeight = layer.lineHeight();
      layer.lineHeight = mathOps(prevLineHeight, value, operator);
    }
  },
  
  setValue: function(layer, value, operator) {
    if (layer.className() == "MSTextLayer") {
      let prevTextValue = layer.stringValue();

      if (operator == "+") {
        layer.stringValue = prevTextValue + value;
      } else if (operator == "-") {
        prevTextValue = prevTextValue.replace(value, "");
        layer.stringValue = textValue;
      } else {
        layer.stringValue = value;
      }
    }
  },
  
  convertLowerCase: function(layer) {
    if (layer.className() == "MSTextLayer") {
      let textValue = layer.stringValue();
      let newValue = textValue.toLowerCase();
      layer.stringValue = newValue;
    }
  },
  
  convertUpperCase: function(layer) {
    if (layer.className() == "MSTextLayer") {
      let textValue = layer.stringValue();
      let newValue = textValue.toUpperCase();
      layer.stringValue = newValue;
    }
  }
}

//////////////////////////////////////////////////////////////////
//  LAYER ACTIONS                                               //
//////////////////////////////////////////////////////////////////

export var layerActions = {
  rename: function(layer, value, operator) {
    let layerName = layer.name();
    layer.nameIsFixed = 1;

    if (operator == "+") {
      layer.name = layerName + value;
    } else if (operator == "-") {
      layerName = layerName.replace(value, "");
      layer.name = layerName;
    } else {
      layer.name = value;
    }
  }
}

//////////////////////////////////////////////////////////////////
//  FILL ACTIONS                                               //
//////////////////////////////////////////////////////////////////

export var fillActions = {
  setColor: function(layer, color) {
    if (layer.className() == "MSTextLayer") {
      color = makeColor(color);
      layer.setTextColor(color);
    }
    
    if (layer instanceof MSShapeGroup) {
      let style = new sketch.Style();
      let fills = layer.style().fills();

      // create fill if there are none
      if (fills.count() <= 0) {
        fills.addStylePartOfType(0);
      }
      let fill = fills.firstObject();
      color = color.replace("#", "");

      //set color to first fill layer style
      fill.color = style.colorFromString("#" + color);
    }
  },
  // ,
  // copyColor : function() {
  //     
  // },
  setOpacity: function(layer, opacity) {
    opacity = opacity / 100;
    layer.style().contextSettings().setOpacity(opacity);
  }
}

//////////////////////////////////////////////////////////////////
//  GENERIC FUNCTIONS                                           //
//////////////////////////////////////////////////////////////////

// simple math operations for - + * / %
export function mathOps(input, value, operator) {
  input = Number(input);
  value = Number(value);

  if (operator == "+")
    return input + value;
  else if (operator == "-")
    return input - value;
  else if (operator == "*")
    return input * value;
  else if (operator == "/")
    return input / value;
  else if (operator == "%")
    return input * (value / 100);
  else
    return value;
}

// makeColor function to convert hex values to MSColor (from http://sketchplugins.com/d/8-global-colors-gradients/2)
export function makeColor(SVGString) {
  return MSImmutableColor.colorWithSVGString(SVGString).newMutableCounterpart();
}
