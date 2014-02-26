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
  * The singleton root object for TentaGL. All other object types in TentaGL
  * are accessed through this.
  * It also has some utilities for creating the GL context and modifying
  * some custom properties of it that TentaGL uses.
  */
var TentaGL = { 
  
  /** The major version number of this framework. */
  versionMajor:0, 
  
  /** The minor version number of this framework. */
  versionMinor:3,
  
  /** 
   * Initializes and returns a WebGL context for a canvas element.
   * @param {DOM Canvas element} canvas  The canvas element we're making a 
   *      WebGL context for.
   * @param {WebGLContextAttributes} attrs   Optional. attributes used to get  
   *    the WebGL context. If not provided, the default values for the
   *     WebGLContextAttributes will be used. 
   *    See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2
   * @return {WebGLRenderingContext }  The WebGL rendering context.
   */
  createGL: function(canvas, attrs) {
    attrs = attrs || {};
    
    // An Error will be thrown if the user's browser doesn't support WebGL.
    try {
      
      // Create the WebGL context for the canvas.
      var gl = canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs);
      TentaGL.setViewport(gl, [0, 0, canvas.width, canvas.height]);
      TentaGL.resetProjection();
      TentaGL.resetTransform();
      this._normalTrans = mat3.create();
      this._mvpTrans = mat4.create();
      return gl;
    }
    catch(e) {
      var msg = "Error creating WebGL context: " + e.toString();
      throw Error(msg);
    }
  },
  
  
  /** 
   * Produces a Canvas element and adds it to a div container. 
   * The canvas's dimensions are the same as its container's.
   * @param {DOM div element} container
   * @return {DOM canvas element}
   */
  createCanvas: function(container) {
    var canvas = document.createElement("canvas");
    container.appendChild(canvas);
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    return canvas;
  },
  
  
  /** 
   * Returns the rectangle data describing the GL context's current viewport.
   * @param {WebGLRenderingContext} gl
   * @return {length-4 int array} Contains the viewport metrics: 
   *      x, y, width, and height in that order.
   */
  getViewport:function(gl) {
    return [gl.viewX, gl.viewY, gl.viewWidth, gl.viewHeight];
  },
  
  
  /** 
   * Sets the rectangular viewport area for the GL context. 
   * @param {WebGLRenderingContext} gl
   * @param {length-4 int array} xywh   An array containing in-order the new 
   *      viewport rectangle's x, y, width, and height.
   */
  setViewport: function(gl, xywh) {
    gl.viewX = xywh[0];
    gl.viewY = xywh[1];
    gl.viewWidth = xywh[2];
    gl.viewHeight = xywh[3];
    gl.viewport(xywh[0], xywh[1], xywh[2], xywh[3]);
  },
  
  
  /** 
   * Creates an off-screen depth buffer.
   * @param {WebGLRenderingContext} gl
   * @param {int} width
   * @param {int} height
   * @return {WebGLRenderbuffer}
   */
  createDepthbuffer: function(gl, width, height) {
    var buffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    return buffer;
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
   * Creates an initially empty texture in GL memory. By default, this texture 
   * Displays as solid red and has its min-mag filters set to gl.NEAREST.
   * @param {WebGLRenderingContext} gl
   * @param {Uint8Array} data   Optional. RGBA array of pixel data. This is
   *      allowed to be null, in which case the resulting appearance will be
   *      undefined (Displays white for me). Defaults to null.
   * @param {int} width   Optional. Width of the texture. Defaults to 1.
   * @param {int} height  Optional. Height of the texture. Defaults to 1.
   * @return {WebGLTexture}
   */
  createTexture: function(gl, data, width, height) {
    data = data || null;
    width = width || 1;
    height = height || 1;
    
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    // Use gl.NEAREST by default for min-mag filters.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return tex;
  },
  
  
  
  
  /** 
   * Sets the model-view transform matrix.
   * @param {mat4} trans  The new model-view transform matrix.
   */
  setTransform: function(trans) {
    this._modelViewTrans = trans;
  },
  
  
  /** 
   * Multiplies the model-view transform matrix (M) by another matrix (T) so 
   * that the result is M = M x T.
   * @param {mat4} trans
   */
  mulTransform: function(trans) {
    mat4.mul(this._modelViewTrans, this._modelViewTrans, trans);
  },
  
  
  /** 
   * Multiplies the model-view transform matrix (M) by another matrix (T) so 
   * that the result is M = T x M.
   * @param {mat4} trans
   */
  premulTransform: function(trans) {
    mat4.mul(this._modelViewTrans, trans, this._modelViewTrans);
  },
  
  
  /** 
   * Saves the current model-view transform matrix onto the transform stack. 
   */
  pushTransform: function() {
    this._transformStack.push(mat4.clone(this._modelViewTrans));
  },
  
  /**
   * Restores the current model-view transform matrix from the transform stack.
   */
  popTransform: function() {
    this._modelViewTrans = this._transformStack.pop();
  },
  
  /** 
   * Resets the model-view transform matrix to the identity matrix and empties
   * the transform stack.
   */
  resetTransform: function() {
    this.setTransform(mat4.create());
    this._transformStack = [];
  },
  
  
  /** 
   * Sets the projection transform matrix.
   * @param {mat4} trans  The new projection matrix.
   */
  setProjection: function(trans) {
    this._projTrans = trans;
  },
  
  
  /** 
   * Multiplies the projection transform matrix (M) by another matrix (T) so 
   * that the result is M = M x T.
   * @param {mat4} trans
   */
  mulProjection: function(trans) {
    mat4.mul(this._projTrans, this._projTrans, trans);
  },
  
  
  /** 
   * Multiplies the projection transform matrix (M) by another matrix (T) so 
   * that the result is M = T x M.
   * @param {mat4} trans
   */
  premulProjection: function(trans) {
    mat4.mul(this._projTrans, trans, this._projTrans);
  },
  
  
 /** 
  * Resets the projection transform matrix to the identity matrix.
  */
  resetProjection: function() {
    this.setProjection(mat4.create());
  },
  
  
  /** 
   * Updates the MVP and normal transform matrix uniform variables in the 
   * currently bound shader program, using the current projection and 
   * model-view matrices.
   * @param {WebGLRenderingContext} gl
   */
  updateMVPUniforms: function(gl) {
    mat3.normalFromMat4(this._normalTrans, this._modelViewTrans);
    TentaGL.ShaderLib.current(gl).setNormalTransUniValue(gl, this._normalTrans);
    
    mat4.mul(this._mvpTrans, this._projTrans, this._modelViewTrans);
    TentaGL.ShaderLib.current(gl).setMVPTransUniValue(gl, this._mvpTrans);
  },
  
  
  
  /** 
   * Returns the filter function used for rendering. 
   * @return {function(TentaGL.Sprite)}
   */
  getRenderFilter: function() {
    return this._renderFilter;
  },
  
  /** 
   * Sets the filter function used for rendering. 
   * @param {function(TentaGL.Sprite)}
   */
  setRenderFilter: function(filterFunc) {
    this._renderFilter = filterFunc;
  },
  
  /** 
   * Resets the render filtering function to undefined, so renderFilter returns
   * true for all sprites.
   */
  resetRenderFilter: function() {
    this._renderFilter = TentaGL._defaultRenderFilter;
  },
  
  /** 
   * Filters out which sprites are renderable.
   * If this function returns false for a sprite, then that sprite will 
   * not be rendered. 
   * @param {TentaGL.Sprite} sprite
   * @param {Boolean}
   */
  renderFilter:function(sprite) {
    return (!this._renderFilter || this._renderFilter(sprite));
  }
};


