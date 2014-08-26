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
 * A 3D triangle defined by 3 points A, B, and C.
 * @constructor
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 */
TentaGL.Math.Triangle3D = function(a, b, c) {
  this._a = vec3.copy([], a);
  this._b = vec3.copy([], b);
  this._c = vec3.copy([], c);
  
  this._updateMetrics();
};

TentaGL.Math.Triangle3D.prototype = {
  
  constructor: TentaGL.Math.Triangle3D,
  
  isaTriangle3D: true,
  
  
  _updateMetrics: function() {
    this._angleA = this._computeAngle(this._a, this._b, this._c);
    this._angleB = this._computeAngle(this._b, this._a, this._c);
    this._angleC = this._computeAngle(this._c, this._a, this._b);
    
    this._lenA = vec3.dist(this._b, this._c);
    this._lenB = vec3.dist(this._a, this._c);
    this._lenC = vec3.dist(this._a, this._b);
  },
  
  
  _computeAngle: function(p, q, r) {
    var u = vec3.sub([], q, p);
    vec3.normalize(u, u);
    
    var v = vec3.sub([], r, p);
    vec3.normalize(v, v);
    
    return Math.acos(vec3.dot(u, v));
  },
  
  
  //////// Metrics
  
  /** 
   * Setter/getter for point A. 
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  ptA: function(xyz) {
    if(xyz) {
      this._a = vec3.copy([], xyz);
      this._updateMetrics();
    }
    return this._a.slice(0);
  },
  
  /** 
   * Setter/getter for point B. 
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  ptB: function(xyz) {
    if(xyz) {
      this._b = vec3.copy([], xyz);
      this._updateMetrics();
    }
    return this._b.slice(0);
  },
  
  /** 
   * Setter/getter for point C. 
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  ptC: function(xyz) {
    if(xyz) {
      this._c = vec3.copy([], xyz);
      this._updateMetrics();
    }
    return this._c.slice(0);
  },
  
  
  /** 
   * Returns the angle between the sides adjacent to point A.
   * @return {float}  Range [0, PI)
   */
  getAngleA: function() {
    return this._angleA;
  },
  
  /** 
   * Returns the angle between the sides adjacent to point B.
   * @return {float}  Range [0, PI)
   */
  getAngleB: function() {
    return this._angleB;
  },
  
  
  /** 
   * Returns the angle between the sides adjacent to point B.
   * @return {float}  Range [0, PI)
   */
  getAngleC: function() {
    return this._angleC;
  },
  
  
  
  /** 
   * Returns the side opposite of point A. 
   * @return {TentaGL.Math.Line3D}
   */
  getSideA: function() {
    return new TentaGL.Math.Line3D(this._b, this._c);
  },
  
  
  /** 
   * Returns the side opposite of point B. 
   * @return {TentaGL.Math.Line3D}
   */
  getSideB: function() {
    return new TentaGL.Math.Line3D(this._a, this._c);
  },
  
  
  /** 
   * Returns the side opposite of point C. 
   * @return {TentaGL.Math.Line3D}
   */
  getSideC: function() {
    return new TentaGL.Math.Line3D(this._a, this._b);
  },  
  
  
  /** 
   * Returns the length of the side opposite of point A. 
   * @return {float}
   */
  getLengthA: function() {
    return this._lenA;
  },
  
  
  /** 
   * Returns the length of the side opposite of point B. 
   * @return {float}
   */
  getLengthB: function() {
    return this._lenB;
  },
  
  
  /** 
   * Returns the length of the side opposite of point C. 
   * @return {float}
   */
  getLengthC: function() {
    return this._lenC;
  },
  
  
  /** 
   * Returns the perimeter of the triangle. 
   * @return {float}
   */
  getPerimeter: function() {
    return this._lenA + this._lenB + this._lenC;
  },
  
  
  /** 
   * Returns the area of the triangle, using Heron's formula. 
   * See: http://en.wikipedia.org/wiki/Heron's_formula
   * @return {number}
   */
  getArea: function() {
    var s = this.getPerimeter()/2;
    return Math.sqrt(s*(s-this._lenA)*(s-this._lenB)*(s-this._lenC));
  },
  
  
  /** 
   * Returns the triangle's unit normal vector. 
   * This is the normalized cross product of vectors AB and AC.
   * @return {vec3}
   */
  getNormal: function() {
    var u = vec3.sub([], this._b, this._a);
    var v = vec3.sub([], this._c, this._a);
    return vec3.cross([], u, v);
  },
  
  
  /** 
   * Returns the plane this triangle lies on. 
   * @return {TentaGL.Math.Plane}
   */
  getPlane: function() {
    return new TentaGL.Math.Plane(this.getNormal(), this._a);
  },
  
  
  //////// Collisions
  
  
  /** 
   * Returns the distance from a point to this triangle. 
   * @param {vec3} pt
   * @return {number}
   */
  distToPt: function(pt) {
    if(this.isPtAbove(pt)) {
      var plane = new TentaGL.Math.Plane(this.getNormal(), this._a);
      return plane.distToPt(pt);
    }
    else {
      var distA = this.getSideA().distToPt(pt);
      var distB = this.getSideB().distToPt(pt);
      var distC = this.getSideC().distToPt(pt);
      
      return Math.min(distA, distB, distC);
    }
  },
  
  
  
  /** 
   * Returns whether a point is directly above (or below) this triangle. 
   * @param {vec3} pt
   * @return {boolean}
   */
  isPtAbove: function(pt) {
    var coeffs = vec3.sub([], pt, this._a);
    var u = vec3.sub([], this._b, this._a);
    var v = vec3.sub([], this._c, this._a);
    var n = vec3.cross([], u, v);
    
    var m = [];
    m = m.concat(u);
    m = m.concat(v);
    m = m.concat(n);
    mat3.invert(m,m);
    
    vec3.transformMat3(coeffs, coeffs, m);
    return (coeffs[0] >= 0 && coeffs[1] >= 0 && coeffs[0] + coeffs[1] <= 1);
  },
  
  
  
  /** 
   * Returns true iff the specified point lies within the triangle.
   * @param {vec3} pt
   * @param {float} tolerance   The point is allowed to be this far from the triangle's plane.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
  /*
    var coeffs = vec3.sub([], pt, this._a);
    var u = vec3.sub([], this._b, this._a);
    var v = vec3.sub([], this._c, this._a);
    var n = vec3.cross([], u, v);
    
    var m = [];
    m = m.concat(u);
    m = m.concat(v);
    m = m.concat(n);
    mat3.invert(m,m);
    
    vec3.transformMat3(coeffs, coeffs, m);
    return (coeffs[0] >= 0 && coeffs[1] >= 0 && coeffs[0] + coeffs[1] <= 1 && Math.abs(coeffs[2]*vec3.length(n)) <= tolerance);
    */
    
    return (this.distToPt(pt) <= tolerance);
  },
  
  
  /** 
   * Returns the bounding box of the shape. 
   * @return {TentaGL.Math.Rect3D}
   */
  getBounds3D: function() {
    var left = Math.min(this._a[0], this._b[0], this._c[0]);
    var right = Math.max(this._a[0], this._b[0], this._c[0]);
    var width = right - left;
    
    var bottom = Math.min(this._a[1], this._b[1], this._c[1]);
    var top = Math.max(this._a[1], this._b[1], this._c[1]);
    var height = top - bottom;
    
    var back = Math.min(this._a[2], this._b[2], this._c[2]);
    var front = Math.max(this._a[2], this._b[2], this._c[2]);
    var depth = front - back;
    
    return new TentaGL.Math.Rect3D([left, bottom, back], width, height, depth);
  },
  
  
  //////// Rendering
  
  
  /** 
   * Renders the triangle. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    var a = vec3.copy([], this._a);
    var b = vec3.copy([], this._b);
    var c = vec3.copy([], this._c);
    
    var u = vec3.sub([], this._b, this._a);
    var v = vec3.sub([], this._c, this._a);
    var n = vec3.cross([], u, v);
    
    var model = new TentaGL.Model(GL_TRIANGLES, GL_NONE);

    var vertA = new TentaGL.Vertex(a);
    vertA.normal(n);
    vertA.texST([0,0]);
    model.addVertex(vertA);
    
    var vertB = new TentaGL.Vertex(b);
    vertB.normal(n);
    vertB.texST([1,0]);
    model.addVertex(vertB);
    
    var vertC = new TentaGL.Vertex(c);
    vertC.normal(n);
    vertC.texST([0.5, 1]);
    model.addVertex(vertC);
    
    model.addFace(0, 1, 2);
    
    model.render(gl, materialName);
  }
  
  
};

Util.Inheritance.inherit(TentaGL.Math.Triangle3D, TentaGL.Math.Shape3D);

