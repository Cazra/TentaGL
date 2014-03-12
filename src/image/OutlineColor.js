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
 * An RGBA filter that adds a colored outline around the opaque parts of an image.
 * @constructor
 * @param {TentaGL.Color} color  The color used for the outline.
 */
TentaGL.RGBAFilter.OutlineColor = function(color) {
  this._color = color;
};


TentaGL.RGBAFilter.OutlineColor.prototype = {
  
  constructor:TentaGL.RGBAFilter.OutlineColor,
  
  
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
    
    // If at a translucent pixel, check for any surrounding opaque pixels.
    if(a != 255) {
      var xy = TentaGL.PixelData.indexToXY(index, width);
      var x = xy[0];
      var y = xy[1];
      
      for(var i=-1;  i <= 1; i++) {
        var y2 = y + i;
        if(y2 >= height || y2 < 0) {
          continue;
        }
        
        for(var j=-1; j <= 1; j++) {
          var x2 = x + j;
          if(x2 >= width || x2 < 0) {
            continue;
          }
          
          var index2 = TentaGL.PixelData.xyToIndex(x2, y2, width);
          var a2 = srcData[index2+3];
          
          // An adjacent pixel is opaque. Use the outline color.
          if(a2 == 255) {
            r = this._color.getRedByte();
            g = this._color.getGreenByte();
            b = this._color.getBlueByte();
            return this.setPixel(dstData, index, r, g, b, 255);
          }
        }
      }
    }
    
    // Not on the outline region. Use existing pixel color.
    this.setPixel(dstData, index, r, g, b, a);
  }
};


/** 
 * Creates a OutlineColor filter for a color defined by uint8 rgb values. 
 * @param {uint8} r
 * @param {uint8} g
 * @param {uint8} b
 * @return {TentaGL.RGBAFilter.OutlineColor}
 */
TentaGL.RGBAFilter.OutlineColor.RGBBytes = function(r, g, b) {
  var color = TentaGL.Color.RGBABytes(r, g, b);
  return new TentaGL.RGBAFilter.OutlineColor(color);
};



TentaGL.Inheritance.inherit(TentaGL.RGBAFilter.OutlineColor, TentaGL.RGBAFilter);


