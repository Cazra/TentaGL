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
  versionMinor:1,
  
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
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.viewWidth = canvas.width;
      gl.viewHeight = canvas.height;
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
  }
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
  switch(type) {
    case 0x1400: // "BYTE"
      return 0x1400;
    case 0x1401: // "UNSIGNED_BYTE"
      return 0x1401;
    case 0x1402: // "SHORT"
      return 0x1402;
    case 0x1403: // "UNSIGNED_SHORT"
      return 0x1403;
    case 0x1404: // "INT"
      return 0x1404;
    case 0x1405: // "UNSIGNED_INT"
      return 0x1405;
    case 0x1406: // "FLOAT"
      return 0x1406;
    case 0x8B50: // "FLOAT_VEC2"
      return 0x1406;
    case 0x8B51: // "FLOAT_VEC3"
      return 0x1406;
    case 0x8B52: // "FLOAT_VEC4"
      return 0x1406;
    case 0x8B53: // "INT_VEC2"
      return 0x1404;
    case 0x8B54: // "INT_VEC3"
      return 0x1404;
    case 0x8B55: // "INT_VEC4"
      return 0x1404;
    case 0x8B56: // "BOOL" - bools have the same size as a uint: 32-bits.
      return 0x8B56;
    case 0x8B57: // "BOOL_VEC2"
      return 0x8B56;
    case 0x8B58: // "BOOL_VEC3"
      return 0x8B56;
    case 0x8B59: // "BOOL_VEC4"
      return 0x8B56;
    case 0x8B5A: // "FLOAT_MAT2"
      return 0x1406;
    case 0x8B5B: // "FLOAT_MAT3"
      return 0x1406;
    case 0x8B5C: // "FLOAT_MAT4"
      return 0x1406;
    default:
      return -1;
  }
};



TentaGL.GL_BYTE = 0x1400;
TentaGL.GL_SHORT = 0x1402;
TentaGL.GL_INT = 0x1404;
TentaGL.GL_FLOAT = 0x1406;
