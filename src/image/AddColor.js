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
 * An RGBA filter that adds a color's RGB value to all pixels.
 * @constructor
 * @param {TentaGL.Color} color  The additive color.
 */
TentaGL.RGBAFilter.AddColor = function(color) {
  this._color = color;
};


TentaGL.RGBAFilter.AddColor.prototype = {
  
  constructor:TentaGL.RGBAFilter.AddColor,
  
  
  /**
   * Returns the color being used by this filter for transparency.
   * @return {TentaGL.Color}
   */
  getColor:function() {
    return this._color;
  },
  

  /** See TentaGL.RGBAFilter.apply */
  filter:function(dstData, srcData, index, width, height) {
    var r = srcData[index];
    var g = srcData[index+1];
    var b = srcData[index+2];
    var a = srcData[index+3];
    
    r = TentaGL.Math.clamp(r + this._color.getRedByte(), 0, 255);
    g = TentaGL.Math.clamp(g + this._color.getGreenByte(), 0, 255);
    b = TentaGL.Math.clamp(b + this._color.getBlueByte(), 0, 255);
    
    this.setPixel(dstData, index, r, g, b, a);
  }
};


/** 
 * Creates a AddColor filter for a color defined by uint8 rgb values. 
 * @param {uint8} r
 * @param {uint8} g
 * @param {uint8} b
 * @return {TentaGL.RGBAFilter.AddColor}
 */
TentaGL.RGBAFilter.AddColor.RGBBytes = function(r, g, b) {
  var color = TentaGL.Color.RGBABytes(r, g, b);
  return new TentaGL.RGBAFilter.AddColor(color);
};



TentaGL.Inheritance.inherit(TentaGL.RGBAFilter.AddColor.prototype, TentaGL.RGBAFilter.prototype);