/** Returns true for all sprites. */
TentaGL._defaultRenderFilter = function(sprite) {
  return true;
};


/** 
 * Returns the string representation of a WebGL constant representing 
 * some data type or uniform variable type. Returns "" if it could not
 * be found.
 * @param {GLenum}
 * @return {string}
 */
TentaGL.glTypeName = function(type){
  switch(type) {
    case 0x1400:
      return "BYTE";
    case 0x1401:
      return "UNSIGNED_BYTE";
    case 0x1402:
      return "SHORT";
    case 0x1403:
      return "UNSIGNED_SHORT";
    case 0x1404:
      return "INT";
    case 0x1405:
      return "UNSIGNED_INT";
    case 0x1406:
      return "FLOAT";
    case 0x8B50:
      return "FLOAT_VEC2";
    case 0x8B51:
      return "FLOAT_VEC3";
    case 0x8B52:
      return "FLOAT_VEC4";
    case 0x8B53:
      return "INT_VEC2";
    case 0x8B54:
      return "INT_VEC3";
    case 0x8B55:
      return "INT_VEC4";
    case 0x8B56:
      return "BOOL";
    case 0x8B57:
      return "BOOL_VEC2";
    case 0x8B58:
      return "BOOL_VEC3";
    case 0x8B59:
      return "BOOL_VEC4";
    case 0x8B5A:
      return "FLOAT_MAT2";
    case 0x8B5B:
      return "FLOAT_MAT3";
    case 0x8B5C:
      return "FLOAT_MAT4";
    case 0x8B5E:
      return "SAMPLER_2D";
    case 0x8B60:
      return "SAMPLER_CUBE";
    default:
      return "";
  }
};



