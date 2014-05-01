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
  
  _enabled: false,
  
  _equation: GL_FUNC_ADD,
  
  _srcFunc: GL_ONE,
  
  _dstFunc: GL_ZERO,
  
  _red: 0.0,
  
  _green: 0.0,
  
  _blue: 0.0,
  
  _alpha: 0.0,
  
  _locked: false,
  
  
  lock:function() {
    this._locked = true;
  },
  
  unlock:function() {
    this._locked = false;
  },
  
  
  /** 
   * Enables or disables blending. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled
   */
  setEnabled:function(gl, enabled) {
    if(this._enabled != enabled && !this._locked) {
      this._enabled = enabled;
      
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
  isEnabled:function() {
    return this._enabled;
  },
  
  
  
  
  /** 
   * Sets the blend equation and blend functions.
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} equation   Any allowed value for gl.blendEquation
   * @param {glEnum} srcFunc    Any allowed source function value for gl.blendFunc.
   * @param {glEnum} dstFunc    Any allowed dest function value for gl.blendFunc.
   */
  setEquation:function(gl, equation, srcFunc, dstFunc) {
    if(this._equation != equation) {
      this._equation = equation;
      gl.blendEquation(equation);
    }
    
    if(this._srcFunc != srcFunc || this._dstFunc != dstFunc) {
      this._srcFunc = srcFunc;
      this._dstFunc = dstFunc;
      
      gl.blendFunc(srcFunc, dstFunc);
    }
  },
  
  
  /** 
   * Returns the equation being used for blending.
   * @return {glEnum}
   */
  getEquation:function() {
    return this._equation;
  },
  
  
  /** 
   * Returns the source function used for blending.
   * @return {glEnum}
   */
  getSrcFunc:function() {
    return this._srcFunc;
  },
  
  
  /** 
   * Returns the dest function used for blending.
   * @return {glEnum}
   */
  getDstFunc:function() {
    return this._dstFunc;
  },
  
  
  
  /** 
   * Sets the blend color.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color
   */
  setBlendColor:function(gl, color) {
    if(this._red != color.getRed() || this._green != color.getGreen() || this._blue != color.getBlue() || this._alpha != color.getAlpha()) {
      this._red = color.getRed();
      this._green = color.getGreen();
      this._blue = color.getBlue();
      this._alpha = color.getAlpha();
      
      gl.blendColor(this._red, this._green, this._blue, this._alpha);
    }
  },
  
  
  /** 
   * Returns the blending color.
   * @return {TentaGL.Color}
   */
  getBlendColor:function() {
    var color = TentaGL.Color.RGBA(this._red, this._green, this._blue, this._alpha);
    return color;
  }
  
};