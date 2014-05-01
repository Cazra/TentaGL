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
 * A simple API for setting the depth-testing state of the gl context.
 */
TentaGL.Depth = {
  
  _test: false,
  
  _func: GL_LESS,
  
  _write: true,
  
  _wNear: 0,
  
  _wFar: 1,
  
  _clearVal: 1,
  
  
  /** 
   * Enables or disables the depth test for texels. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setEnabled:function(gl, enabled) {
    if(this._test != enabled) {
      this._test = enabled;
      
      if(enabled) {
        gl.enable(GL_DEPTH_TEST);
      }
      else {
        gl.disable(GL_DEPTH_TEST);
      }
    }
  },
  
  
  /** 
   * Returns whether the depth test is enabled.
   * @return {boolean}
   */
  isTestEnabled:function() {
    return this._enabled;
  },
  
  
  
  /** 
   * Sets the depth comparison function. 
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} func
   */
  setFunc:function(gl, func) {
    if(this._func != func) {
      this._func = func;
      
      gl.depthFunc(func);
    }
  },
  
  
  /** 
   * Returns the depth comparison function being used. 
   * @return {glEnum}
   */
  getFunc:function() {
    return this._func;
  },
  
  
  /** 
   * Sets whether the depth buffer is enabled for writing. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setMaskEnabled:function(gl, enabled) {
    if(this._write != enabled) {
      this._write = enabled;
      
      gl.depthMask(enabled);
    }
  },
  
  
  /** 
   * Returns whether the depth buffer is enabled for writing.
   * @return {boolean}
   */
  isMaskEnabled:function() {
    return this._write;
  },
  
  
  /** 
   * Sets the linear mapping of depth values from normalized device coordinates 
   * [-1, 1] to window coordinates [0,1].
   * It is not necessary that near be less than far. Reverse mappings such as
   * near = 1 and far = 0 are acceptable.
   * @param {WebGLRenderingContext} gl
   * @param {float} near    The mapping of the near clipping plane to window coordinates.
   * @param {float} far     The mapping of the far clipping plane to window coordinates.
   */
  setRange:function(gl, near, far) {
    near = TentaGL.Math.clamp(near, 0, 1);
    far = TentaGL.Math.clamp(far, 0, 1);
    
    if(this._wNear != near || this._wFar != far) {
      this._wNear = near;
      this._wFar = far;
      
      gl.depthRange(near, far);
    }
  },
  
  
  /** 
   * Returns the mapping of the near clipping plane to window coordinates.
   * @return {float}
   */
  getRangeNear:function() {
    return this._wNear;
  },
  
  
  /** 
   * Returns the mapping of the far clipping plane to window coordinates.
   * @return {float}
   */
  getRangeFar:function() {
    return this._wFar;
  },
  
  
  /** 
   * Sets the clear value for the depth buffer.
   * @param {WebGLRenderingContext} gl
   * @param {float} value
   */
  setClearValue:function(gl, value) {
    value = TentaGL.Math.clamp(value, 0, 1);
    if(this._clearVal != value) {
      this._clearVal = value;
      
      gl.clearDepth(value);
    }    
  },
  
  
  /** 
   * Returns the clear value for the depth buffer.
   * @return {float}
   */
  getClearValue:function() {
    return this._clearVal;
  },
  
  
  /** 
   * Clears the depth buffer. 
   * @param {WebGLRenderingContext} gl
   */
  clear:function(gl) {
    gl.clear(GL_DEPTH_BUFFER_BIT);
  },
  
  
  /** 
   * Creates an off-screen depth buffer. 
   * @param {WebGLRenderingContext} gl
   * @param {int} width
   * @param {int} height
   * @return {WebGLRenderbuffer}
   */
  createBuffer:function(gl, width, height) {
    var buffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(GL_RENDERBUFFER, buffer);
    gl.renderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT16, width, height);
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    return buffer;
  },
};
