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
 * Constructs the camera, given the position of its eye, the center point 
 * (the point it is looking at), and the vector for which direction is "up". 
 * @constructor
 * @param {vec3} eye
 * @param {vec3} center   Optional. Default [0, 0, 0].
 * @param {vec3} up       Optional. Default [0, 1, 0].
 */
TentaGL.Camera3D = function(eye, center, up) {
  var ex = eye[0];
  var ey = eye[1];
  var ez = eye[2];
  this._eye = vec3.fromValues(ex, ey, ez);
  
  if(center === undefined) {
    center = [];
  }
  var cx = center[0] || 0;
  var cy = center[1] || 0;
  var cz = center[2] || 0;
  this._center = vec3.fromValues(cx, cy, cz);
  
  if(up === undefined) {
    up = [];
  }
  var ux = up[0] || 0;
  var uy = up[1] || 1;
  var uz = up[2] || 0;
  this._up = vec3.fromValues(ux, uy, uz);
  this._correctUpVector();
  
  this._mode = TentaGL.Camera3D.PERSP;
  this._fovBase = TentaGL.TAU/8;
  this._zoom = 1;
  this._znear = 1;
  this._zfar = 1000;
};


TentaGL.Camera3D.PERSP = 1; // Perspective
TentaGL.Camera3D.ORTHO = 2; // Orthographic


