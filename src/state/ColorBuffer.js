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
 * A simple API for changing the color buffer state of the gl context.
 */ 
TentaGL.ColorBuffer = {
  
  _red: 0,
  
  _green: 0,
  
  _blue: 0,
  
  _alpha: 0,

  
  _writeRed: true,
  
  _writeGreen: true,
  
  _writeBlue: true,
  
  _writeAlpha: true,
  
  
  _lock: false,
  
  
  /** Locks the clear color so that it cannot be changed through this API until unlock is called. */
  lock:function() {
    this._lock = true;
  },
  
  
  /** Unlocks the clear color. */
  unlock:function() {
    this._lock = false;
  },
  
  
  
  /** 
   * Sets the color used to clear the color buffer. 
   * @param {WebGLRenderingContext} gl
   * @param {vec4} rgba   Normalized rgba color values.
   */
  setClearColor:function(gl, rgba) {
    if(!this._lock) {
      this._red = rgba[0];
      this._green = rgba[1];
      this._blue = rgba[2];
      this._alpha = rgba[3];
      
      gl.clearColor(this._red, this._green, this._blue, this._alpha);
    }
  },
  
  
  /** 
   * Returns the clear color in normalized rgba format. 
   * @return {vec4}
   */
  getClearColor:function() {
    return vec4.fromValues(this._red, this._green, this._blue, this._alpha);
  },
  
  
  /** Sets which color components are writable in the buffer. */
  setWriteable:function(gl, red, green, blue, alpha) {
    
    this._writeRed = red;
    this._writeGreen = green;
    this._writeBlue = blue;
    this._writeAlpha = alpha;
    gl.colorMask(red, green, blue, alpha);
  },
  
  
  /** 
   * Clears the color buffer.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color   Optional. Specify the clear color.
   */
  clear:function(gl, rgba) {
    if(rgba) {
      this.setClearColor(gl, rgba);
    }
    gl.clear(GL_COLOR_BUFFER_BIT);
  },
  
};


