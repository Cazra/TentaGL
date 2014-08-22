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
 * In raidians, 1 TAU is equivalent to a 360 degree rotation. 
 * I simply find this more convenient than 2*PI for many applications.
 */
TentaGL.TAU = 2*Math.PI;

/** Math utilities. Algebraic!! */
TentaGL.Math = {
  
  //////// Coordinates
  
  /** 
   * Converts cartesian XYZ coordinates to polar [radius, thetaY, thetaX] coordinates, 
   * with thetaX and thetaY given in radians. Note that in our polar coordinate 
   * system, we rotate around the Y axis first, then the X axis.
   * @param {vec3} xyz  The cartesian coordinates
   * @return {vec3} The polar coordinates
   */
  toPolar:function(xyz) {
    var v = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
    var radius = vec3.length(v);
    
    v = vec3.normalize(v, v);
    
    var thetaX = Math.asin(this.clamp(v[1], -1, 1));
    var thetaY;
    if(xyz[0] == 0) {
      if(xyz[2] > 0) {
        thetaY = TentaGL.TAU*0.75;
      }
      else {
        thetaY = TentaGL.TAU*0.25;
      }
    }
    else {
      thetaY = Math.atan(-xyz[2]/xyz[0]);
      if(xyz[0] < 0) {
        thetaY += TentaGL.TAU/2;
      }
    }
    
    return vec3.fromValues(radius, thetaY, thetaX);
  },
  
  
  /** 
   * Convertex polar coordinates [radius, thetaY, thetaX] with thetaX and thetaY
   * given in radians to cartesian XYZ coordinates.
   * @param {vec3} ryx  The polar coordinates.
   * @return {vec3} The cartesian coordinates
   */
  toCartesian:function(ryx) {
    var x = ryx[0]*Math.cos(ryx[1])*Math.cos(ryx[2]);
    var y = ryx[0]*Math.sin(ryx[2]);
    var z = 0 - ryx[0]*Math.sin(ryx[1])*Math.cos(ryx[2]);
    
    return vec3.fromValues(x, y, z);
  },
  
  
  //////// Ranges, Domains
  
  
  /** 
   * Clamps the specified value to the range [min, max]. 
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  clamp:function(value, min, max) {
    return Math.min(max, Math.max(value, min));
  },
  
  
  /** 
   * Wraps the specified value to the range [min, max).
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  wrap:function(value, min, max) {
    var rangeSize = max-min;
    
    var x = (value - min) % rangeSize;
    if(x < 0) {
      x += rangeSize;
    }
    
    return x + min;
  },
  
  
  /** 
   * Maps a value within some domain linearlly to a corresponding value within 
   * some range. 
   * @param {number} value
   * @param {array: [number, number]}
   * @param {array: [number, number]}
   */
  linearMap: function(value, domain, range) {
    var dDomain = domain[1] - domain[0];
    var dRange = range[1] - range[0];
    
    var alpha = (value - domain[0])/dDomain;
    
    return range[0] + dRange*alpha;
  },
  
  
  //////// Points
  
  /** 
   * Given a set of 2D or 3D points, return the point with the 
   * minimum X coordinate. 
   * @param {array: vec3}
   */
  ptsMinX: function(points) {
    var result;
    
    for(var i=0; i < points.length; i++) {
      var pt = points[i];
      
      if(!result || pt[0] < result[0]) {
        result = pt;
      }
    }
    
    return result;
  },
  
  /** 
   * Given a set of 2D or 3D points, return the point with the 
   * maximum X coordinate. 
   * @param {array: vec3}
   */
  ptsMaxX: function(points) {
    var result;
    
    for(var i=0; i < points.length; i++) {
      var pt = points[i];
      
      if(!result || pt[0] > result[0]) {
        result = pt;
      }
    }
    
    return result;
  },
  
  /** 
   * Given a set of 2D or 3D points, return the point with the 
   * minimum Y coordinate. 
   * @param {array: vec3}
   */
  ptsMinY: function(points) {
    var result;
    
    for(var i=0; i < points.length; i++) {
      var pt = points[i];
      
      if(!result || pt[1] < result[1]) {
        result = pt;
      }
    }
    
    return result;
  },
  
  /** 
   * Given a set of 2D or 3D points, return the point with the 
   * maximum Y coordinate. 
   * @param {array: vec3}
   */
  ptsMaxY: function(points) {
    var result;
    
    for(var i=0; i < points.length; i++) {
      var pt = points[i];
      
      if(!result || pt[1] > result[1]) {
        result = pt;
      }
    }
    
    return result;
  },
  
  /** 
   * Given a set of 2D or 3D points, return the point with the 
   * minimum Z coordinate. 
   * @param {array: vec3}
   */
  ptsMinZ: function(points) {
    var result;
    
    for(var i=0; i < points.length; i++) {
      var pt = points[i];
      
      if(!result || pt[2] < result[2]) {
        result = pt;
      }
    }
    
    return result;
  },
  
  /** 
   * Given a set of 2D or 3D points, return the point with the 
   * maximum Z coordinate. 
   * @param {array: vec3}
   */
  ptsMaxZ: function(points) {
    var result;
    
    for(var i=0; i < points.length; i++) {
      var pt = points[i];
      
      if(!result || pt[2] > result[2]) {
        result = pt;
      }
    }
    
    return result;
  },
  
  
  //////// Vectors
  
  
  /**
   * Returns the angle from u to v, rotated around their cross product. 
   * @param {vec3} u
   * @param {vec3} v
   * @return {number}   Range [0, PI].
   */
  vectorAngle: function(u, v) {
    var uHat = vec3.normalize(vec3.create(), u);
    var vHat = vec3.normalize(vec3.create(), v);
    
    return Math.acos(vec3.dot(uHat, vHat));
  },
  
  
  
  /** 
   * Computes a unit vector parametrically rotated between two vectors.
   * @param {vec3} u
   * @param {vec3} v
   * @param {number} alpha  A parametric value in the range [0,1].
   * @return {vec3}
   */
  tweenVector: function(u, v, alpha) {
    var uHat = vec3.normalize(vec3.create(), u);
    var vHat = vec3.normalize(vec3.create(), v);
    
    var n = vec3.cross(vec3.create(), u, v);
    nMag = vec3.length(n);
    
    var theta = Math.acos(vec3.dot(uHat, vHat));
    if(nMag < 0) {
      theta = TentaGL.TAU - theta;
    }
    else if(nMag == 0) {
      n = [0,0,1];
    }
    n = vec3.normalize(n, n);
    
    var q = quat.setAxisAngle(quat.create(), n, theta*alpha);
    return vec3.transformQuat(vec3.create(), uHat, q);
  },
  
  
  /** 
   * Returns true iff the two vectors are parallel. 
   * @param {vec2 || vec3} u
   * @param {vec2 || vec3} v
   */
  vectorsParallel: function(u, v) {
    if(!u[2]) {
      u = vec2.copy([], u);
      u[2] = 0;
    }
    if(!v[2]) {
      v = vec2.copy([], v);
      v[2] = 0;
    }
    
    var uHat = vec3.normalize([], u);
    var vHat = vec3.normalize([], v);
    var dot = vec3.dot(uHat, vHat);
    
    return (dot == 1 || dot == -1);
  },
  
  
  
  //////// Spaces
  
  
  /** 
   * Returns a matrix for changing a vector from basis B' to a vector in the 
   * standard basis of R^3. 
   * @param {vec3} vX   The X axis in B' relative to R^3.
   * @param {vec3} vY   The Y axis in B' relative to R^3.
   * @param {vec3} vZ   The Z axis in B' relative to R^3.
   * @return {mat3}
   */
  matChangeBasis:function(vX, vY, vZ) {
    var m = mat3.create();
    m[0] = vX[0];
    m[1] = vX[1];
    m[2] = vX[2];
    
    m[3] = vY[0];
    m[4] = vY[1];
    m[5] = vY[2];
    
    m[6] = vZ[0];
    m[7] = vZ[1];
    m[8] = vZ[2];
    return m;
  },
  
  
  
  //////// Orientation
  
  /** 
   * Gets the quaternion for rotating from one vector to another. 
   * @param {vec3} vFrom  The start vector.
   * @param {vec3} vTo  The end vector.
   * @return {quat}
   */
  getQuatFromTo:function(vFrom, vTo) {
    var vnFrom = vec3.normalize(this._vec3_1, vFrom);
    var vnTo = vec3.normalize(this._vec3_2, vTo);
    
    var axis = vec3.cross(this._vec3_3, vnFrom, vnTo);
    vec3.normalize(axis, axis);
    var cosTheta = TentaGL.Math.clamp(vec3.dot(vnFrom, vnTo), -1, 1);
    var sinTheta = vec3.length(axis);
    
    var theta = Math.acos(cosTheta);
    if(sinTheta < 0) {
      theta = 0-theta;
    }
    
    var q = quat.setAxisAngle(quat.create(), axis, theta);
    return quat.normalize(q, q);
  },
  
  
  
  /** 
   * Gets the quaternion for rotating from one orientation to another.
   * @param {vec3} xFrom    The start x-axis vector.
   * @param {vec3} yFrom    The start y-axis vector.
   * @param {vec3} xTo      The end x-axis vector.
   * @param {vec3} yTo      The end y-axis vector.
   * @return {quat}
   */
  getOrientation:function(xFrom, yFrom, xTo, yTo) {
    var q = this.getQuatFromTo(xFrom, xTo);
    
    var curY = vec3.transformQuat(vec3.create(), yFrom, q);
    var q2 = this.getQuatFromTo(curY, yTo);
    quat.mul(q, q2, q);
    
    return q;
  },
  
  
  
  
  
  //////// Exponents
  
  
  /** 
   * Returns the first power of two >= to value.
   * @param {Number} value
   * @param {int}
   */
  getPowerOfTwo:function(value) {
    var pow = 1;
    while(pow < value) {
      pow *= 2;
    }
    return pow;
  },
  
  
  //////// Prob/stat
  
  
  /** 
   * Returns the result of n!.
   * @param {uint} n
   * @return {uint}
   */
  factorial: function(n) {
    var result = 1;
    for(var i=2; i <= n; i++) {
      result *= i;
    }
    return result;
  },
  
  
  /** 
   * Returns the binomial coefficient, n choose k. 
   * @param {uint} n
   * @param {uint} k
   * @return {uint}
   */
  binomial: function(n, k) {
    if(k < 0 || k >= n) {
      return 0;
    }
    else {
      return this.factorial(n)/(this.factorial(n-k)*this.factorial(k));
    }
  },
  
  
  
  
  //////// 
  
  /** 
   * Recyclable vec3s for intermediate Math vector operations so that we don't 
   * have to spend as much time creating new vectors for every operation.
   */
  _vec3_1:vec3.create(),
  _vec3_2:vec3.create(),
  _vec3_3:vec3.create()
  
};
