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
  
  
  /** 
   * Resets the metadata about the gl context's color buffer state. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._cbLock = false;
    
    gl._cbRed = 0;
    gl._cbGreen = 0;
    gl._cbBlue = 0;
    gl._cbAlpha = 0;
    
    gl._cbWriteRed = true;
    gl._cbWriteGreen = true;
    gl._cbWriteBlue = true;
    gl._cbWriteAlpha = true;
  },
  
  
  /** 
   * Locks the clear color so that it cannot be changed through this API 
   * until unlock is called. 
   */
  lock:function(gl) {
    gl._cbLock = true;
  },
  
  
  /** Unlocks the clear color. */
  unlock:function(gl) {
    gl._cbLock = false;
  },
  
  
  
  /** 
   * Sets the color used to clear the color buffer for a gl context. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color
   */
  setClearColor:function(gl, color) {
    if(!gl._cbLock) {
      gl._cbRed = color.getRed();
      gl._cbGreen = color.getGreen();
      gl._cbBlue = color.getBlue();
      gl._cbAlpha = color.getAlpha();
      
      gl.clearColor(gl._cbRed, gl._cbGreen, gl._cbBlue, gl._cbAlpha);
    }
  },
  
  
  /** 
   * Returns the clear color for a gl context. 
   * @return {vec4}
   */
  getClearColor:function(gl) {
    return vec4.fromValues(gl._cbRed, gl._cbGreen, gl._cbBlue, gl._cbAlpha);
  },
  
  
  /** Sets which color components are writable in the buffer. */
  setWriteable:function(gl, red, green, blue, alpha) {
    gl._cbWriteRed = red;
    gl._cbWriteGreen = green;
    gl._cbWriteBlue = blue;
    gl._cbWriteAlpha = alpha;
    
    gl.colorMask(red, green, blue, alpha);
  },
  
  
  /** 
   * Clears the color buffer.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color   Optional. Specify the clear color.
   */
  clear:function(gl, color) {
    if(color) {
      this.setClearColor(gl, color);
    }
    gl.clear(GL_COLOR_BUFFER_BIT);
  }
  
  
  
  
  
};


