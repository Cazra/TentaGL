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
 * NOTE: The stencil buffer is not defined in WebGL by default. 
 * To use the stencil buffer, you'll need to provide the attribute stencil=true
 * to the Application's context attributes upon creation.
 */
TentaGL.Stencil = {
  
  /** 
   * Setter/getter for whether the stencil test is enabled.
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   * @return {boolean}
   */
  enabled: function(gl, enabled) {
    if(enabled !== undefined && enabled != gl._stencilEnabled) {
      gl._stencilEnabled = enabled;
      if(enabled) {
        gl.enable(GL_STENCIL_TEST);
      }
      else {
        gl.disable(GL_STENCIL_TEST);
      }
    }
    return gl._stencilEnabled;
  },
  
  
  /** 
   * Setter/getter for the clear value of the stencil buffer.
   * @param {WebGLRenderingContext} gl
   * @param {int} s
   * @return {int}
   */
  clearValue: function(gl, s) {
    if(s !== undefined && s != gl._stencilClearVal) {
      gl._stencilClearVal = s;
      gl.clearStencil(s);
    }
    return gl._stencilClearVal;
  },
  
  
  /** 
   * Setter/getter for the front and back stencil test function.
   * As a setter, this also sets the reference value and the mask.
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} func
   * @param {int} ref
   * @param {uint} mask
   * @return {glEnum}
   */
  func: function(gl, func, ref, mask) {
    if(func !== undefined) {
      gl._stencilFunc = func;
      gl._stencilRef = ref;
      gl._stencilMask = mask;
      gl.stencilFunc(func, ref, mask);
    }
    return gl._stencilFunc;
  },
  
  
  /** 
   * Returns the reference value for the current stencil function.
   * @param {WebGLRenderingContext} gl
   * @return {int}
   */
  getRef: function(gl) {
    return gl._stencilRef;
  },
  
  
  /** 
   * Setter/getter for the mask value for the front and back 
   * stencil test function.
   * @param {WebGLRenderingContext} gl
   * @param {uint} mask
   * @return {uint}
   */
  mask: function(gl, mask) {
    if(mask !== undefined) {
      gl._stencilWriteMask = mask;
      gl.stencilMask(mask);
    }
    return gl._stencilWriteMask;
  },
  
  
  /** 
   * Setter/getter for the front and back stencil test actions.
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} sFail
   * @param {glEnum} dpFail
   * @param {glEnum} dpPass
   * @return {array: [sFail, dpFail, dpPass]}
   */
  op: function(gl, sFail, dpFail, dpPass) {
    if(sFail !== undefined) {
      gl._stencilFailS = sFail;
      gl._stencilFailDP = dpFail;
      gl._stencilPassDP = dpPass;
      
      gl.stencilOp(sFail, dpFail, dpPass);
    }
    return [gl._stencilFailS, gl._stencilFailDP, gl._stencilPassDP];
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
  },
  
  
  /** 
   * Resets the metadata about the stencil-testing state of a gl context.
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._stencilEnabled = false;
    
    gl._stencilClearVal = 0;
    
    gl._stencilFunc = GL_ALWAYS;
    gl._stencilRef = 0;
    gl._stencilMask = 0xFF;
    
    gl._stencilWriteMask = 0xFF;
    
    gl._stencilFailS = GL_KEEP;
    gl._stencilFailDP = GL_KEEP;
    gl._stencilPassDP = GL_KEEP;
    
    gl._stencilStack = [];
  },
  
  
  /** 
   * Saves the stencil test state to the stack.
   * @param {WebGLRenderingContext} gl 
   */
  push: function(gl) {
    var state = {
      _stencilEnabled:    gl._stencilEnabled,
      _stencilClearVal:   gl._stencilClearVal,
      _stencilFunc:       gl._stencilFunc,
      _stencilRef:        gl._stencilRef,
      _stencilMask:       gl._stencilMask,
      _stencilWriteMask:  gl._stencilWriteMask,
      _stencilFailS:      gl._stencilFailS,
      _stencilFailDP:     gl._stencilFailDP,
      _stencilPassDP:     gl._stencilPassDP
    };
    
    gl._stencilStack.push(state);
  },
  
  /** 
   * Restores the stencil test state from the stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var state = gl._stencilStack.pop();
    
    this.enabled(gl, state._stencilEnabled);
    this.clearValue(gl, state._stencilClearVal);
    this.func(gl, state._stencilFunc, state._stencilRef, state._stencilMask);
    this.mask(gl, state._stencilWriteMask);
    this.op(gl, state._stencilFailS, state._stencilFailDP, state._stencilPassDP);
  }
};
