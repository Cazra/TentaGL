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
 * A camera for rendering in a classic 2D space, where the upper-left corner is
 * at (0,0), positive X is right, and positive Y is down.
 * Because this camera is meant for 2D rendering, there is no transform for
 * perspective. However, it does have the ability to pan in the XY plane, 
 * zoom in and out of the scene, and rotate the scene around the Z axis.
 * @constructor
 * @param {vec2} eye  The position of the camera's eye in world coordinates. 
 *      By default, the eye's screen location is in the center of the viewport.
 * @param {uint} width    The pixel width of the camera's resolution.
 * @param {uint} height   The pixel height of the camera's resolution.
 */
TentaGL.Camera2D = function(eye, width, height) {
  var ex = eye[0];
  var ey = eye[1];
  this._eye = vec2.fromValues(ex, ey);
  
  this._width = width;
  this._height = height;
  
  this._center = vec2.fromValues(Math.floor(this._width/2), Math.floor(this._height/2));
  
  this._angle = 0.0;
  this._scale = 1.0;
};


TentaGL.Camera2D.prototype = {
  
  constructor: TentaGL.Camera2D,
  
  
  //////// Eye position
  
  /** 
   * Returns the position of the camera's eye in world space.
   * @return {vec2}
   */
  getEye:function() {
    return vec2.clone(this._eye);
  },
  
  
  /**
   * Sets the position of the camera's eye in world space.
   * @param {vec2} eye
   */
  setEye:function(eye) {
    this._eye = vec2.fromValues(eye[0], eye[1]);
  },
  
  
  //////// View resolution
  
  /** 
   * Returns the width (in pixels) of the camera's resolution. 
   * @return {uint}
   */
  getWidth:function() {
    return this._width;
  },
  
  
  /** 
   * Returns the height (in pixels of the camera's resolution.
   * @return {uint}
   */
  getHeight:function() {
    return this._height;
  },
  
};


TentaGL.Inheritance.inherit(TentaGL.Camera2D, TentaGL.Camera);

