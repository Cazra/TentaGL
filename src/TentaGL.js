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
  versionMinor:9,
  
  
  //////// Canvas/Context creation
  
  
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
      var gl = canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs) || canvas.getContext("webkit-3d", attrs) || canvas.getContext("moz-webgl", attrs);
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
  
  
  
  //////// GL viewport
  
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
  
  
  //////// GL textures
  
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  },
  
  
  
  
  //////// MVP and Normal transforms
  
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
  
  
  
  //////// RenderFilter
  
  /** 
   * Returns the filter function used for rendering. 
   * If a sprite returns false for the filter, then it will not be rendered.
   * @return {function(TentaGL.Sprite)}
   */
  getRenderFilter: function() {
    return this._renderFilter;
  },
  
  /** 
   * Sets the filter function used for rendering. 
   * If a sprite returns false for the filter, then it will not be rendered.
   * @param {function(TentaGL.Sprite)}
   */
  setRenderFilter: function(filterFunc) {
    this._renderFilter = filterFunc;
  },
  
  /** 
   * Resets the render filtering function to the default filter, which returns 
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
  },
  
  
  //////// Clear
  
  /** 
   * Clears the screen buffers. 
   * @param {WebGLRenderingContext} gl
   * @param {bitwise OR of gl buffer bits} bufferBits   
   *      Optional. The bits specifying which buffers to clear.
   *      Default to gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT.
   * @param {vec4} rgba   
   *      Optional. The normalized rgba color values to clear the color buffer with. 
   */
  clear:function(gl, bufferBits, rgba) {
    if(!bufferBits) {
      bufferBits = (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    
    if(rgba && !this._clearColorLock) {
      gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    }
    
    gl.clear(bufferBits);
  },
  
  
  /** 
   * Clears the color buffer. 
   * @param {WebGLRenderingContext} gl
   * @param {vec4} rgba   Optional. The normalized rgba color values to clear
   *      the color buffer with. If not provided, it will use whatever clear
   *      color is currently being used by the GL context.
   */
  clearColorBuffer:function(gl, rgba) {
    if(rgba && !this._clearColorLock) {
      gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    }
    
    gl.clear(GL_COLOR_BUFFER_BIT);
  },
  
  
  /**
   * Clears the depth buffer.
   * @param {WebGLRenderingContext} gl   
   */
//  clearDepthBuffer:function(gl) {
//    gl.clear(gl.DEPTH_BUFFER_BIT);
//  },
  
  
  /**
   * Sets the clear color (if not already locked) and prevents it from being
   * changed until TentaGL.unlockClearColor is called.
   * @param {WebGLRenderingContext} gl
   * @param {vec4} rgba   Optional. The normalized rgba color values to 
   *      use as the locked clear color. If not specified, it will use whatever
   *      clear color is already being used by the GL context.
   */
  lockClearColor:function(gl, rgba) {
    if(rgba && !this._clearColorLock) {
      gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    }
    this._clearColorLock = true;
  },
  
  
  /** 
   * Unlocks the clear color so that it can be changed with TentaGL.clear or 
   * TentaGL.lockClearColor.
   */
  unlockClearColor:function() {
    this._clearColorLock = false;
  },
  
  
  //////// Camera
  
  /** 
   * Returns the camera that is being used to render scenes. 
   * @return {TentaGL.Camera}
   */
  getCamera:function() {
    return this._camera;
  },
  
  /** 
   * Sets the camera that is being used to render scenes. 
   * This also resets the MVP and normal transforms to the base transforms
   * provided by the camera.
   * @param {TentaGL.Camera} camera
   * @param {Number} aspect   The aspect ratio for the view.
   */
  setCamera:function(camera, aspect) {
    this._camera = camera;
    
    this.setTransform(camera.getViewTransform());
    this.setProjection(camera.getProjectionTransform(aspect));
  },
  
  
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
  return TentaGL._glTypeName[type];
};

TentaGL._glTypeName = [];
TentaGL._glTypeName[GL_BYTE]            = "BYTE";
TentaGL._glTypeName[GL_UNSIGNED_BYTE]   = "UNSIGNED_BYTE";
TentaGL._glTypeName[GL_SHORT]           = "SHORT";
TentaGL._glTypeName[GL_UNSIGNED_SHORT]  = "UNSIGNED_SHORT";
TentaGL._glTypeName[GL_INT]             = "INT";
TentaGL._glTypeName[GL_UNSIGNED_INT]    = "UNSIGNED_INT";
TentaGL._glTypeName[GL_FLOAT]           = "FLOAT";
TentaGL._glTypeName[GL_FLOAT_VEC2]      = "FLOAT_VEC2";
TentaGL._glTypeName[GL_FLOAT_VEC3]      = "FLOAT_VEC3";
TentaGL._glTypeName[GL_FLOAT_VEC4]      = "FLOAT_VEC4";
TentaGL._glTypeName[GL_INT_VEC2]        = "INT_VEC2";
TentaGL._glTypeName[GL_INT_VEC3]        = "INT_VEC3";
TentaGL._glTypeName[GL_INT_VEC4]        = "INT_VEC4";
TentaGL._glTypeName[GL_BOOL]            = "BOOL";
TentaGL._glTypeName[GL_BOOL_VEC2]       = "BOOL_VEC2";
TentaGL._glTypeName[GL_BOOL_VEC3]       = "BOOL_VEC3";
TentaGL._glTypeName[GL_BOOL_VEC4]       = "BOOL_VEC4";
TentaGL._glTypeName[GL_FLOAT_MAT2]      = "FLOAT_MAT2";
TentaGL._glTypeName[GL_FLOAT_MAT3]      = "FLOAT_MAT3";
TentaGL._glTypeName[GL_FLOAT_MAT4]      = "FLOAT_MAT4";
TentaGL._glTypeName[GL_SAMPLER_2D]      = "SAMPLER_2D";
TentaGL._glTypeName[GL_SAMPLER_CUBE]    = "SAMPLER_CUBE";

/** 
 * Returns the size of a WebGL type in units of its base type. Returns -1 if 
 * it could not be found.
 * @param {GLenum}
 * @return {int}
 */
TentaGL.glSizeUnits = function(type){
  return TentaGL._glSizeUnits[type];
};

TentaGL._glSizeUnits = [];
TentaGL._glSizeUnits[GL_BYTE]           = 1; // BYTE
TentaGL._glSizeUnits[GL_UNSIGNED_BYTE]  = 1; // UNSIGNED_BYTE
TentaGL._glSizeUnits[GL_SHORT]          = 1; // SHORT
TentaGL._glSizeUnits[GL_UNSIGNED_SHORT] = 1; // UNSIGNED_SHORT
TentaGL._glSizeUnits[GL_INT]            = 1; // INT
TentaGL._glSizeUnits[GL_UNSIGNED_INT]   = 1; // UNSIGNED_INT
TentaGL._glSizeUnits[GL_FLOAT]          = 1; // FLOAT
TentaGL._glSizeUnits[GL_FLOAT_VEC2]     = 2; // FLOAT_VEC2
TentaGL._glSizeUnits[GL_FLOAT_VEC3]     = 3; // FLOAT_VEC3
TentaGL._glSizeUnits[GL_FLOAT_VEC4]     = 4; // FLOAT_VEC4
TentaGL._glSizeUnits[GL_INT_VEC2]       = 2; // INT_VEC2
TentaGL._glSizeUnits[GL_INT_VEC3]       = 3; // INT_VEC3
TentaGL._glSizeUnits[GL_INT_VEC4]       = 4; // INT_VEC4
TentaGL._glSizeUnits[GL_BOOL]           = 1; // BOOL
TentaGL._glSizeUnits[GL_BOOL_VEC2]      = 2; // BOOL_VEC2
TentaGL._glSizeUnits[GL_BOOL_VEC3]      = 3; // BOOL_VEC3
TentaGL._glSizeUnits[GL_BOOL_VEC4]      = 4; // BOOL_VEC4
TentaGL._glSizeUnits[GL_FLOAT_MAT2]     = 4; // FLOAT_MAT2
TentaGL._glSizeUnits[GL_FLOAT_MAT3]     = 9; // FLOAT_MAT3
TentaGL._glSizeUnits[GL_FLOAT_MAT4]     = 16; // FLOAT_MAT4


/** 
 * Returns the size of a WebGL type in bytes. Returns -1 if 
 * it could not be found.
 * @param {GLenum}
 * @return {int}
 */
TentaGL.glSizeBytes = function(type){
  var units = TentaGL.glSizeUnits(type);
  type = TentaGL.glUnitType(type);
  return units*TentaGL._glSizeBytes[type];
};

TentaGL._glSizeBytes = [];
TentaGL._glSizeBytes[GL_BYTE]           = 1;
TentaGL._glSizeBytes[GL_UNSIGNED_BYTE]  = 1;
TentaGL._glSizeBytes[GL_SHORT]          = 2;
TentaGL._glSizeBytes[GL_UNSIGNED_SHORT] = 2;
TentaGL._glSizeBytes[GL_INT]            = 4;
TentaGL._glSizeBytes[GL_UNSIGNED_INT]   = 4;
TentaGL._glSizeBytes[GL_FLOAT]          = 4;
TentaGL._glSizeBytes[GL_BOOL]           = 4;



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
TentaGL._glUnitTypes[GL_BYTE]           = GL_BYTE;
TentaGL._glUnitTypes[GL_UNSIGNED_BYTE]  = GL_UNSIGNED_BYTE;
TentaGL._glUnitTypes[GL_SHORT]          = GL_SHORT;
TentaGL._glUnitTypes[GL_UNSIGNED_SHORT] = GL_UNSIGNED_SHORT;
TentaGL._glUnitTypes[GL_INT]            = GL_INT;
TentaGL._glUnitTypes[GL_UNSIGNED_INT]   = GL_UNSIGNED_INT;
TentaGL._glUnitTypes[GL_FLOAT]          = GL_FLOAT;
TentaGL._glUnitTypes[GL_FLOAT_VEC2]     = GL_FLOAT;
TentaGL._glUnitTypes[GL_FLOAT_VEC3]     = GL_FLOAT;
TentaGL._glUnitTypes[GL_FLOAT_VEC4]     = GL_FLOAT;
TentaGL._glUnitTypes[GL_INT_VEC2]       = GL_INT;
TentaGL._glUnitTypes[GL_INT_VEC3]       = GL_INT;
TentaGL._glUnitTypes[GL_INT_VEC4]       = GL_INT;
TentaGL._glUnitTypes[GL_BOOL]           = GL_BOOL;
TentaGL._glUnitTypes[GL_BOOL_VEC2]      = GL_BOOL;
TentaGL._glUnitTypes[GL_BOOL_VEC3]      = GL_BOOL;
TentaGL._glUnitTypes[GL_BOOL_VEC4]      = GL_BOOL;
TentaGL._glUnitTypes[GL_FLOAT_MAT2]     = GL_FLOAT;
TentaGL._glUnitTypes[GL_FLOAT_MAT3]     = GL_FLOAT;
TentaGL._glUnitTypes[GL_FLOAT_MAT4]     = GL_FLOAT;



/*
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

TentaGL.GL_POINTS = 0;
TentaGL.GL_LINES = 1;
TentaGL.GL_TRIANGLES = 4;

TentaGL.GL_NONE = 0;
TentaGL.GL_FRONT = 0x0404;
TentaGL.GL_BACK = 0x0405;
TentaGL.GL_FRONT_AND_BACK = 0x0408;
*/

//TentaGL.mat3Recyclable = mat3.create();
//TentaGL.mat4Recyclable = mat4.create();

