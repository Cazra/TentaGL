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
    gl._cbRed = 0;
    gl._cbGreen = 0;
    gl._cbBlue = 0;
    gl._cbAlpha = 0;
    
    gl._cbWriteRed = true;
    gl._cbWriteGreen = true;
    gl._cbWriteBlue = true;
    gl._cbWriteAlpha = true;
    
    gl._stateStack = [];
  },
  
  
  
  /** 
   * Sets the color used to clear the color buffer for a gl context. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color
   */
  setClearColor:function(gl, color) {
    if(!TentaGL.Picker.isPicking(gl)) {
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
  },
  
  
  
  /** 
   * Saves the color buffer state to our stack. 
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    var state = {
      red:    gl._cbRed,
      green:  gl._cbGreen,
      blue:   gl._cbBlue,
      alpha:  gl._cbAlpha,
      writeRed:   gl._cbWriteRed,
      writeGreen: gl._cbWriteGreen,
      writeBlue:  gl._cbWriteBlue,
      writeAlpha: gl._cbWriteAlpha
    };
    
    gl._stateStack.push(state);
  },
  
  
  /** 
   * Restores the color buffer state from our stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var state = gl._stateStack.pop();
    
    gl._cbRed = state.red;
    gl._cbGreen = state.green;
    gl._cbBlue = state.blue;
    gl._cbAlpha = state.alpha;
    
    gl._cbWriteRed = state.writeRed;
    gl._cbWriteGreen = state.writeGreen;
    gl._cbWriteBlue = state.writeBlue;
    gl._cbWriteAlpha = state.writeAlpha;
  }
  
};


