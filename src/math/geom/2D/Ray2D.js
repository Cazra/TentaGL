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
 * A line that extends from a point infinitely in one direction. 
 * @constructor
 * @param {vec2} pt     The ray's origin.
 * @param {vec2} vec    The ray's direction.
 */
TentaGL.Math.Ray2D = function(pt, vec) {
  this._pt = vec2.copy([], pt);
  this._vec = vec2.copy([], vec);
};


TentaGL.Math.Ray2D.prototype = {
  
  constructor: TentaGL.Math.Ray2D,
  
  isaRay2D: true,
  
  
  /** 
   * Returns a cloned copy of this ray.
   * @return {TentaGL.Math.Ray2D}
   */
  clone: function() {
    return new TentaGL.Math.Ray2D(this._pt, this._vec);
  },
  
  
  /** 
   * Returns the ray as a Ray3D with z=0.
   * @return {TentaGL.Math.Ray3D}
   */
  toRay3D: function() {
    // TODO
  },
  
  
  
  //////// Properties
  
  /** 
   * Setter/getter for the ray's origin point. 
   * @param {vec2} pt   Optional.
   * @return {vec2}
   */
  point: function(pt) {
    if(pt !== undefined) {
      this._pt = vec2.copy([], pt);
    }
    return this._pt;
  },
  
  
  /** 
   * Setter/getter for the ray's directional vector.
   * @param {vec2} v    Optional.
   * @return {vec2}
   */
  vector: function(v) {
    if(v !== undefined) {
      this._vec = vec2.copy([], v);
    }
    return this._vec;
  },
  
  
  //////// Collisions
  
  
  /** 
   * Returns the distance of some point to this ray. 
   * @param {vec2} pt
   * @return {number}
   */
  distToPt: function(pt) {
    var v = vec2.sub([], pt, this._pt);
    var uHat = vec2.normalize([], this._vec);
    var vHat = vec2.normalize([], v);
    
    if(vec2.dot(uHat, vHat) <= 0) {
      return vec2.length(v);
    }
    else {
      var sin = vec3.length(vec2.cross([], uHat, vHat));
      return vec2.length(v)*sin;
    }
  },
  
  
  /** 
   * Returns whether some point lies on this ray.
   * @param {vec2} pt
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    return (this.distToPt(pt) <= tolerance);
  },
  
  
  /** 
   * The bounding box of a ray is infinite, and therefore returns undefined.
   */
  getBounds2D: function() {
    return undefined;
  },
  
  
  /** 
   * Returns the intersection between this and another ray.
   * If the rays intersect at a single point, that point is returned.
   * If the rays overlap in the same direction, the ray that is overlapped gets returned.
   * If the rays overlap in opposite directions, a Line2D of the overlapping segment is returned.
   * Otherwise, undefined is returned.
   * @param {TentaGL.Math.Ray2D} ray
   * @return {vec2 || TentaGL.Math.Line2D || TentaGL.Math.Ray2D}
   */
  intersectionRay: function(ray) {
    var p = this._pt;
    var q = ray._pt;
    
    var u = this._vec;
    var v = ray._vec;
    
    
    if(TentaGL.Math.vectorsParallel(u, v)) {
      // TODO: parallel rays
    }
    else {
      var w = vec2.sub([], q, p);
      
      var m = [];
      m = m.concat(u);
      m = m.concat(vec2.negate([], v));
      mat2.invert(m, m);
      
      var coeffs = vec2.transformMat2([], w, m);
      if(coeffs[0] >= 0 && coeffs[1] >= 0) {
        return vec2.add([], p, vec2.scale([], u, coeffs[0]));
      }
      else {
        return undefined;
      }
    }
  }
  
  
};

