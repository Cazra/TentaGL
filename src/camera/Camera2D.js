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
 * @param {boolean} yFlipped  Whether the positive y-axis is in the down direction. Default true.
 */
TentaGL.Camera2D = function(eye, width, height, yFlipped) {
  if(yFlipped == undefined) {
    yFlipped = true;
  }
  this._yFlipped = yFlipped;
  
  var ex = eye[0];
  var ey = eye[1];
  this._eye = vec2.fromValues(ex, ey);
  
  this._width = width;
  this._height = height;
  
  // By default, the anchor is located in the center of the viewport.
  this._anchor = vec2.fromValues(Math.floor(this._width/2), Math.floor(this._height/2));
  
  this._angle = 0.0;
  this._zoom = 1.0;
};


TentaGL.Camera2D.prototype = {
  
  constructor: TentaGL.Camera2D,
  
  
  //////// Eye position
  
  /** 
   * Returns the position of the camera's eye. This is camera's position in world space.
   * @return {vec2}
   */
  getEye:function() {
    return vec2.clone(this._eye);
  },
  
  
  /** 
   * Returns the X coordinate of the camera's eye. 
   * @return {Number}
   */
  getX:function() {
    return this._eye[0];
  },
  
  /** 
   * Returns the Y coordinate of the camera's eye. 
   * @return {Number}
   */
  getY:function() {
    return this._eye[1];
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
  
  //////// Anchor position
  
  /** 
   * Returns the camera's anchor position - the position of its eye in 
   * viewport coordinates. 
   * @return {vec2}
   */
  getAnchor:function() {
    return this._anchor;
  },
  
  
  /** 
   * Sets the camera's anchor position. 
   * @param {vec2} anchor
   */
  setAnchor:function(anchor) {
    this._anchor = vec2.fromValues(anchor[0], anchor[1]);
  },
  
  
  /** 
   * Sets the camera's anchor position such that the camera's transform is 
   * unchanged. I.E., the camera appears to be at the same position.
   * @param {vec2} anchor
   */
  moveAnchor: function(anchor) {
    var df = [anchor[0] - this._anchor[0], anchor[1] - this._anchor[1]];
    
    var rsTransInv = mat4.invert(mat4.create(), this._getRotateScaleTransform());
    dfWorld = vec2.transformMat4(vec2.create(), df, rsTransInv);
    
    this._eye[0] += dfWorld[0];
    this._eye[1] += dfWorld[1];
    
    this._anchor[0] = anchor[0];
    this._anchor[1] = anchor[1];
  },
  
  
  //////// Angle
  
  
  /** 
   * Returns the clockwise rotation angle of the camera, in radians. 
   * @return {Number}
   */
  getAngle:function() {
    return this._angle;
  },
  
  
  /** 
   * Sets the camera's clockwise rotation angle, in radians.
   * @param {Number} rads
   */
  setAngle:function(rads) {
    this._angle = rads;
  },
  
  
  
  //////// Zoom
  
  /** 
   * Returns the zoom of the camera.
   * @return {Number}
   */
  getZoom:function() {
    return this._zoom;
  },
  
  /** 
   * Sets the zoom of the camera. 
   * The default zoom level is 1.0.
   * The scene zooms in as zoom approaches positive infinity.
   * The scene zooms out as zoom approaches 0.
   * @param {Number} zoom
   */
  setZoom:function(zoom) {
    this._zoom = zoom;
  },
  
  
  //////// controls
  
  
  
  controlWithMouse:function(mouse, viewWidth, viewHeight) {
    var mouseX = mouse.getX()*this.getWidth()/viewWidth;
    var mouseY = mouse.getY()*this.getHeight()/viewHeight;
    if(!this._yFlipped) {
      mouseY = this.getHeight() - mouseY;
    }
    
    // Zoom in by scrolling the mouse wheel up.
    if(mouse.scrollUpAmount() > 0) {
      this.moveAnchor([mouseX, mouseY]);
      for(var i = 0; i < mouse.scrollUpAmount(); i++) {
        this.setZoom(this.getZoom() * 10/9);
      }
    }
    
    // Zoom out by scrolling the mouse wheel down.
    if(mouse.scrollDownAmount() > 0) {
      this.moveAnchor([mouseX, mouseY]);
      for(var i = 0; i < mouse.scrollDownAmount(); i++) {
        this.setZoom(this.getZoom() * 9/10);
      }
    }
    
    // Pan the camera by left-dragging the mouse.
    if(mouse.isLeftPressed()) {
      this.drag(mouse.getXY(), viewWidth, viewHeight);
    }
    if(mouse.justLeftReleased()) {
      this.endDrag();
    }
  },
  
  
  /** 
   * Pans the camera with a dragging motion. 
   * @param {vec2} screenPt   The point of the thing dragging the camera, in 
   *      screen coordinates. Most likely the mouse.
   * @param {int} viewWidth   The width of the viewport.
   * @param {int} viewHeight  The height of the viewport.
   */
  drag: function(screenPt, viewWidth, viewHeight) {
    if(!this._yFlipped) {
      screenPt[1] = viewHeight - screenPt[1];
    }
    
    if(!this._dragPrev) {
      this._updatePrevDragPt(screenPt, viewWidth, viewHeight);
    }
    
    var worldPt = this.screenToWorld(screenPt, viewWidth, viewHeight);
    var dragX = this._dragPrev[0] - worldPt[0];
    var dragY = this._dragPrev[1] - worldPt[1];
    
    this._eye[0] = this._dragEyeStart[0] + dragX;
    this._eye[1] = this._dragEyeStart[1] + dragY;
    
    var anchorX = screenPt[0]*this.getWidth()/viewWidth;
    var anchorY = screenPt[1]*this.getHeight()/viewHeight;
    this.moveAnchor([anchorX, anchorY]);
    
    this._updatePrevDragPt(screenPt, viewWidth, viewHeight);
  },
  
  
  /** 
   * Updates the previous drag state. 
   * @param {vec2} screenPt   The point of the thing dragging the camera, in 
   *      screen coordinates. Most likely the mouse.
   * @param {int} viewWidth   The width of the viewport.
   * @param {int} viewHeight  The height of the viewport.
   */
  _updatePrevDragPt: function(screenPt, viewWidth, viewHeight) {
    var worldPt = this.screenToWorld(screenPt, viewWidth, viewHeight);
    this._dragPrev = worldPt;
    this._dragEyeStart = vec2.clone(this._eye);
  },
  
  
  /** 
   * Causes the camera drag to end.
   */
  endDrag: function() {
    this._dragPrev = undefined;
    this._dragEyeStart = undefined;
  },
  
  //////// Transforms
  
  
  /** 
   * Returns only the Rotate x Scale part of the view transform matrix.
   * @return {mat4}
   */
  _getRotateScaleTransform: function() {
    var m = mat4.create();
    
    var rotT = mat4.create();
    mat4.rotateZ(rotT, rotT, this._angle);
    mat4.mul(m, rotT, m);
    
    var zoomT = mat4.create();
    mat4.scale(zoomT, zoomT, [this._zoom, this._zoom, 1]);
    mat4.mul(m, zoomT, m);
    
    return m;
  },
  
  
  /** 
   * Returns the view matrix for this camera. 
   * @return {mat4}
   */
  getViewTransform:function() {
    var m = mat4.create();
    
    var eyeT = mat4.create();
    mat4.translate(eyeT, eyeT, [-this._eye[0], -this._eye[1], 0]);
    mat4.mul(m, eyeT, m);
    
    var rsT = this._getRotateScaleTransform();
    mat4.mul(m, rsT, m);
    
    var anchorT = mat4.create();
    mat4.translate(anchorT, anchorT, [this._anchor[0], this._anchor[1], 0]);
    mat4.mul(m, anchorT, m);
    
    return m;
  },
  
  
  
  /** 
   * Returns the projection matrix for this camera.
   * @return {mat4}
   */
  getProjectionTransform:function() {
    var m = mat4.create();
    m[0] = 2/this.getWidth();
    m[5] = 2/this.getHeight();
    m[12] = -1;
    
    if(this._yFlipped) {
      m[5] *= -1;
      m[13] = 1;
    }
    else {
      m[13] = -1;
    }
    return m;
  },
  
  
  
  
  /** 
   * Transforms a point from screen coordinates to world coordinates.
   * @param {vec2} screenPt   The point in view coordinates.
   * @param {int} viewWidth   The width of the viewport.
   * @param {int} viewHeight  The height of the viewport.
   * @return {vec2}
   */
  screenToWorld: function(screenPt, viewWidth, viewHeight) {
    var result = [screenPt[0], screenPt[1]];
    
    result[0] *= this.getWidth()/viewWidth;
    result[1] *= this.getHeight()/viewHeight;
    
    var viewInv = this.getViewTransform();
    mat4.invert(viewInv, viewInv);
    
    vec2.transformMat4(result, result, viewInv);
    return result;
  },
  
  
  /** 
   * Transform a point from world coordinates to screen coordinates.
   * @param {vec2} worldPt    The point in world coordinates.
   * @param {int} viewWidth   The width of the viewport.
   * @param {int} viewHeight  The height of the viewport.
   * @return {vec2}
   */
  worldToScreen: function(worldPt, viewWidth, viewHeight) {
    result = [worldPt[0], worldPt[1]];
    
    var viewTrans = this.getViewTransform();
    vec2.transformMat4(result, result, viewTrans);
    
    result[0] *= viewWidth/this.getWidth();
    result[1] *= viewHeight/this.getHeight();
    
    return result;
  }
};


Util.Inheritance.inherit(TentaGL.Camera2D, TentaGL.Camera);

