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
  * The TentaGL namespace.
  * It also has some utilities for getting metadata about GL data types.
  *
  * Dependencies:
  * The only library dependancy TentaGL has is the glMatrix 2.0 library, used 
  * for doing vector and matrix math in typed arrays. A minimized js file of the
  * library is included with the examples, but is not guaranteed to be the most
  * up to date version. 
  * glMatrix can be found here: http://glmatrix.net/
  */
var TentaGL = { 
  
  /** The major version number of this framework. */
  versionMajor:0, 
  
  /** The minor version number of this framework. */
  versionMinor:19,
  
  
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
    attrs = attrs || {alpha: false};
    
    // An Error will be thrown if the user's browser doesn't support WebGL.
    try {
      
      // Create the WebGL context for the canvas.
      var gl = canvas.getContext("webgl", attrs) || canvas.getContext("experimental-webgl", attrs) || canvas.getContext("webkit-3d", attrs) || canvas.getContext("moz-webgl", attrs);
      
      // Initialize its state data.
      TentaGL.Blend.reset(gl);
      TentaGL.Cull.reset(gl);
      TentaGL.DepthBuffer.reset(gl);
      TentaGL.Scissor.reset(gl);
      TentaGL.Stencil.reset(gl);
      TentaGL.Viewport.reset(gl);
      TentaGL.ViewTrans.reset(gl);
      this._normalTrans = mat3.create();
      this._mvpTrans = mat4.create();
      
      return gl;
    }
    catch(e) {
      var msg = "Error creating WebGL context: " + e.toString();
      throw new Error(msg);
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
  

  
  //////// Clear
  
  /** 
   * Clears the color and depth buffers. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Color} color   Optional. The clear color to use.
   */
  clear:function(gl, color) {
    TentaGL.ColorBuffer.setClearColor(gl, color);
    gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  },
  
  
  //////// WebGL type metadata
  
  
  /** 
   * Returns the string representation of a WebGL constant representing 
   * some data type or uniform variable type. 
   * @param {GLenum}
   * @return {string}
   */
  glTypeName: function(type) {
    return TentaGL._glTypeName[type];
  },
  
  
  
  /** 
   * Returns the size of a WebGL type in units of its base type.
   * @param {GLenum}
   * @return {int}
   */
  glSizeUnits: function(type){
    return TentaGL._glSizeUnits[type];
  },
  
  
  
  /** 
   * Returns the size of a WebGL type in bytes.
   * @param {GLenum}
   * @return {int}
   */
  glSizeBytes: function(type){
    var units = TentaGL.glSizeUnits(type);
    type = TentaGL.glUnitType(type);
    return units*TentaGL._glSizeBytes[type];
  },
  
  
  
  /** 
   * Returns the unit GL type of the given GL type. For example, the unit type
   * of FLOAT_VEC3 would be FLOAT.
   * @param {GLenum}
   * @return {GLenum}
   */
  glUnitType: function(type){
    return TentaGL._glUnitTypes[type];
  }
};


/** Returns true for all sprites. */
TentaGL._defaultRenderFilter = function(sprite) {
  return true;
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


TentaGL._glSizeUnits = [];
TentaGL._glSizeUnits[GL_BYTE]           = 1; 
TentaGL._glSizeUnits[GL_UNSIGNED_BYTE]  = 1; 
TentaGL._glSizeUnits[GL_SHORT]          = 1; 
TentaGL._glSizeUnits[GL_UNSIGNED_SHORT] = 1;
TentaGL._glSizeUnits[GL_INT]            = 1; 
TentaGL._glSizeUnits[GL_UNSIGNED_INT]   = 1; 
TentaGL._glSizeUnits[GL_FLOAT]          = 1; 
TentaGL._glSizeUnits[GL_FLOAT_VEC2]     = 2; 
TentaGL._glSizeUnits[GL_FLOAT_VEC3]     = 3; 
TentaGL._glSizeUnits[GL_FLOAT_VEC4]     = 4; 
TentaGL._glSizeUnits[GL_INT_VEC2]       = 2;
TentaGL._glSizeUnits[GL_INT_VEC3]       = 3; 
TentaGL._glSizeUnits[GL_INT_VEC4]       = 4; 
TentaGL._glSizeUnits[GL_BOOL]           = 1; 
TentaGL._glSizeUnits[GL_BOOL_VEC2]      = 2; 
TentaGL._glSizeUnits[GL_BOOL_VEC3]      = 3; 
TentaGL._glSizeUnits[GL_BOOL_VEC4]      = 4;
TentaGL._glSizeUnits[GL_FLOAT_MAT2]     = 4; 
TentaGL._glSizeUnits[GL_FLOAT_MAT3]     = 9;
TentaGL._glSizeUnits[GL_FLOAT_MAT4]     = 16; 


TentaGL._glSizeBytes = [];
TentaGL._glSizeBytes[GL_BYTE]           = 1;
TentaGL._glSizeBytes[GL_UNSIGNED_BYTE]  = 1;
TentaGL._glSizeBytes[GL_SHORT]          = 2;
TentaGL._glSizeBytes[GL_UNSIGNED_SHORT] = 2;
TentaGL._glSizeBytes[GL_INT]            = 4;
TentaGL._glSizeBytes[GL_UNSIGNED_INT]   = 4;
TentaGL._glSizeBytes[GL_FLOAT]          = 4;
TentaGL._glSizeBytes[GL_BOOL]           = 4;


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


