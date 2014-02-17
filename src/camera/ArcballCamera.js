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


TentaGL.ArcballCamera = function(eye, center, up) {
  TentaGL.Camera.call(this, eye, center, up);
  
  this._orientation = quat.create();
  
  this._origLook = this.getLookVector();
  this._origLookUnit = vec3.normalize(vec3.create(), this._origLook);
  this._origDist = vec3.length(this._origLook);
  
  this._origUp = this.getUp();
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
 * Rotates the camera around the arcball from some initial vector to 
 * a destination vector.
 * @param {vec3} vFrom  The unit vector our rotation starts from.
 * @param {vec3} vTo  The unit vector our rotation ends at.
 */
TentaGL.ArcballCamera.prototype.rotate = function(vFrom, vTo) {
  var vCross = vec3.cross(vec3.create(), vFrom, vTo);
  var vDot = vec3.dot(vFrom, vTo);
  var theta = Math.acos(TentaGL.Math.clamp(vDot, -1, 1));
  
  var q = quat.setAxisAngle(quat.create(), vCross, theta);
  q = quat.normalize(q, q);
  var newO = quat.mul(quat.create(), this._orientation, q);
  
  this._up = vec3.transformQuat(this._up, this._origUp, newO);
  var look = vec3.transformQuat(vec3.create(), this._origLook, newO);
  
  //vec3.transformQuat(this._up, this._up, q);
  //var look = vec3.transformQuat(vec3.create(), this.getLookVector(), q);
  
  this._eye = vec3.add(this._eye, look, this._center);
  
  return newO;
};


/** Controls the arcball camera with the mouse using dragging gestures. */
TentaGL.ArcballCamera.prototype.controlWithMouse = function(mouse, viewWidth, viewHeight) {
  
  if(mouse.justLeftPressed()) {
    this._preVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
    this._preVec[0] *= -1;
    this._preVec[1] *= -1;
  }
  
  // Rotate the arcball while the left mouse button is dragged.
  if(mouse.isLeftPressed()) {
    this._curVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
    this._curVec[0] *= -1;
    this._curVec[1] *= -1;
    this.rotate(this._preVec, this._curVec);
  }
  
  if(mouse.justLeftReleased()) {
    this._curVec = this.projectMouseToUnitSphere(mouse.getXY(), viewWidth, viewHeight);
    this._curVec[0] *= -1;
    this._curVec[1] *= -1;
    this._orientation = this.rotate(this._preVec, this._curVec);
  }
};





/** 
 * Resets the arcball to its original orientation. 
 */
TentaGL.ArcballCamera.prototype.resetOrientation = function() {
  this._up = this._origUp;
  vec3.add(this._eye, this._center, this._origLook);
  
  this._orientation = quat.create();
};


/** 
 * Returns the distance of the eye from the center.
 * @return {Number}
 */
TentaGL.ArcballCamera.prototype.getDist = function() {
  return vec3.length(this._origLook);
};



/** 
 * Sets the distance from the eye to the center without changing the 
 * orientation. 
 */
TentaGL.ArcballCamera.prototype.setDist = function(dist) {
  var lookVec = this.getLookVector();
  var scale = dist/vec3.length(lookVec);
  
  vec3.scale(lookVec, lookVec, dist/vec3.length(lookVec));
  vec3.add(this._eye, this._center, lookVec);
  
  vec3.scale(this._origLook, this._origLookUnit, dist);
};


