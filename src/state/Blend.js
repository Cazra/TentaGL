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
 * Simple API for setting the blending state of the gl context. The API 
 * is optimized to avoid making unnecessary repeat calls to change the internal  
 * graphics state. Therefore, it is strongly encouraged for TentaGL
 * applications to change the blending state of the gl context through this
 * API instead of directly through the gl context.
 */
TentaGL.Blend = {
  
  
  /** 
   * Enables or disables blending. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setEnabled:function(gl, enabled) {
    if(gl._blendEnabled != enabled && !TentaGL.Picker.isPicking(gl)) {
      gl._blendEnabled = enabled;
      
      if(enabled) {
        gl.enable(GL_BLEND);
      }
      else {
        gl.disable(GL_BLEND);
      }
    }
  },
  
  
  /** 
   * Returns whether blending is enabled in the gl state. 
   * @return {boolean}
   */
  isEnabled:function(gl) {
    return gl._blendEnabled;
  },
  
  
  
  /** 
   * Setter/getter for whether blending is enabled.
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled   Optional.
   * @return {boolean}
   */
  enabled: function(gl, enabled) {
    if(enabled !== undefined) {
      this.setEnabled(gl, enabled);
    }
    return gl._blendEnabled;
  },
  
  
  
  /** 
   * Sets the blend equation and blend functions.
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} equation   Any allowed value for gl.blendEquation
   * @param {glEnum} srcFunc    Any allowed source function value for gl.blendFunc.
   * @param {glEnum} dstFunc    Any allowed dest function value for gl.blendFunc.
   */
  setEquation:function(gl, equation, srcFunc, dstFunc) {
    if(gl._blendEquation != equation) {
      gl._blendEquation = equation;
      gl.blendEquation(equation);
    }
    
    if(gl._blendSrcFunc != srcFunc || gl._blendDstFunc != dstFunc) {
      gl._blendSrcFunc = srcFunc;
      gl._blendDstFunc = dstFunc;
      
      gl.blendFunc(srcFunc, dstFunc);
    }
  },
  
  
  /** 
   * Returns the equation being used for blending.
   * @return {glEnum}
   */
  getEquation:function(gl) {
    return gl._blendEquation;
  },
  
  
  /** 
   * Setter/getter for the blending equation. 
   * As a setter, this also sets the src and dst functions.
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} eq         Optional. Any allowed value for gl.blendEquation.
   * @param {glEnum} srcFunc    Optional. Any allowed source function value for gl.blendFunc.
   * @param {glEnum} dstFunc    Optional. Any allowed dest function value for gl.blendFunc.
   * @return {glEnum}
   */
  equation: function(gl, equation, srcFunc, dstFunc) {
    if(equation !== undefined) {
      this.setEquation(gl, equation, srcFunc, dstFunc);
    }
    return gl._blendEquation;
  },
  
  
  /** 
   * Returns the source function used for blending in a gl context.
   * @param {WebGLRenderingContext} gl
   * @return {glEnum}
   */
  getSrcFunc:function(gl) {
    return gl._blendSrcFunc;
  },
  
  
  /** 
   * Returns the dst function used for blending in a gl context.
   * @return {glEnum}
   */
  getDstFunc:function(gl) {
    return gl._blendDstFunc;
  },
  
  
  
  /** 
   * Setter/getter for the blending color.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  color: function(gl, color) {
    if(color !== undefined && !color.equals(gl._blendColor)) {
      gl._blendColor = color.clone();
      gl.blendColor(color.r(), color.g(), color.b(), color.a());

    }
    return gl._blendColor.clone();
  },
  
  
  /** 
   * Resets the metadata about the gl context's blending state. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._blendEnabled = false;
    
    gl._blendEquation = GL_FUNC_ADD;
    gl._blendSrcFunc = GL_ONE;
    gl._blendDstFunc = GL_ZERO;
    
    gl._blendColor = TentaGL.Color.RGBA(0,0,0,0);
    
    gl._blendStack = [];
  },
  
  
  /** 
   * Saves the blending state to the stack.
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    var state = {
      _blendEnabled:    gl._blendEnabled,
      _blendEquation:   gl._blendEquation,
      _blendSrcFunc:    gl._blendSrcFunc,
      _blendDstFunc:    gl._blendDstFunc,
      _blendColor:      gl._blendColor
    };
    
    gl._blendStack.push(state);
  },
  
  /** 
   * Restores the blending state from the stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var state = gl._blendStack.pop();
    
    this.enabled(gl, state._blendEnabled);
    this.equation(gl, state._blendEquation, state._blendSrcFunc, state._blendDstFunc);
    this.color(gl, state._blendColor);
  }
  
};