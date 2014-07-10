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
 * A finite line in 3D space.
 * @param {vec4} p1
 * @param {vec4} p2
 */
TentaGL.Math.Line3D = function(p1, p2) {
  this._p1 = vec4.clone(p1);
  this._p1[3] = 1;
  
  this._p2 = vec4.clone(p2);
  this._p2[3] = 1;
  
  this._length = vec3.dist(p1, p2);
};


TentaGL.Math.Line3D.prototype = {
  
  constructor: TentaGL.Math.Line3D,
  
  isaLine3D: true,
  
  
  /** 
   * Returns a clone of the line. 
   * @return {TentaGL.Math.Line3D}
   */
  clone: function() {
    return new TentaGL.Math.Line3D(this._p1, this._p2);
  },
  
  
  /** 
   * Returns the first point of the line.
   * @return {vec4}
   */
  getPt1: function() {
    return this._p1;
  },
  
  
  /** 
   * Returns the second point of the line. 
   * @return {vec4}
   */
  getPt2: function() {
    return this._p2;
  },
  
  
  /** 
   * Returns the length of the line.
   * @return {number}
   */
  getLength: function() {
    return this._length;
  },
  
  
  /** 
   * Returns the vector component of the line defined by v = p2 - p1.
   * @return {vec4}
   */
  getVec3: function() {
    return vec3.sub(vec3.create(), this._p2, this._p1);
  },
  
  
  /** 
   * Returns the quaternion for the line's orientation relative to vector 
   * of the positive X axis.
   * @return {quat}
   */
  getQuat: function() {
    var v = this.getVec3();
    var xHat = [1,0,0];
    
    return TentaGL.Math.getQuatFromTo(xHat, v);
  },
  
  
  //////// Distance
  
  /** 
   * Returns the distance of a point to this line.
   * @param {vec4} pt
   * @return {number}
   */
  distToPt: function(pt) {
    var u = this.getVec3();
    var v = vec3.sub(vec3.create(), pt, this._p1);
    var w = vec3.sub(vec3.create(), pt, this._p2);
    
    if(vec3.dot(u, v) <= 0) {
      return vec3.len(v);
    }
    else if(vec3.dot(u, w) >= 0) {
      return vec3.len(w);
    }
    else {
      var uHat = vec3.normalize(vec3.create(), u);
      var vHat = vec3.normalize(vec3.create(), v);
      var cross = vec3.cross(vec3.create(), uHat, vHat);
      
      return vec3.len(v)*vec3.len(cross);
    }
  }
  
};

