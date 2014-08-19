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
    gl._cbClear = TentaGL.Color.RGBA(0,0,0,0);
    
    gl._cbWriteRed = true;
    gl._cbWriteGreen = true;
    gl._cbWriteBlue = true;
    gl._cbWriteAlpha = true;
    
    gl._cbStack = [];
  },
  
  
  
  /** 
   * Sets the color used to clear the color buffer for a gl context. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color
   */
  setClearColor:function(gl, color) {
    if(!TentaGL.Picker.isPicking(gl)) {
      gl._cbClear = color.clone();
      gl.clearColor(color.r(), color.g(), color.b(), color.a());
    }
  },
  
  
  /** 
   * Returns the clear color for a gl context. 
   * @param {WebGLRenderingContext} gl
   * @return {TentaGL.Color}
   */
  getClearColor:function(gl) {
    return gl._cbClear.clone();
  },
  
  
  /** 
   * Setter/getter for the clear color. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  clearColor: function(gl, color) {
    if(color) {
      this.setClearColor(gl, color);
    }
    return gl._cbClear.clone();
  },
  
  
  /** 
   * Sets which color components are writable in the buffer. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} red
   * @param {boolean} green
   * @param {boolean} blue
   * @param {boolean} alpha
   */
  setWriteable:function(gl, red, green, blue, alpha) {
    gl._cbWriteRed = red;
    gl._cbWriteGreen = green;
    gl._cbWriteBlue = blue;
    gl._cbWriteAlpha = alpha;
    
    gl.colorMask(red, green, blue, alpha);
  },
  
  
  /** 
   * Setter/getter for whether each color component can be written.
   * @param {WebGLRenderingContext} gl
   * @param {boolean} red
   * @param {boolean} green
   * @param {boolean} blue
   * @param {boolean} alpha
   * @return {array: boolean*4}
   */
  mask: function(gl, red, green, blue, alpha) {
    if(red !== undefined) {
      gl._cbWriteRed = red;
      gl._cbWriteGreen = green;
      gl._cbWriteBlue = blue;
      gl._cbWriteAlpha = alpha;
      
      gl.colorMask(red, green, blue, alpha);
    }
    return [gl._cbWriteRed, gl._cbWriteGreen, gl._cbWriteBlue, gl._cbWriteAlpha];
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
      _cbClear:      gl._cbClear,
      _cbWriteRed:   gl._cbWriteRed,
      _cbWriteGreen: gl._cbWriteGreen,
      _cbWriteBlue:  gl._cbWriteBlue,
      _cbWriteAlpha: gl._cbWriteAlpha
    };
    
    gl._cbStack.push(state);
  },
  
  
  /** 
   * Restores the color buffer state from our stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var state = gl._cbStack.pop();
    
    this.clearColor(gl, state._cbClear);
    this.setWriteable(gl, state._cbWriteRed, state._cbWriteGreen, state._cbWriteBlue, state._cbWriteAlpha);
  }
  
};


