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
TentaGL.DepthBuffer = {
  
  /** 
   * Resets the metadata about the depth buffer test for a gl context.
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._depthEnabled = false;
    gl._depthFunc = GL_LESS;
    gl._depthWrite = true;
    
    gl._depthRange = [0, 1];
    
    gl._depthClearVal = 1;
    
    gl._depthStack = [];
  },
  
  
  
  /** 
   * Enables or disables the texel depth test for a gl context. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setEnabled:function(gl, enabled) {
    if(gl._depthEnabled != enabled) {
      gl._depthEnabled = enabled;
      
      if(enabled) {
        gl.enable(GL_DEPTH_TEST);
      }
      else {
        gl.disable(GL_DEPTH_TEST);
      }
    }
  },
  
  
  /** 
   * Returns whether the texel depth test is enabled for a gl context.
   * @param {WebGLRenderingContext} gl
   * @return {boolean}
   */
  isTestEnabled:function(gl) {
    return gl._depthEnabled;
  },
  
  
  /** 
   * Setter/getter for whether the depth test is enabled.
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   * @return {boolean}
   */
  enabled: function(gl, enabled) {
    if(enabled !== undefined) {
      this.setEnabled(gl, enabled);
    }
    return gl._depthEnabled;
  },
  
  
  
  /** 
   * Sets the depth comparison function. 
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} func
   */
  setFunc:function(gl, func) {
    if(gl._depthFunc != func) {
      gl._depthFunc = func;
      
      gl.depthFunc(func);
    }
  },
  
  
  /** 
   * Returns the depth comparison function being used. 
   * @param {WebGLRenderingContext} gl
   * @return {glEnum}
   */
  getFunc:function(gl) {
    return gl._depthFunc;
  },
  
  
  /** 
   * Setter/getter for the comparison function used for the depth test.
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} f
   * @return {glEnum}
   */
  func: function(gl, f) {
    if(f !== undefined) {
      this.setFunc(gl, f);
    }
    return gl._depthFunc;
  },
  
  
  
  /** 
   * Sets whether the depth buffer is enabled for writing. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setMaskEnabled:function(gl, enabled) {
    if(gl._depthWrite != enabled) {
      gl._depthWrite = enabled;
      
      gl.depthMask(enabled);
    }
  },
  
  
  /** 
   * Returns whether the depth buffer is enabled for writing.
   * @param {WebGLRenderingContext} gl
   * @return {boolean}
   */
  isMaskEnabled:function(gl) {
    return gl._depthWrite;
  },
  
  
  /** 
   * Setter/getter for whether masking is enabled for the depth buffer, so that
   * it can be written to.
   * @param {webGLRenderingContext} gl
   * @param {boolean} enabled
   * @return {boolean}
   */
  mask: function(gl, enabled) {
    if(enabled !== undefined) {
      this.setMaskEnabled(gl, enabled);
    }
    return gl._depthWrite;
  },
  
  
  /** 
   * Sets the linear mapping of depth values from normalized device coordinates 
   * [-1, 1] to window coordinates [0,1].
   * It is not necessary that near be less than far. Reverse mappings such as
   * near = 1 and far = 0 are acceptable.
   * @param {WebGLRenderingContext} gl
   * @param {array: [near, far]}  nearFar
   */
  setRange: function(gl, nearFar) {
    var near = TentaGL.Math.clamp(nearFar[0], 0, 1);
    var far = TentaGL.Math.clamp(nearFar[1], 0, 1);
    
    if(near != gl._depthRange[0] || far != gl._depthRange[1]) {
      gl._depthRange[0] = near;
      gl._depthRange[1] = far;
      
      gl.depthRange(near, far);
    }
  },
  
  
  /** 
   * Setter/getter for the near/far planes range.
   * @param {WebGLRenderingContext} gl
   * @param {array: [near, far]} nearFar
   * @return {array: [near, far]}
   */
  range: function(gl, nearFar) {
    if(nearFar !== undefined) {
      this.setRange(gl, nearFar);
    }
    return gl._depthRange;
  },
  
  
  /** 
   * Returns the mapping of the near clipping plane to window coordinates.
   * @param {WebGLRenderingContext} gl
   * @return {float}
   */
  getRangeNear:function(gl) {
    return gl._depthRange[0];
  },
  
  
  /** 
   * Returns the mapping of the far clipping plane to window coordinates.
   * @param {WebGLRenderingContext} gl
   * @return {float}
   */
  getRangeFar:function(gl) {
    return gl._depthRange[1];
  },
  
  
  /** 
   * Sets the clear value for the depth buffer.
   * @param {WebGLRenderingContext} gl
   * @param {float} value
   */
  setClearValue:function(gl, value) {
    value = TentaGL.Math.clamp(value, 0, 1);
    if(gl._depthClearVal != value) {
      gl._depthClearVal = value;
      
      gl.clearDepth(value);
    }    
  },
  
  
  /** 
   * Returns the clear value for the depth buffer.
   * @param {WebGLRenderingContext} gl
   * @return {float}
   */
  getClearValue:function() {
    return gl._depthClearVal;
  },
  
  
  /** 
   * Setter/getter for the clear value of the depth buffer.
   * @param {WebGLRenderingContext} gl
   * @param {float} value
   * @return {float}
   */
  clearValue: function(gl, value) {
    if(value !== undefined) {
      this.setClearValue(gl, value);
    }
    return gl._depthClearVal;
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
  
  
  /** 
   * Saves the depth buffer state to the stack.
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    var state = {
      _depthEnabled:    gl._depthEnabled,
      _depthFunc:       gl._depthFunc,
      _depthWrite:      gl._depthWrite,
      _depthRange:      gl._depthRange.slice(0),
      _depthClearVal:   gl._depthClearVal
    };
    
    gl._depthStack.push(state);
  },
  
  
  /** 
   * Restores the depth buffer state from the stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var state = gl._depthStack.pop();
    
    this.enabled(gl, state._depthEnabled);
    this.func(gl, state._depthFunc);
    this.mask(gl, state._depthWrite);
    this.range(gl, state._depthRange);
    this.clearValue(gl, state._depthClearVal);
  }
};
