/* 
 @preserve Copyright (c) 2014 Stephen "Cazra" Lindberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/


/** 
 * An encapsulation for a CSS font. 
 * @constructor
 * @param {string} name   The name of the physical font to be used.
 * @param {string} fontType   The generic family of the font to be used, in 
 *      case the physical font is not available. This should be one of either 
 *      "serif", "sans-serif", or "monospace".
 * @param {int} sizePx    The pixel size of the font.
 */
TentaGL.Font = function(name, fontType, sizePx) { 
  this._name = name;
  this._type = fontType;
  this._size = sizePx;
  
  this._bold = false;
  this._italic = false;
  this._vPad = 1;
};


TentaGL.Font.prototype = {
  
  constructor:TentaGL.Font, 
  
  
  /** 
   * Returns the name of this font.
   * @return {string}
   */
  getName:function() {
    return this._name;
  },
  
  
  /** 
   * Returns the font's generic family.
   * @return {string}
   */
  getType:function() {
    return this._type;
  },
  
  
  /**  
   * Returns the pixel size of this font.
   * @return {string}
   */
  getSize:function() {
    return this._size;
  },
  
  
  /** 
   * Returns the amount of vertical padding between lines of text 
   * with this font, in pixels. 
   * @return {int}
   */
  getVerticalPadding:function() {
    return this._vPad;
  },
  
  /** 
   * Sets the amount of vertical padding between lines of text with this font, 
   * in pixels. 
   * @param {int} pad
   */
  setVerticalPadding:function(pad) {
    this._vPad = pad;
  },
  
  
  /** 
   * Returns whether this font is set to bold. 
   * @return {Boolean}
   */
  isBold:function() {
    return this._bold;
  },
  
  /** 
   * Sets whether this font is bold.
   * @param {Boolean} bold
   */
  setBold:function(bold) {
    this._bold = bold;
  },
  
  
  /** 
   * Returns whether this font is set to italic.
   * @return {Boolean}
   */
  isItalic:function() {
    return this._italic;
  },
  
  
  /** 
   * Sets whether this font is italic.
   * @param {Boolean} italic
   */
  setItalic:function(italic) {
    this._italic = italic;
  },
  
  
  /** 
   * Returns a CSS string representation of this font. 
   * @param {string}
   */
  toCSS:function() {
    var result = "";
    if(this._italic) {
      result += "italic ";
    }
    if(this._bold) {
      result += "bold ";
    }
    
    result += this._size + "px ";
    result += this._name + "," + this._type;
    return result;
  },
  
  
  /** 
   * Returns the appoximate pixel dimensions of a string of text displayed 
   * with this font in a canvas 2D context. 
   */
  getStringDimensions:function(str) {
    var canvas = document.createElement("canvas");
    var g = canvas.getContext("2d");
    
    var width = 0;
    var height = 0;
    
    var lines = str.split("\n");
    for(var i in lines) {
      var line = lines[i];
      height += this._size;
      
      var w = g.measureText(line).width;
      if(w > width) {
        width = w;
      }
      
      height += this._vPad;
    }
    
    return [width, height];
  }
  
};


