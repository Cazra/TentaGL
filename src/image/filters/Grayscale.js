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
 * An RGBA filter that converts pixels to greyscale.
 * @constructor
 */
TentaGL.RGBAFilter.Grayscale = function() {
};


TentaGL.RGBAFilter.Grayscale.prototype = {
  
  constructor:TentaGL.RGBAFilter.Grayscale,
  
  

  /** See TentaGL.RGBAFilter.apply */
  filter:function(dstData, srcData, index, width, height) {
    var r = srcData[index]/255;
    var g = srcData[index+1]/255;
    var b = srcData[index+2]/255;
    var a = srcData[index+3]/255;
    
    var y = 0.2126*r + 0.7152*g + 0.0722*b;
    
    var rgba = TentaGL.Color.HSBAtoRGBA(0, 0, y, a);
  //  console.log(rgba);
    r = (rgba[0]*255)&0xFF;
    g = (rgba[1]*255)&0xFF;
    b = (rgba[2]*255)&0xFF;
    a = (rgba[3]*255)&0xFF;
    
    this.setPixel(dstData, index, r, g, b, a);
  }
};


TentaGL.Inheritance.inherit(TentaGL.RGBAFilter.Grayscale, TentaGL.RGBAFilter);


