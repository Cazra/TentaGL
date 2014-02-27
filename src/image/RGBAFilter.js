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
 * Encapsulation of some RGBA pixel filtering function. This is an abstract
 * class that should be inherited to produce your own custom RGBAFilters.
 */
TentaGL.RGBAFilter = {};

TentaGL.RGBAFilter.prototype = {
  
  constructor:TentaGL.RGBAFilter,
  
  /**
   * Applies the filter on a pixel in the srcData and puts the result RGBA 
   * values for the pixel in dstData. SrcData is not modified.
   *
   * Implement this.
   * @param {Uint8Array} dstData  The array where the result pixel data is stored.
   * @param {Uint8Array} srcData  The array from which the source pixel data is read.
   * @param {int} index   The index of the pixel being filtered in the arrays.
   * @param {int} width   The width of the textures the arrays define.
   * @param {int} height  The height of the textures the arrays define.
   */
  filter:function(dstData, srcData, index, width, height) {},
  
  
  /** 
   * Sets the rgba data for a pixel in a destination pixel data array. 
   * @param {Uint8Array} dstData
   * @param {int} index   the start index of the pixel in dstData. Each pixel is
   *      assumed to be composed of 4 bytes for the RGBA values.
   * @param {int} r
   * @param {int} g
   * @param {int} b
   * @param {int} a
   */
  setPixel:function(dstData, index, r, g, b, a) {
    dstData[index] = r;
    dstData[index+1] = g;
    dstData[index+2] = b;
    dstData[index+3] = a;
  }
  
};

