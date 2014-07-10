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
 * A simple API for setting the stencil-testing state of the gl context.
 */
TentaGL.Stencil = {
  
  /** 
   * Resets the metadata about the stencil-testing state of a gl context.
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._stencilEnabled = false;
    gl._stencilClearVal = 0;
  },
  
  
  /**
   * Enables or disables stencil testing. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setTestEnabled:function(gl, enabled) {
    if(gl._stencilEnabled != enabled) {
      gl._stencilEnabled = enabled;
      
      if(enabled) {
        gl.enable(GL_STENCIL_TEST);
      }
      else {
        gl.disable(GL_STENCIL_TEST);
      }
    }
  },
  
  
  /**
   * Returns whether stencil testing is enabled.
   * @return {boolean}
   */
  isStencilEnabled:function() {
    return gl._stencilEnabled;
  },
  
  
  /** 
   * Sets the clear value for the stencil buffer.
   * @param {WebGLRenderingContext} gl
   * @param {uint} value
   */
  setClearValue:function(gl, value) {
    if(gl._stencilClearVal != value) {
      gl._stencilClearVal = value;
      
      gl.clearStencil(value);
    }
  },
  
  
  /** 
   * Returns the clear value for the stencil buffer. 
   * @return {uint}
   */
  getClearValue:function() {
    return gl._stencilClearVal;
  },
  
  
  
  /**
   * Creates an off-screen stencil buffer.
   * @param {WebGLRenderingContext} gl
   * @param {int} width
   * @param {int} height
   * @return {WebGLRenderbuffer}
   */
  createStencilBuffer: function(gl, width, height) {
    var buffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    return buffer;
  }
};
