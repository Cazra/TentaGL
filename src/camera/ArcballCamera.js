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
  TentaGL.Camera.call(this, eye, center, up);
  
  // Save initial distance.
  var look = this.getLookVector();
  this._origDist = vec3.length(look);
  this._dist = this._origDist;
  
  // Save our initial rotational transform with our eye at distance = 1 from the center.
  var unitLook = vec3.normalize(vec3.create(), look);
  this._eye = vec3.sub(vec3.create(), this._center, unitLook);
  
  // Save the initial center.
  this._origCenter = vec3.clone(this._center);
  
  // Save our orientation, as well as the initial up and right vectors of the camera.
  this._orientation = quat.create();
  this._origUp = vec3.clone(this._up);
  this._origRight = vec3.cross(vec3.create(), unitLook, this._origUp);
};

TentaGL.ArcballCamera.prototype = Object.create(TentaGL.Camera.prototype);

/** 
 * Converts mouse viewport coordinates to unit sphere coordinates. 
 * @param {length 2 int array} mouseXY  The XY coordinates of the mouse relative to 
 *      its viewport's upper-left corner.
 * @param {int} viewWidth   The width of the mouse's viewport.
 * @param {int} viewHeight  The height of the mouse's viewport.
 * @return {vec3} The XYZ coordinates of the mouse projected onto the unit 
 *      sphere's surface.
 */
TentaGL.ArcballCamera.prototype.projectMouseToUnitSphere = function(mouseXY, viewWidth, viewHeight) {
  var r = viewHeight/2;
  var ir = 1/r;
  
  // Translate model so the origin is in the middle of the view. Also, flip the Y axis.
  var x = mouseXY[0] - viewWidth/2;
  var y = -1*(mouseXY[1] - viewHeight/2);
  
  // Scale our system to be projected on a unit sphere.
  var sphereCoords = vec3.fromValues(x, y, 0);
  sphereCoords = vec3.scale(sphereCoords, sphereCoords, ir);
  
  // If our transformed point is outside the sphere, normalize it so that it is
  // on the edge of the sphere.
  if(vec3.length(sphereCoords) > 1) {
    sphereCoords = vec3.normalize(sphereCoords, sphereCoords);
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
};




/** 
 * Returns the unit vector currently pointing in the "up" direction of the view.
 * For our arcball camera, this is calculated from the original up vector
 * and the orientation quaternion.
 * @return {vec3}
 */
TentaGL.ArcballCamera.prototype.getUp = function() {
  var qMatInv = mat4.invert(mat4.create(), mat4.fromQuat(mat4.create(), this._orientation));
  var up = vec3.transformMat4(vec3.create(), this._origUp, qMatInv);
  return vec3.normalize(up, up);
};

/** 
 * Returns the unit vector currently pointing in the "right" direction of the view.
 * For our arcball camera, this is calculated from the original right vector
 * and the orientation quaternion.
 * @return {vec3}
 */
TentaGL.ArcballCamera.prototype.getRight = function() {
  var qMatInv = mat4.invert(mat4.create(), mat4.fromQuat(mat4.create(), this._orientation));
  var right = vec3.transformMat4(vec3.create(), this._origRight, qMatInv);
  return vec3.normalize(right, right);
};






/** 
 * Controls the arcball camera with the mouse using dragging gestures. 
 * @param {TentaGL.Mouse} mouse
 * @param {int} viewWidth   The width of the mouse's viewport.
 * @param {int} viewHeight  The height of the mouse's viewport.
 */
TentaGL.ArcballCamera.prototype.controlWithMouse = function(mouse, viewWidth, viewHeight) {
  
  // Start arcball drag by saving starting arcball state.
  if(mouse.justLeftPressed()) {
    this._preVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
    this._preOrientation = quat.clone(this._orientation);
  }
  
  // Rotate the arcball while the left mouse button is dragged.
  if(mouse.isLeftPressed() || mouse.justLeftReleased()) {
    var curVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
    var q = TentaGL.Math.getQuatFromTo(this._preVec, curVec);
    
    quat.mul(this._orientation, q, this._preOrientation);
  }
  
  
  // Start panning by saving center state.
  if(mouse.justRightPressed()) {
    this._prePan = this.projectMouseToPanningPlane(mouse.getXY(), viewWidth, viewHeight);
    this._preCenter = vec3.clone(this._center);
  }
  
  // Pan the camera while the right mouse button is dragged.
  if(mouse.isRightPressed()) {
    this._center = vec3.clone(this._preCenter);
    this._curPan = this.projectMouseToPanningPlane(mouse.getXY(), viewWidth, viewHeight);
    
    var dPan = vec3.sub(vec3.create(), this._prePan, this._curPan);
    var tCenter = mat4.create();
    mat4.translate(tCenter, tCenter, dPan);
    
    vec3.transformMat4(this._center, this._preCenter, tCenter);
  }
};



/** 
 * Returns the view transform for the arcball camera. This accounts for 
 * rotation of the arcball, distance from the center point, and translation of
 * the center point from panning.
 */
TentaGL.ArcballCamera.prototype.getViewTransform = function() {
  
  // Zoom translation (Z)
  var translate = mat4.create();
  mat4.translate(translate, translate, [0, 0, 0-this._dist]);
  
  // Arcball rotation (R)
  var m = mat4.mul(mat4.create(), translate, mat4.fromQuat(mat4.create(), this._orientation));
  
  // Center point panning. (P)
  var centerTrans = mat4.create();
  mat4.translate(centerTrans, centerTrans, vec3.negate(vec3.create(), this._center));
  
  // M = Z*R*P
  m = mat4.mul(m, m, centerTrans);
  return m;
};


/** 
 * Resets the camera to its original state. 
 */
TentaGL.ArcballCamera.prototype.resetOrientation = function() {
  this._center = vec3.clone(this._origCenter);
  this._dist = this._origDist;
  this._orientation = quat.create();
};


/** 
 * Returns the distance of the eye from the center.
 * @return {Number}
 */
TentaGL.ArcballCamera.prototype.getDist = function() {
  return this._dist;
};



/** 
 * Sets the distance from the eye to the center without changing the 
 * orientation. 
 * @param {Number} dist
 */
TentaGL.ArcballCamera.prototype.setDist = function(dist) {
  this._dist = dist;
};


