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
  
  
  lock:function(gl) {
    gl._blendLocked = true;
  },
  
  unlock:function(gl) {
    gl._blendLocked = false;
  },
  
  
  /** 
   * Enables or disables blending. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setEnabled:function(gl, enabled) {
    if(gl._blendEnabled != enabled && !gl._blendLocked) {
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
   * Sets the blend color for a gl context.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color
   */
  setBlendColor:function(gl, color) {
    var r = color.getRed();
    var g = color.getGreen();
    var b = color.getBlue();
    var a = color.getAlpha();
    
    if(gl._blendRed != r || gl._blendGreen != g || gl._blendBlue != b || gl._blendAlpha != a) {
      gl._blendRed = r;
      gl._blendGreen = g;
      gl._blendBlue = b;
      gl._blendAlpha = a;
      
      gl.blendColor(r, g, b, a);
    }
  },
  
  
  /** 
   * Returns the blending color being used by a gl context.
   * @param {WebGLRenderingContext} gl
   * @return {TentaGL.Color}
   */
  getBlendColor:function(gl) {
    var color = TentaGL.Color.RGBA(gl._blendRed, gl._blendGreen, gl._blendBlue, gl._blendAlpha);
    return color;
  },
  
  
  /** 
   * Resets the metadata about the gl context's blending state. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._blendLocked = false;
    gl._blendEnabled = false;
    
    gl._blendEquation = GL_FUNC_ADD;
    gl._blendSrcFunc = GL_ONE;
    gl._blendDstFunc = GL_ZERO;
    
    gl._blendRed = 0;
    gl._blendGreen = 0;
    gl._blendBlue = 0;
    gl._blendAlpha = 0;
  }
  
};