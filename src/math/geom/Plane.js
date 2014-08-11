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
 * A mathematical 3D infinite plane object.
 * @param {vec3} normal   The non-zero vector normal to the plane.
 * @param {vec3} pt      Optional. The anchor point the plane passes through. 
 *      Default: [0,0,0]
 */
TentaGL.Math.Plane = function(normal, pt) {
  if(!pt) {
    pt = [0,0,0];
  }
  
  this._normal = vec3.clone(normal);
  this._nHat = vec3.normalize(vec3.create(), this._normal);
  this._pt = vec3.clone(pt);
};


TentaGL.Math.Plane.prototype = {
  constructor: TentaGL.Math.Plane,
  
  isaInfinitePlane: true,
  
  /** 
   * Returns the plane's normal vector. 
   * @return {vec3}
   */
  getNormal: function() {
    return this._normal;
  },
  
  
  /** 
   * Returns the plane's unit normal vector. 
   * @return {vec3}
   */
  getUnitNormal: function() {
    return this._nHat;
  },
  
  
  /** 
   * Returns the anchor point the plane passes through. 
   * @return {vec3}
   */
  getPoint: function() {
    return this._pt;
  },
  
  
  /** 
   * Returns the distance of a point to this plane. 
   * @param {vec3} pt
   * @return number
   */
  distToPt: function(pt) {
    var w = vec3.sub(vec3.create(), pt, this._pt);
    var wLen = vec3.len(w);
    if(wLen == 0) {
      return 0;
    }
    
    var wHat = vec3.normalize(vec3.create(), w);
    var dot = vec3.dot(wHat, this._nHat);
    
    return Math.abs(wLen*dot);
  },
  
  
  /** 
   * Returns the coefficients a, b, c, and d that describe this plane in the 
   * standard equation for a plane: ax + by + cz + d = 0.
   * @return {array: [number, number, number, number]}
   */
  getCoefficients: function() {
    var a = this._normal[0];
    var b = this._normal[1];
    var c = this._normal[2];
    
    var x = this._pt[0];
    var y = this._pt[1];
    var z = this._pt[2];
    
    var d = -a*x - b*y - c*z;
    
    return [a, b, c, d];
  },
  
  
  /** 
   * Returns a vector that is parallel to the plane. 
   * @return {vec3}
   */
  getParallelVector: function() {
    var p1 = this._pt;
    var p2;
    if(this._normal[0] == 0) {
      p2 = [p1[0] + 1, p1[1], p1[2]];
    }
    else if(this._normal[1] == 0) {
      p2 = [p1[0], p1[1] + 1, p1[2]];
    }
    else if(this._normal[2] == 0) {
      p2 = [p1[0], p1[1], p1[2] + 1];
    }
    else {
      var coeffs = this.getCoefficients();
      
      var x = p1[0]+1;
      var y = 0;
      var z = (-coeffs[0]*x-coeffs[3])/coeffs[2];
      
      p2 = [x, y, z];
    }
    
    return vec3.sub(vec3.create(), p2, p1);
  },
  
  
  /** 
   * Determines if this plane contains the specified point.
   * A point is contained by the plane if its distance to the plane is within
   * some tolerance close to 0.
   * @param {vec3} pt
   * @param {ufloat) tolerance  Optional. Default 0.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var c = this.getCoefficients();
    var result = c[0]*pt[0] + c[1]*pt[1] + c[2]*pt[2] + c[3];
    
    return (Math.abs(result) < tolerance);
  },
  
  
  
  /** 
   * Returns an indicator for the position of a point relative to this plane.  
   * 1 indicates that the point lies above the plane in the direction of its
   * normal vector. -1 indicates that the point lies below the plane in the 
   * direction of its inverse normal vector. 0 indicates that the 
   * point lies on the plane, but is prone to rounding error.
   * @param {vec3} pt
   * @return {int}
   */
  ptRelative: function(pt) {
    var u = vec3.sub(vec3.create(), pt, this._pt);
    vec3.normalize(u, u);
    
    var dot = vec3.dot(this._nHat, u);
    
    if(dot > 0) {
      return 1;
    }
    else if(dot < 0) {
      return -1;
    }
    else {
      return 0;
    }
  },
  
  /** 
   * Tests if a point lies above the plane in the direction 
   * of its normal vector.
   * @param {vec3} pt
   * @return {boolean}
   */
  ptIsAbove: function(pt) {
    return (ptRelative(pt) == 1);
  },
  
  /** 
   * Tests if a point lies below the plane in the direction 
   * of its inverse normal vector.
   * @param {vec3} pt
   * @return {boolean}
   */
  ptIsBelow: function(pt) {
    return (ptRelative(pt) == -1);
  },
  
  
  /** 
   * Determines the intersection of a line with this plane. There are 3 possible
   * returned values: A point (vec3} if the line intersects the plane at a
   * single point (the most common case), the line if the line lies in the
   * plane, or undefined if the line is parallel to the plane but not in it.
   * See http://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
   * @param {TentaGL.Math.Line3D} line
   * @return {vec3, TentaGL.Math.Line3D, or undefined}
   */
  lineIntersection: function(line) {
    var q = this.getPoint();
    var p = line.getPt1();
    
    var n = this.getNormal();
    var u = line.getVec3();
    
    var numer = vec3.dot(n, vec3.sub(vec3.create(), q, p));
    var denom = vec3.dot(n, u);
    
    if(denom == 0) {
      if(numer == 0) {
        return line;
      }
      else {
        return undefined;
      }
    }
    else {
      var s = numer/denom;
      
      var x = p[0] + s*u[0];
      var y = p[1] + s*u[1];
      var z = p[2] + s*u[2];
      
      return vec4.fromValues(x, y, z, 1);
    }
  },
  
  
  /**  
   * A plane is infinite, and therefore unbounded. So this returns undefined.
   */
  getBoundingBox: function() {
    return undefined;
  },
  
  
  
  /** 
   * TODO: Renders the plane (only the region bounded by the viewing volume).
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    TentaGL.ViewTrans.push(gl);
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    // TODO: Create the a custom model for the plane bounded by the viewing volume.
    // 1) Transform plane to projection coordinates. 
    // 2) Create quad from points where the plane intersects the cube.
    // 3) Transform the quad back to world coordinates.
    // 4) Render the quad.
    
    TentaGL.ViewTrans.pop(gl);
  }
  
};


Util.Inheritance.inherit(TentaGL.Math.Plane, TentaGL.Math.Shape3D);