TentaGL.Camera3D.prototype = {
  constructor:TentaGL.Camera3D,
  
  
  /** 
   * Corrects the up vector so that it forms a right angle with the look vector
   * and so that it is a unit vector.
   */
  _correctUpVector:function() {
    var look = this.getLookVector();
    var right = vec3.cross(vec3.create(), look, this._up);
    vec3.cross(this._up, right, look);
    vec3.normalize(this._up, this._up);
  },
  
  
  ////// Eye location
  
  /** 
   * Returns a copy of the camera's eye position. 
   * @return {vec3}
   */
  getEye:function() {
    return vec3.clone(this._eye);
  },
  
  /** 
   * Sets the position of the camera's eye. 
   * @param {vec3} 
   */
  setEye:function(eye) {
    this._eye = vec3.fromValues(eye[0], eye[1], eye[2]);
    this._correctUpVector();
  },
  
  /** 
   * Returns the X position of the camera's eye. 
   * @return {Number}
   */
  getEyeX:function() {
    return this._eye[0];
  },
  
  /** 
   * Returns the Y position of the camera's eye. 
   * @return {Number}
   */
  getEyeY:function() {
    return this._eye[1];
  },
  
  /** 
   * Returns the Z position of the camera's eye. 
   * @return {Number}
   */
  getEyeZ:function() {
    return this._eye[2];
  },
  
  
  
  //////// Center location
  
  
  /**
   * Returns a copy of the camera's center position.
   * @return {vec3}
   */
  getCenter:function() {
    return vec3.clone(this._center);
  },
  
  /** 
   * Sets the position of the camera's center. 
   * @param {vec3} center
   */
  setCenter:function(center) {
    this._center = vec3.fromValues(center[0], center[1], center[2]);
    this._correctUpVector();
  },
  
  /**
   * Returns the X position of the camera's center.
   * @return {Number}
   */
  getCenterX:function() {
    return this._center[0];
  },
  
  /**
   * Returns the Y position of the camera's center.
   * @return {Number}
   */
  getCenterY:function() {
    return this._center[1];
  },
  
  /**
   * Returns the Z position of the camera's center.
   * @return {Number}
   */
  getCenterZ:function() {
    return this._center[2];
  },
  
  //////// "Look" vector
  
  
  /** 
   * Returns the unit vector pointing in the "look" direction of the view.
   * @return {vec3}
   */
  getLook:function() {
    var look = this.getLookVector();
    return vec3.normalize(look, look);
  },
  
  
  /** 
   * Gets the unnormalized vector from eye to center. 
   * @return {vec3}
   */
  getLookVector:function() {
    return vec3.sub(vec3.create(), this._center, this._eye);
  },
  
  
  /** 
   * Returns the distance of the eye from the center.
   * @return {Number}
   */
  getDist:function() {
    return vec3.length(this.getLookVector());
  },
  
  
  /** 
   * Sets the distance from the eye to the center by changing the eye's position
   * relative to the center. This does not change the orientation of the camera. 
   */
  setDist:function(dist) {
    var lookInv = this.getLookVector();
    vec3.negate(lookInv, lookInv);
    vec3.scale(lookInv, lookInv, dist/vec3.length(lookInv));
    
    vec3.add(this._eye, this._center, lookInv);
  },
  
  
  
  
  
  
  
  //////// "Up" vector
  
  /** 
   * Returns a copy of the camera's unit "up" vector.
   * @return {vec3}
   */
  getUp:function() {
    return vec3.clone(this._up);
  },
  
  /** 
   * Sets the camera's "up" vector. 
   * @param {vec3} up
   */
  setUp:function(up) {
    this._up = vec3.fromValues(up[0], up[1], up[2]);
    this._correctUpVector();
  },
  
  /**
   * Returns the X component of the camera's "up" vector.
   * @return {vec3}
   */
  getUpX:function() {
    return this._up[0];
  },
  
  /**
   * Returns the Y component of the camera's "up" vector.
   * @return {vec3}
   */
  getUpY:function() {
    return this._up[1];
  },
  
  /**
   * Returns the Z component of the camera's "up" vector.
   * @return {vec3}
   */
  getUpZ:function() {
    return this._up[2];
  },
  
  
  
  
  //////// "Right" vector
  
  
  /** 
   * Returns the unit vector pointing in the "right" direction of the view.
   * @return {vec3}
   */
  getRight:function() {
    var right = vec3.cross(vec3.create(), this.getLook(), this.getUp());
    vec3.normalize(right, right);
    return right;
  },
  
  
  
  //////// Perspective properties
  
  /**
   * Returns the camera's perspective mode.
   * @return {int} Either TentaGL.Camera3D.PERSP or TentaGL.Camera3D.ORTHO.
   */
  getMode:function() {
    return this._mode;
  },
  
  /** 
   * Sets the camera's perspective mode.
   * @param {int} mode  Either TentaGL.Camera3D.PERSP or TentaGL.Camera3D.ORTHO.
   */
  setMode:function(mode) {
    if(mode != TentaGL.Camera3D.PERSP && mode != TentaGL.Camera3D.ORTHO) {
      throw Error("Mode " + mode + " not supported.");
    }
    this._mode = mode;
  },
  
  /** 
   * Gets the base field of view angle for the camera in radians. 
   * This is the camera's field of view angle when it is not zoomed in at all.
   */
  getFOVY:function() {
    return this._fovBase;
  },
  
  /** 
   * Sets the base field of view angle for the camera in radians.
   * @param {Number} angle
   */
  setFOVY:function(angle) {
    this._fovBase = angle;
  },
  
  /** 
   * Returns the zoomed field of view angle for the camera in radians. 
   * @return {Number}
   */
  getZoomedFOVY:function() {
    return this._fovBase*this._zoom;
  },
  
  /** 
   * Returns the camera's zoom level.
   * @return {Number}
   */
  getZoom:function() {
    return this._zoom;
  },
  
  /** 
   * Sets the camera's zoom level. The default level is 1.0. The camera becomes
   * more zoomed in as its zoom level approaches 0.
   * The new value must be in the range (0,1]. 
   */
  setZoom:function(zoom) {
    if(zoom <= 0 || zoom >1) {
      throw Error("Invalid zoom value: " + zoom);
    }
    
    this._zoom = zoom;
  },
  
  /**
   * Returns the distance of the znear clipping plane to the camera.
   * @return {Number}
   */
  getZNear:function() {
    return this._znear;
  },
  
  /**
   * Returns the distance of the zfar clipping plane to the camera.
   * @return {Number}
   */
  getZFar:function() {
    return this._zfar;
  },
  
  /**
   * Sets the distances of the znear and zfar clipping planes to the camera.
   * znear must be > 0 and zfar must be > znear.
   */
  setClippingPlanes:function(znear, zfar) {
    if(znear <= 0 || zfar <= znear) {
      throw Error("Invalid values for zNear and zFar planes: " + zNear + ", " + zFar);
    }
    this._znear = znear;
    this._zfar = zfar;
  },
  
  //////// Camera transforms
  
  /** 
   * Returns the projection-view matrix for this camera. 
   * @param {Number} aspect   The aspect ratio of our viewport.
   * @return {mat4} The projection-view transform matrix.
   */
  getTransform:function(aspect) {
    return mat4.mul(mat4.create(), this.getProjectionTransform(aspect), this.getViewTransform());
  },
  
  
  /** 
   * Returns the view matrix for this camera. 
   * @return {mat4}
   */
  getViewTransform:function() {
    return mat4.lookAt(mat4.create(), this._eye, this._center, this._up);
  },
  
  /** 
   * Returns the projection matrix for this camera.
   * @param {Number} aspect   The aspect ratio of our viewport.
   * @return {mat4}
   */
  getProjectionTransform:function(aspect) {
    if(this._mode == TentaGL.Camera3D.PERSP) {
      return mat4.perspective(mat4.create(), this.getZoomedFOVY(), aspect, 
                              this.getZNear(), this.getZFar());
    }
    else {
      return mat4.create();
    }
  },
  
  

  
  //////// Misc.
  
  
  /** 
   * Projects the mouse's XY coordinates (relative to its viewport) to the  
   * plane in world coordinates facing the camera's eye and intersecting the 
   * camera's center.
   * @param {length 2 int array} mouseXY  The XY coordinates of the mouse relative to 
   *      its viewport's upper-left corner.
   * @param {int} viewWidth   The width of the mouse's viewport.
   * @param {int} viewHeight  The height of the mouse's viewport.
   * @return {vec3} The XYZ coordinates of the mouse projected onto the panning plane.
   */
  projectMouseToPanningPlane:function(mouseXY, viewWidth, viewHeight) {
    
    // We need to transform our mouse coordinates to a normalized viewport 
    // coordinates system, also taking into account the aspect ratio and
    // inverting the Y axis.
    var aspect = viewWidth/viewHeight;
    var x = (mouseXY[0] - viewWidth/2)/aspect;
    var y = -1*(mouseXY[1] - viewHeight/2);
    var xy = vec3.fromValues(x,y,0);
    vec3.scale(xy, xy, 2/viewHeight);
    
    // Convert our transformed mouse coordinates to model-view coordinates by 
    // cancelling the perspective transform.
    xy[2] = 0-this._dist
    var projMat = this.getProjectionTransform(viewWidth/viewHeight);
    vec3.transformMat4(xy, xy, mat4.invert(mat4.create(), projMat));
    
    // Determine the position of the transformed mouse's model coordinates, 
    // relative to the camera's center, using our oriented up and right vectors.
    var up = this.getUp();
    var right = this.getRight();
    
    var tx = (xy[0]*right[0] + xy[1]*up[0])*this._dist + this._center[0];
    var ty = (xy[0]*right[1] + xy[1]*up[1])*this._dist + this._center[1];
    var tz = (xy[0]*right[2] + xy[1]*up[2])*this._dist + this._center[2];
    
    var planeCoords = vec3.fromValues(tx, ty, tz);
    return planeCoords;
  }
  
};


Util.Inheritance.inherit(TentaGL.Camera3D, TentaGL.Camera);
