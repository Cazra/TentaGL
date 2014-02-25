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
 * An encapsulation of  GL alpha blending state. 
 * These are managed by the BlendStateLib library object.
 * @constructor
 * @param {Boolean} enableBlend   Whether this state enables GL alpha blending.
 *      Default false.
 * @param {Booleam} enableDepth   Whether this state enables the depth test.
 *      Default true.
 */
TentaGL.BlendState = function(enableBlend, enableDepth) {
  enableBlend = enableBlend || false;
  if(enabledDepth === undefined) {
    enableDepth = true;
  }
  
  this._enableBlend = enableBlend;
  this._enableDepth = enableDepth;
  
  this._blendColor = new TentaGL.Color.RGBA(0,0,0,0);
  this._equation = TentaGL.GL_FUNC_ADD;
  
  this._funcSrc = TentaGL.GL_ONE;
  this._funcDst = TentaGL.GL_ZERO;
};


TentaGL.BlendState.prototype = {
  
  constructor:TentaGL.BlendState,
  
  
  //////// Enable blending
  
  /** 
   * Returns whether this BlendState enables alpha blending.
   * @return {Boolean}
   */
  isBlendEnabled:function() {
    return this._enableBlend;
  },
  
  
  /** 
   * Sets whether this BlendState enables alpha blending.
   * @param {Boolean} enable
   */
  setBlendEnabled:function(enable) {
    this._enableBlend = enable;
  },
  
  
  //////// Enable depth test
  
  /** 
   * Returns whether this BlendState enables the depth test.
   * @return {Boolean}
   */
  isDepthEnabled:function() {
    return this._enableDepth;
  },
  
  
  /** 
   * Sets whether this BlendState enables the depth test. 
   * @param {Boolean} enable
   */
  setDepthEnabled:function(enable) {
    this._enableDepth = enable;
  },
  
  
  //////// Blending equations
  
  /**
   * Returns the GL constant for the RGBA blending equation  
   * used by this BlendState.
   * @return {GLenum}
   */
  getEquation:function() {
    return this._equation;
  },
  
  /** 
   * Sets the RGBA blending equation used by this BlendState.
   * @param {GLenum} eq
   */
  setEquation:function(eq) {
    this._equation = eq;
  },

  
  
  //////// Blending functions
  
  
  /**
   * Sets the source and destination pixel arithmetic functions 
   * used by this BlendState.
   * @param {GLenum} funcSrc    Source pixel function.
   * @param {GLenum} funcDst    Destination pixel function.
   */
  setFuncs:function(funcSrc, funcDst) {
    this._funcSrc = funcSrc;
    this._funcDst = funcDst;
  },
  
  
  /** 
   * Returns the GL constant for the source pixel arithmetic function 
   * used by this BlendState. 
   * @return {GLenum}
   */
  getFuncSrc:function() {
    return this._funcSrc;
  },
  
  
  /** 
   * Sets the source pixel arithmetic function used by this BlendState. 
   * @param {GLenum} func
   */
  setFuncSrc:function(func) {
    this._funcSrc = func;
  },
  
  
  
  /** 
   * Returns the GL constant for the destination pixel arithmetic function
   * used by this BlendState.
   * @return {GLenum}
   */
  getFuncDst:function() {
    return this._funcDst;
  },
  
  
  /**
   * Sets the destination pixel arithmetic function used by this BlendState.
   * @param {GLenum} func
   */
  setFuncDst:function(func) {
    this._funcDst = func;
  },
  
  
  //////// GL state
  
  /** Sets the WebGL context to use this BlendState. */
  useMe:function(gl) {
    if(this._enableBlend) {
      gl.enable(gl.BLEND);
    }
    else {
      gl.disable(gl.BLEND);
    }
    
    if(this._enableDepth) {
      gl.enable(gl.DEPTH_TEST);
    }
    else {
      gl.disable(gl.DEPTH_TEST);
    }

    gl.blendColor(this._blendColor.getRed(), this._blendColor.getGreen(), this._blendColor.getBlue(), this._blendColor.getAlpha());
    gl.blendEquation(this._equation);
    gl.blendFunc(this._funcSrc, this._funcDst);
  }
  
};


