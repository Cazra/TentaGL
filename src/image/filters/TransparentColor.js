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
 * An RGBA filter that causes all pixels with some RGB value to become 
 * completely transparent.
 * @constructor
 * @param {vec4 || TentaGL.Color} color  The color to be made transparent. If 
 *      given as a vec4, this is expected to be in normalized RGBA format.
 */
TentaGL.RGBAFilter.TransparentColor = function(color) {
  if(!color.isaColor) {
    color = new TentaGL.Color(color);
  }
  this._tColor = color;
};


TentaGL.RGBAFilter.TransparentColor.prototype = {
  
  constructor:TentaGL.RGBAFilter.TransparentColor,
  
  
  /**
   * Returns the color being used by this filter for transparency.
   * @return {TentaGL.Color}
   */
  getTransparentColor:function() {
    return this._tColor;
  },
  

  /** See TentaGL.RGBAFilter.apply */
  filter:function(dstData, srcData, index, width, height) {
    var r = srcData[index];
    var g = srcData[index+1];
    var b = srcData[index+2];
    var a = srcData[index+3];
    
    var tr = this._tColor.getRedByte();
    var tg = this._tColor.getGreenByte();
    var tb = this._tColor.getBlueByte();
    
    if(r == tr && g == tg && b == tb) {
      a = 0;
    }
    
    this.setPixel(dstData, index, r, g, b, a);
  }
};


Util.Inheritance.inherit(TentaGL.RGBAFilter.TransparentColor, TentaGL.RGBAFilter);


