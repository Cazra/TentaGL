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
 * A line stretching infinitely in both directions. This can also be used to
 * define a 2D coordinate system when paired with another non-parallel axis. 
 * (See Basis2D)
 * @constructor
 * @param {vec2} pt
 * @param {vec2} vec    The vector pointing in the positive direction of the axis.
 */
TentaGL.Math.Axis2D = function(pt, vec) {
  this._pt = vec2.copy([], pt);
  this._vec = vec2.copy([], vec);
};


TentaGL.Math.Axis2D.prototype = {
  
  constructor: TentaGL.Math.Axis2D,
  
  isaAxis2D: true,
  
  
  /** 
   * Returns a cloned copy of this axis.
   * @return {TentaGL.Math.Axis2D}
   */
  clone: function() {
    return new TentaGL.Math.Axis2D(this._pt, this._vec);
  },
  
  
  /** 
   * Returns the axis as an Axis3D. 
   * @return {TentaGL.Math.Axis3D}
   */
  toAxis3D: function() {
    var pt = vec3.copy(this._pt);
    pt[2] = 0;
    
    var vec = vec3.copy(this._vec);
    vec[2] = 0;
    
    return new TentaGL.Math.Axis3D(pt, vec);
  },
  
  
  /** 
   * Setter/getter for the axis's origin point. 
   * @param {vec2} pt   Optional.
   * @return {vec2}
   */
  point: function(pt) {
    if(pt !== undefined) {
      this._pt = vec2.copy([], pt);
    }
    return this._pt.slice(0);
  },
  
  
  /** 
   * Setter/getter for the vector of the axis's positive direction.
   * @param {vec2} vec    Optional.
   * @return {vec2}
   */
  vector: function(vec) {
    if(vec !== undefined) {
      this._vec = vec2.copy([], vec);
    }
    return this._vec.slice(0);
  },
  
  
  
  /** 
   * Returns a point on the axis corresponding to a parametric value. 
   * @param {float} alpha
   * @return {vec2}
   */
  interpolate: function(alpha) {
    return vec2.add([], this._pt, vec2.scale([], this._vec, coeffs[0]));
  },
  
  
  //////// Collisions
  
  
  /** 
   * Returns the distance of a point to this axis. 
   * @param {vec2} pt
   * @return {number}
   */
  distToPt: function(pt) {
    var v = vec2.sub([], pt, this._pt);
    var uHat = vec2.normalize([], this._vec);
    var vHat = vec2.normalize([], v);
    
    var sin = vec3.length(vec2.cross([], uHat, vHat));
    return vec2.length(v)*sin;
  },
  
  
  /** 
   * Returns whether some point lies on this axis.
   * @param {vec2} pt
   * @param {float} tolerance   Optional. Default 0.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    return (this.distToPt(pt) <= tolerance);
  },
  
  
  /** 
   * The bounding box of an axis is infinite, and therefore returns undefined.
   */
  getBounds2D: function() {
    return undefined;
  },
  
  
  /** 
   * Returns the intersection of this axis with a ray. 
   * This might return either a single point of intersection, the ray 
   * (completely overlapped by the axis), or undefined.
   * @param {TentaGL.Math.Ray2D} ray
   * @param {float} tolerance   Optional. Default 0.
   * @return {vec2 || TentaGL.Math.Ray2D}
   */
  intersectionRay: function(ray, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var p = this._pt;
    var q = ray._pt;
    
    var u = this._vec;
    var v = ray._vec;
    
    if(TentaGL.Math.vectorsParallel(u, v)) {
      var overlapQ = this.containsPt(q, tolerance);
      
      if(overlapQ) {
        return ray;
      }
      else {
        return undefined;
      }
    }
    else {
      var w = vec2.sub([], q, p);
      
      var m = [];
      m = m.concat(u);
      m = m.concat(vec2.negate([], v));
      mat2.invert(m, m);
      
      var coeffs = vec2.transformMat2([], w, m);
      if(coeffs[1] >= 0) {
        return vec2.add([], p, vec2.scale([], u, coeffs[0]));
      }
      else {
        return undefined;
      }
    }
  },
  
  
  /**
   * Returns the intersection of this axis with a line segment.
   * @param {TentaGL.Math.Line2D} line
   * @param {float} tolerance   Optional. Default 0.
   * @return {vec2 || TentaGL.Math.Line2D} 
   */
  intersectionLine: function(line, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var p = this._pt;
    var q = line._pt;
    
    var u = this._vec;
    var v = line.getVec2();
    
    if(TentaGL.Math.vectorsParallel(u, v)) {
      var overlapQ = this.containsPt(q, tolerance);
      
      if(overlapQ) {
        return line;
      }
      else {
        return undefined;
      }
    }
    else {
      var w = vec2.sub([], q, p);
      
      var m = [];
      m = m.concat(u);
      m = m.concat(vec2.negate([], v));
      mat2.invert(m, m);
      
      var coeffs = vec2.transformMat2([], w, m);
      if(coeffs[1] >= 0 && coeffs[1] <= 1) {
        return vec2.add([], p, vec2.scale([], u, coeffs[0]));
      }
      else {
        return undefined;
      }
    }
  },
  
  
  /** 
   * Returns the intersection of this axis with another axis.
   */
  intersectionAxis: function(axis, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var p = this._pt;
    var q = axis._pt;
    
    var u = this._vec;
    var v = axis._vec;
    
    if(TentaGL.Math.vectorsParallel(u, v)) {
      var overlapQ = this.containsPt(q, tolerance);
      
      if(overlapQ) {
        return axis;
      }
      else {
        return undefined;
      }
    }
    else {
      var w = vec2.sub([], q, p);
      
      var m = [];
      m = m.concat(u);
      m = m.concat(vec2.negate([], v));
      mat2.invert(m, m);
      
      var coeffs = vec2.transformMat2([], w, m);
      return vec2.add([], p, vec2.scale([], u, coeffs[0]));
    }
  },
  
  
  /** 
   * Renders the axis, clipped within the bounds of the view volume.
   * @param {WebGLRenderingContext} gl
   */
  render: function(gl) {
    // TODO
  }
  
};

Util.Inheritance.inherit(TentaGL.Math.Axis2D, TentaGL.Math.Shape2D);

