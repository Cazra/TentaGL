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
 * Constructs an arcball camera. 
 * This implementation provides some very powerful features for exploring a
 * scene with the mouse. The scene can be rotated around in an arcball movement
 * by left-dragging, The scene can be panned by right-dragging, and the scene
 * can be zoomed in and out by scrolling the mouse wheel.
 */
TentaGL.ArcballCamera = function(eye, center, up) {
  TentaGL.Camera3D.call(this, eye, center, up);
  
  // Save initial distance.
  var look = this.getLookVector();
  this._origDist = vec3.length(look);
  this._dist = this._origDist;
  
  // Save our initial rotational transform with our eye at distance = 1 from the center.
  this._origLook = vec3.normalize([], look);
  
  // Save the initial center.
  this._origCenter = vec3.clone(this._center);
  
  // Save our orientation, as well as the initial up and right vectors of the camera.
  this._origUp = vec3.clone(this._up);
  this._origRight = vec3.cross([], this._origLook, this._origUp);
  
  this._orientation = TentaGL.Math.getOrientation([0,0,-1], [0,1,0], this._origLook, this._origUp);
  this._origOrientation = quat.clone(this._orientation);
};

TentaGL.ArcballCamera.prototype = {
  
  constructor:TentaGL.ArcballCamera,
  
  
  //////// Arcball sphere projection

  /** 
   * Converts mouse viewport coordinates to unit sphere coordinates. 
   * @param {length 2 int array} mouseXY  The XY coordinates of the mouse relative to 
   *      its viewport's upper-left corner.
   * @param {int} viewWidth   The width of the mouse's viewport.
   * @param {int} viewHeight  The height of the mouse's viewport.
   * @return {vec3} The XYZ coordinates of the mouse projected onto the unit 
   *      sphere's surface.
   */
  projectMouseToUnitSphere:function(mouseXY, viewWidth, viewHeight) {
    var r = Math.max(viewHeight, viewWidth)/2;
    var ir = 1/r;
    
    // Translate model so the origin is in the middle of the view. Also, flip the Y axis.
    var x = mouseXY[0] - viewWidth/2;
    var y = -1*(mouseXY[1] - viewHeight/2);
    
    // Scale our system to be projected on a unit sphere.
    var sphereCoords = [x, y, 0];
    vec3.scale(sphereCoords, sphereCoords, ir);
    
    // If our transformed point is outside the sphere, normalize it so that it is
    // on the edge of the sphere.
    if(vec3.length(sphereCoords) > 1) {
      vec3.normalize(sphereCoords, sphereCoords);
    }
    
    // Find the Z component of the sphere coords.
    var zSquare = 1-(sphereCoords[0]*sphereCoords[0] + sphereCoords[1]*sphereCoords[1]);
    if(zSquare < 0) {
      sphereCoords[2] = 0;
    }
    else {
      sphereCoords[2] = Math.sqrt(zSquare);
    }
    
    return sphereCoords;
  },



  //////// Eye position


  getEye:function() {
    var lookInv = this.getLook();
    vec3.negate(lookInv, lookInv);
    vec3.scale(lookInv, lookInv, this._dist);
    
    return vec3.add(this._eye, this._center, lookInv);
  },


  //////// Look, Up, Right vectors

  /** 
   * Returns the unit vector currently pointing in the "look" direction of the view.
   * For our arcball camera, this is calculated from the original look vector
   * and the orientation quaternion.
   * @return {vec3}
   */
  getLook:function() {
    var qMatInv = mat4.invert(mat4.create(), mat4.fromQuat(mat4.create(), quat.invert(quat.create(), this._orientation)));
    var look = vec3.transformMat4([], [0,0,-1], qMatInv);
    return vec3.normalize(look, look);
  },


  /** 
   * Returns the unit vector currently pointing in the "up" direction of the view.
   * For our arcball camera, this is calculated from the original up vector
   * and the orientation quaternion.
   * @return {vec3}
   */
  getUp:function() {
    var qMatInv = mat4.invert(mat4.create(), mat4.fromQuat(mat4.create(), quat.invert(quat.create(), this._orientation)));
    var up = vec3.transformMat4([], [0,1,0], qMatInv);
    vec3.normalize(up, up);
    return up;
  },

  /** 
   * Returns the unit vector currently pointing in the "right" direction of the view.
   * For our arcball camera, this is calculated from the original right vector
   * and the orientation quaternion.
   * @return {vec3}
   */
  getRight:function() {
    var qMatInv = mat4.invert(mat4.create(), mat4.fromQuat(mat4.create(), quat.invert(quat.create(), this._orientation)));
    var right = vec3.transformMat4([], [1,0,0], qMatInv);
    return vec3.normalize(right, right);
  },


  //////// Orientation


  /** 
   * Returns the quaternion for orienting the camera's look vector relative to the 
   * negative Z axis (the natural look direction of the camera).
   * @return {quat}
   */
  getOrientation:function() {
    return quat.clone(this._orientation);
  },


  /** 
   * Sets the quaternion for orienting the camera's look vector relative to the
   * negative Z axis (the natural look direction of the camera).
   */
  setOrientation:function(orientation) {
    this._orientation = orientation;
  },



  //////// Distance

  
  /** 
   * Setter/getter for the distance from the eye to the center.
   * @param {number} dist   Optional.
   * @return {number}
   */
  dist: function(dist) {
    if(dist !== undefined) {
      this._dist = dist;
    }
    return this._dist;
  },


  //////// Controller

  /** 
   * Controls the arcball camera with the mouse using dragging gestures. 
   * Left-dragging rotates the scene around the center point.
   * Right-dragging pans the scene around the center point.
   * The mouse wheel zooms in and out of the scene.
   * @param {TentaGL.Mouse} mouse
   * @param {int} viewWidth   The width of the mouse's viewport.
   * @param {int} viewHeight  The height of the mouse's viewport.
   */
  controlWithMouse:function(mouse, viewWidth, viewHeight) {
    
    // Zoom in by scrolling the mouse wheel up.
    if(mouse.scrollUpAmount() > 0) {
      for(var i = 0; i < mouse.scrollUpAmount(); i++) {
        this.dist(this.dist() * 9/10);
      }
    }
    
    // Zoom out by scrolling the mouse wheel down.
    if(mouse.scrollDownAmount() > 0) {
      for(var i = 0; i < mouse.scrollDownAmount(); i++) {
        this.dist(this.dist() * 10/9);
      }
    }
    
    
    // Start arcball drag by saving starting arcball state.
    if(mouse.justLeftPressed()) {
      this._preVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
      this._preOrientation = quat.clone(quat.invert(quat.create(), this._orientation));
    }
    
    // Rotate the arcball while the left mouse button is dragged.
    if(mouse.isLeftPressed() || mouse.justLeftReleased()) {
      var curVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
      var q = TentaGL.Math.getQuatFromTo(this._preVec, curVec);
      
      quat.mul(this._orientation, q, this._preOrientation);
      quat.invert(this._orientation, this._orientation);
    }
    
    
    // Start panning by saving center state.
    if(mouse.justRightPressed()) {
      this._prePan = this._getPanPoint(mouse.getXY(), viewWidth, viewHeight);
      this._preCenter = vec3.clone(this._center);
    }
    
    // Pan the camera while the right mouse button is dragged.
    if(mouse.isRightPressed()) {
      this._center = vec3.clone(this._preCenter);
      
      this._curPan = this._getPanPoint(mouse.getXY(), viewWidth, viewHeight);
      
      var dPan = vec3.sub([], this._prePan, this._curPan);
      var tCenter = mat4.create();
      mat4.translate(tCenter, tCenter, dPan);
      
      vec3.transformMat4(this._center, this._preCenter, tCenter);
    }
  },
  
  
  /** 
   * Projects a point in the viewport to world coordinates in the panning plane.
   * @param {vec2} xy
   * @param {number} w
   * @param {number} h
   * @return {vec3}
   */
  _getPanPoint: function(xy, w, h) {
    var panPlane = new TentaGL.Math.Plane(this.getLook(), this.center());
    return this.projectToPlane(xy, panPlane, w, h);
  },


  /** 
   * Resets the camera to its original state. 
   */
  resetOrientation:function() {
    this._center = vec3.clone(this._origCenter);
    this._dist = this._origDist;
    this._orientation = quat.clone(this._origOrientation);
  },



  //////// Camera transforms


  /** 
   * Returns the view transform for the arcball camera. This accounts for 
   * rotation of the arcball, distance from the center point, and translation of
   * the center point from panning.
   */
  getViewTransform:function() {
    
    // Zoom translation (Z)
    var translate = mat4.create();
    mat4.translate(translate, translate, [0, 0, 0-this._dist]);
    
    // Arcball rotation (R)
    var m = mat4.mul(mat4.create(), translate, mat4.fromQuat(mat4.create(), quat.invert(quat.create(), this._orientation)));
    
    // Center point panning. (P)
    var centerTrans = mat4.create();
    mat4.translate(centerTrans, centerTrans, vec3.negate([], this._center));
    
    // M = Z*R*P
    m = mat4.mul(m, m, centerTrans);
    return m;
  }
};


Util.Inheritance.inherit(TentaGL.ArcballCamera, TentaGL.Camera3D);