/** 
 * Returns the size of a WebGL type in units of its base type. Returns -1 if 
 * it could not be found.
 * @param {GLenum}
 * @return {int}
 */
TentaGL.glSizeUnits = function(type){
  switch(type) {
    case 0x1400: // "BYTE"
      return 1;
    case 0x1401: // "UNSIGNED_BYTE"
      return 1;
    case 0x1402: // "SHORT"
      return 1;
    case 0x1403: // "UNSIGNED_SHORT"
      return 1;
    case 0x1404: // "INT"
      return 1;
    case 0x1405: // "UNSIGNED_INT"
      return 1;
    case 0x1406: // "FLOAT"
      return 1;
    case 0x8B50: // "FLOAT_VEC2"
      return 2;
    case 0x8B51: // "FLOAT_VEC3"
      return 3;
    case 0x8B52: // "FLOAT_VEC4"
      return 4;
    case 0x8B53: // "INT_VEC2"
      return 2;
    case 0x8B54: // "INT_VEC3"
      return 3;
    case 0x8B55: // "INT_VEC4"
      return 4;
    case 0x8B56: // "BOOL"
      return 1;
    case 0x8B57: // "BOOL_VEC2"
      return 2;
    case 0x8B58: // "BOOL_VEC3"
      return 3;
    case 0x8B59: // "BOOL_VEC4"
      return 4;
    case 0x8B5A: // "FLOAT_MAT2"
      return 4;
    case 0x8B5B: // "FLOAT_MAT3"
      return 9;
    case 0x8B5C: // "FLOAT_MAT4"
      return 16;
    default:
      return -1;
  }
};



/** 
 * Returns the size of a WebGL type in bytes. Returns -1 if 
 * it could not be found.
 * @param {GLenum}
 * @return {int}
 */
TentaGL.glSizeBytes = function(type){
  var units = TentaGL.glSizeUnits(type);
  switch(type) {
    case 0x1400: // "BYTE"
      return units*1;
    case 0x1401: // "UNSIGNED_BYTE"
      return units*1;
    case 0x1402: // "SHORT"
      return units*2;
    case 0x1403: // "UNSIGNED_SHORT"
      return units*2;
    case 0x1404: // "INT"
      return units*4;
    case 0x1405: // "UNSIGNED_INT"
      return units*4;
    case 0x1406: // "FLOAT"
      return units*4;
    case 0x8B50: // "FLOAT_VEC2"
      return units*4;
    case 0x8B51: // "FLOAT_VEC3"
      return units*4;
    case 0x8B52: // "FLOAT_VEC4"
      return units*4;
    case 0x8B53: // "INT_VEC2"
      return units*4;
    case 0x8B54: // "INT_VEC3"
      return units*4;
    case 0x8B55: // "INT_VEC4"
      return units*4;
    case 0x8B56: // "BOOL" - bools have the same size as a uint: 32-bits.
      return units*4;
    case 0x8B57: // "BOOL_VEC2"
      return units*4;
    case 0x8B58: // "BOOL_VEC3"
      return units*4;
    case 0x8B59: // "BOOL_VEC4"
      return units*4;
    case 0x8B5A: // "FLOAT_MAT2"
      return units*4;
    case 0x8B5B: // "FLOAT_MAT3"
      return units*4;
    case 0x8B5C: // "FLOAT_MAT4"
      return units*4;
    default:
      return -1;
  }
};



