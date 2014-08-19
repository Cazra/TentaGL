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
  this._eye = vec3.copy([], eye);
  
  if(center === undefined) {
    center = [0,0,0];
  }
  this._center = vec3.copy([], center);
  
  if(up === undefined) {
    up = [0,1,0];
  }
  this._up = vec3.copy([], up);
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
   * Setter/getter for the camera's eye position. This point is the actual location
   * of the camera in world space.
   * @param {vec3} xyz
   * @return {vec3}
   */
  eye: function(xyz) {
    if(xyz !== undefined) {
      this._eye = vec3.copy([], xyz);
      this._correctUpVector();
    }
    return this._eye;
  },
  
  
  
  //////// Center location
  
  
  /** 
   * Setter/getter for the camera's center position. This is the point in 
   * world space that the camera is looking at.
   * @param {vec3} xyz
   * @return {vec3}
   */
  center: function(xyz) {
    if(xyz !== undefined) {
      this._center = vec3.copy([], xyz);
      this._correctUpVector();
    }
    return this._center;
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
    return vec3.sub([], this._center, this._eye);
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
  setUp:function(xyz) {
    this._up = vec3.copy([], xyz);
    this._correctUpVector();
  },
  
  
  
  
  //////// "Right" vector
  
  
  /** 
   * Returns the unit vector pointing in the "right" direction of the view. 
   * @return {vec3}
   */
  getRight:function() {
    var right = vec3.cross([], this.getLook(), this.getUp());
    vec3.normalize(right, right);
    return right;
  },
  
  
  
  //////// Perspective properties
  
  /** 
   * Sets the camera's perspective mode. 
   * Either TentaGL.Camera3D.PERSP or TentaGL.Camera3D.ORTHO. 
   * @param {int} mode    Optional.
   * @return {int}
   */
  mode: function(mode) {
    if(mode !== undefined) {
      if(mode != TentaGL.Camera3D.PERSP && mode != TentaGL.Camera3D.ORTHO) {
        throw new Error("Mode " + mode + " not supported.");
      }
      this._mode = mode;
    }
    return this._mode;
  },
  
  
  /** 
   * Setter/getter for the camera's unzoomed field of view angle.
   * @param {number} rads   Optional.
   * @return {number}
   */
  fovy: function(rads) {
    if(rads !== undefined) {
      this._fovBase = rads;
    }
    return this._fovBase;
  },
  
  
  /** 
   * Returns the zoomed field of view angle for the camera in radians. 
   * @return {Number}
   */
  getZoomedFOVY:function() {
    return this._fovBase*this._zoom;
  },
  
  
  /** 
   * Setter/getter for the camera's zoom level. 
   * The default level is 1.0. The camera becomes
   * more zoomed in as its zoom level approaches 0.
   * The new value must be in the range (0, 1]. 
   * @param {float} zoom    Optional.
   * @return {float}
   */
  zoom: function(zoom) {
    if(zoom !== undefined) {
      if(zoom <= 0 || zoom >1) {
        throw new Error("Invalid zoom value: " + zoom);
      }
      this._zoom = zoom;
    }
    return this._zoom;
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
      throw new Error("Invalid values for zNear and zFar planes: " + zNear + ", " + zFar);
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
  
  

  
  //////// Ray casting
  
  /** 
   * Projects some point in viewport coordinates (Y axis is down) to a point on
   * some plane. If the mouse cannot be projected onto the plane, undefined is returned.
   * @param {vec2} pt   The point in viewport coordinates.
   * @param {TentaGL.Math.Plane} plane    The plane we are projecting pt onto, 
   *      in world coordinates.
   * @param {uint} viewWidth    The width of the viewport.
   * @param {uint} viewHeight   The height of the viewport.
   * @return {vec3}
   */
  projectToPlane: function(pt, plane, viewWidth, viewHeight) {
    // Create a line between our transformed near and far points, then
    // find the intersection between the line and the plane.
    var nf = this.projectToClip(pt, viewWidth, viewHeight);
    
    var line = new TentaGL.Math.Line3D(nf[0], nf[1]);
    var intersection = plane.lineIntersection(line);
    
    if(intersection && !intersection.isaLine3D) {
      return intersection;
    }
    else {
      return undefined;
    }
  },
  
  
  
  /** 
   * Projects a point in viewport coordinates (Y is down) to the corresponding
   * pair of points on the near and far clipping planes.
   * @param {vec2} pt
   * @param {uint} viewWidth
   * @param {uint} viewHeight
   * @return {array: [near: vec2, far: vec2]}
   */
  projectToClip: function(pt, viewWidth, viewHeight) {
    var aspect = viewWidth/viewHeight;
    var x = (pt[0] - viewWidth/2)/aspect;
    var y = -1*(pt[1] - viewHeight/2);
    var xy = [x,y,0];
    vec3.scale(xy, xy, 2/viewHeight);
    
    var near = [xy[0], xy[1], -1, 1];
    var far = [xy[0], xy[1], 1, 1];
    
    // Convert our near and far points to world coordinates.
    var m = this.getTransform(aspect);
    mat4.invert(m, m);
    
    vec4.transformMat4(near, near, m);
    vec4.transformMat4(far, far, m);
    
    // normalize pointsvalues using the w coordinate. 
    near[3] = 1/near[3];
    near[0] = near[0]*near[3];
    near[1] = near[1]*near[3];
    near[2] = near[2]*near[3];
    
    far[3] = 1/far[3];
    far[0] = far[0]*far[3];
    far[1] = far[1]*far[3];
    far[2] = far[2]*far[3];
    
    return [near, far];
  },
  
  
  /** 
   * Returns the eight corners of the camera's view volume in world coordinates. 
   * @param {uint} viewWidth
   * @param {uint} viewHeight
   * @return {array: vec3*8}
   */
  getViewVolumeCorners: function(viewWidth, viewHeight) {
    var lowerLeft = this.projectToClip([0, viewHeight], viewWidth, viewHeight);
    var lowerRight = this.projectToClip([viewWidth, viewHeight], viewWidth, viewHeight);
    var upperRight = this.projectToClip([viewWidth, 0], viewWidth, viewHeight);
    var upperLeft = this.projectToClip([0, 0], viewWidth, viewHeight);
    
    return [  lowerLeft[0], lowerRight[0], upperRight[0], upperLeft[0],
              lowerLeft[1], lowerRight[1], upperRight[1], upperLeft[1]  ];
  }
  
};


Util.Inheritance.inherit(TentaGL.Camera3D, TentaGL.Camera);
