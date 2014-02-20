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
 * Encapsulates a rectangular area of raw pixel data.
 * @constructor
 * @param {Uint8Array} rgbaByteArray   The array containing the pixel data.
 *      The size of the array should be width*height*4, each element should be 
 *      represented by 4 consecutive bytes in RGBA order, and the first 
 *      element should be the pixel in the lower-left corner of the image the 
 *      array represents. Each row in the array is read from bottom to top, 
 *      and left to right in each row.
 * @param {int} width
 * @param {int} height
 */
TentaGL.PixelData = function(rgbaByteArray, width, height) {
  this._pixels = rgbaByteArray;
  this._width = width;
  this._height = height;
};


TentaGL.PixelData.prototype = {
  
  constructor:TentaGL.PixelData,
  
  
  /** 
   * Returns the width of the pixel area. 
   * @return {int}
   */
  getWidth:function() {
    return this._width;
  },
  
  /** 
   * Returns the height of the pixel area. 
   * @return {int}
   */
  getHeight:function() {
    return this._height;
  },
  
  
  /**
   * Returns the array of pixel data wrapped by this object.
   * @return {Uint8Array}
   */
  getData:function() {
    return this._pixels;
  },
  
  
  /** 
   * Extracts the RGBA values of the pixel at the specified coordinates in the 
   * source data. 
   * @param {int} x
   * @param {int} y
   * @param {int} flipY   Optional. If true, y increases downward. 
   *      Default to false.
   * @return {length-4 array}   An array containing the RGBA byte values for 
   *      the pixel.
   */
  getPixelAt:function(x, y, flipY) {
    if(flipY) {
      y = this.height-1-y;
    }
    
    var index = (this._width*y + x)*4;
    var r = this._pixels[index];
    var g = this._pixels[index+1];
    var b = this._pixels[index+2];
    var a = this._pixels[index+3];
    return [r, g, b, a];
  }
};


/** 
 * Extracts and returns the PixelData for a texture stored in GL memory. 
 * @param {WebGLRenderingContext} gl
 * @param {WebGLTexture} glTex
 * @param {int} x
 * @param {int} y
 * @param {int} w
 * @param {int} h
 */
TentaGL.PixelData.GLTexture = function(gl, glTex, x, y, w, h) {
  
  var fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glTex, 0);
  
  var data = new Uint8Array(w*h*4);
  gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fb);
  
  return new TentaGL.PixelData(data, w, h);
};