/** 
 * Returns the unit GL type of the given GL type. For example, the unit type
 * of FLOAT_VEC3 would be FLOAT.
 * Returns -1 if the type is not recognized.
 * @param {GLenum}
 * @return {GLenum}
 */
TentaGL.glUnitType = function(type){
  return TentaGL._glUnitTypes[type];
};

TentaGL._glUnitTypes = [];
TentaGL._glUnitTypes[0x1400] = 0x1400; // BYTE
TentaGL._glUnitTypes[0x1401] = 0x1401; // UNSIGNED_BYTE
TentaGL._glUnitTypes[0x1402] = 0x1402; // SHORT
TentaGL._glUnitTypes[0x1403] = 0x1403; // UNSIGNED_SHORT
TentaGL._glUnitTypes[0x1404] = 0x1404; // INT
TentaGL._glUnitTypes[0x1405] = 0x1405; // UNSIGNED_INT
TentaGL._glUnitTypes[0x1406] = 0x1406; // FLOAT
TentaGL._glUnitTypes[0x8B50] = 0x1406; // FLOAT_VEC2
TentaGL._glUnitTypes[0x8B51] = 0x1406; // FLOAT_VEC3
TentaGL._glUnitTypes[0x8B52] = 0x1406; // FLOAT_VEC4
TentaGL._glUnitTypes[0x8B53] = 0x1404; // INT_VEC2
TentaGL._glUnitTypes[0x8B54] = 0x1404; // INT_VEC3
TentaGL._glUnitTypes[0x8B55] = 0x1404; // INT_VEC4
TentaGL._glUnitTypes[0x8B56] = 0x8B56; // BOOL - bools have the same size as a uint: 32-bits.
TentaGL._glUnitTypes[0x8B57] = 0x8B56; // BOOL_VEC2
TentaGL._glUnitTypes[0x8B58] = 0x8B56; // BOOL_VEC3
TentaGL._glUnitTypes[0x8B59] = 0x8B56; // BOOL_VEC4
TentaGL._glUnitTypes[0x8B5A] = 0x1406; // FLOAT_MAT2
TentaGL._glUnitTypes[0x8B5B] = 0x1406; // FLOAT_MAT3
TentaGL._glUnitTypes[0x8B5C] = 0x1406; // FLOAT_MAT4




TentaGL.GL_BYTE = 0x1400;
TentaGL.GL_UNSIGNED_BYTE = 0x1401;
TentaGL.GL_SHORT = 0x1402;
TentaGL.GL_UNSIGNED_SHORT = 0x1403;
TentaGL.GL_INT = 0x1404;
TentaGL.GL_UNSIGNED_INT = 0x1405;
TentaGL.GL_FLOAT = 0x1406;
TentaGL.GL_FLOAT_VEC2 = 0x8B50;
TentaGL.GL_FLOAT_VEC3 = 0x8B51;
TentaGL.GL_FLOAT_VEC4 = 0x8B52;
TentaGL.GL_INT_VEC2 = 0x8B53;
TentaGL.GL_INT_VEC3 = 0x8B54;
TentaGL.GL_INT_VEC4 = 0x8B55;
TentaGL.GL_BOOL = 0x8B56;
TentaGL.GL_BOOL_VEC2 = 0x8B57;
TentaGL.GL_BOOL_VEC3 = 0x8B58;
TentaGL.GL_BOOL_VEC4 = 0x8B59;
TentaGL.GL_FLOAT_MAT2 = 0x8B5A;
TentaGL.GL_FLOAT_MAT3 = 0x8B5B;
TentaGL.GL_FLOAT_MAT4 = 0x8B5C;
TentaGL.GL_SAMPLER_2D = 0x8B5E;
TentaGL.GL_SAMPLER_CUBE = 0x8B60;

TentaGL.GL_FUNC_ADD = 0x8006;
TentaGL.GL_FUNC_SUBTRACT = 0x800A;
TentaGL.GL_FUNC_REVERSE_SUBTRACT = 0x800B;

TentaGL.GL_ONE = 1;
TentaGL.GL_ZERO = 0;
TentaGL.GL_SRC_ALPHA = 0x0302;
TentaGL.GL_ONE_MINUS_SRC_ALPHA = 0x0303;



TentaGL.mat3Recyclable = mat3.create();
TentaGL.mat4Recyclable = mat4.create();

