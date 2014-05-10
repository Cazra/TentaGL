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
 * Clears all pixels whose RGB values do not match the specified color within some tolerance. 
 * Those pixels are set to RGBA = [0,0,0,0]. All matching pixels are kept and
 * have their alpha components set to 255.
 * @constructor
 * @param {TentaGL.Color} color
 * @param {Number} tolerance  Optional. A tolerance level in range [0, 1]. Default 0.
 */
TentaGL.RGBAFilter.OneColor = function(color, tolerance) {
  if(!tolerance) {
    tolerance = 0;
  }
  
  this._color = color;
  this._tolerance = tolerance;
};

TentaGL.RGBAFilter.OneColor.prototype = {
  
  constructor:TentaGL.RGBAFilter.OneColor,
  
  
  /** Returns the color for this filter. */
  getColor:function() {
    return this._color;
  },
  
  /** 
   * Returns the tolerance level for this filter.
   * @return {Number}
   */
  getTolerance:function() {
    return this._tolerance;
  },
  

  /** See TentaGL.RGBAFilter.apply */
  filter:function(dstData, srcData, index, width, height) {
    var r = srcData[index];
    var g = srcData[index+1];
    var b = srcData[index+2];
    var a = srcData[index+3];
    
    var dr = Math.abs(r-this._color.getRedByte())/255;
    var dg = Math.abs(g-this._color.getGreenByte())/255;
    var db = Math.abs(b-this._color.getBlueByte())/255;
    
    if(dr*dr + dg*dg + db*db > this._tolerance*this._tolerance) {
      r = 0;
      g = 0;
      b = 0;
      a = 0;
    }
    else {
      r = this._color.getRedByte();
      g = this._color.getGreenByte();
      b = this._color.getBlueByte();
      a = 255;
    }
    
    this.setPixel(dstData, index, r, g, b, a);
  }
};


TentaGL.Inheritance.inherit(TentaGL.RGBAFilter.OneColor, TentaGL.RGBAFilter);


