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
 * A 2D triangle defined by 3 points A, B, and C.
 * @constructor
 * @param {vec2} a
 * @param {vec2} b
 * @param {vec2} c
 */
TentaGL.Math.Triangle2D = function(a, b, c) {
  this._a = vec2.copy([], a);
  this._b = vec2.copy([], b);
  this._c = vec2.copy([], c);
  
  this._updateMetrics();
};

TentaGL.Math.Triangle2D.prototype = {
  
  constructor: TentaGL.Math.Triangle2D,
  
  isaTriangle2D: true,
  
  
  /** 
   * Returns a cloned copy of this triangle. 
   * @return {TentaGL.Math.Triangle2D}
   */
  clone: function() {
    return new TentaGL.Math.Triangle2D(this._a, this._b, this._c);
  },
  
  
  /** 
   * Returns the triangle as a Triangle3D, with z=0.
   * @return {TentaGL.Math.Triangle3D}
   */
  toTriangle3D: function() {
    var a = vec3.copy([], this._a);
    a[2] = 0;
    var b = vec3.copy([], this._b);
    b[2] = 0;
    var c = vec3.copy([], this._c);
    c[2] = 0;
    
    return new TentaGL.Math.Triangle3D(a, b, c);
  },
  
  
  
  _updateMetrics: function() {
    this._angleA = this._computeAngle(this._a, this._b, this._c);
    this._angleB = this._computeAngle(this._b, this._a, this._c);
    this._angleC = this._computeAngle(this._c, this._a, this._b);
    
    this._lenA = vec2.dist(this._b, this._c);
    this._lenB = vec2.dist(this._a, this._c);
    this._lenC = vec2.dist(this._a, this._b);
  },
  
  
  _computeAngle: function(p, q, r) {
    var u = vec2.sub([], q, p);
    vec2.normalize(u, u);
    
    var v = vec2.sub([], r, p);
    vec2.normalize(v, v);
    
    return Math.acos(vec2.dot(u, v));
  },
  
  
  //////// Metrics
  
  /** 
   * Setter/getter for point A. 
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  ptA: function(xy) {
    if(xy) {
      this._a = vec2.copy([], xy);
      this._updateMetrics();
    }
    return this._a.slice(0);
  },
  
  /** 
   * Setter/getter for point B. 
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  ptB: function(xy) {
    if(xy) {
      this._b = vec2.copy([], xy);
      this._updateMetrics();
    }
    return this._b.slice(0);
  },
  
  /** 
   * Setter/getter for point C. 
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  ptC: function(xy) {
    if(xy) {
      this._c = vec2.copy([], xy);
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
   * @return {TentaGL.Math.Line2D}
   */
  getSideA: function() {
    return new TentaGL.Math.Line2D(this._b, this._c);
  },
  
  
  /** 
   * Returns the side opposite of point B. 
   * @return {TentaGL.Math.Line2D}
   */
  getSideB: function() {
    return new TentaGL.Math.Line2D(this._a, this._c);
  },
  
  
  /** 
   * Returns the side opposite of point C. 
   * @return {TentaGL.Math.Line2D}
   */
  getSideC: function() {
    return new TentaGL.Math.Line2D(this._a, this._b);
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
   */
  getArea: function() {
    var s = this.getPerimeter()/2;
    return Math.sqrt(s*(s-this._lenA)*(s-this._lenB)*(s-this._lenC));
  },
  
  
  //////// Collisions
  
  /** 
   * Returns true iff the specified point lies within the triangle.
   * @param {vec2} pt
   * @return {boolean}
   */
  containsPt: function(pt) {
    var coeffs = vec2.sub([], pt, this._a);
    var u = vec2.sub([], this._b, this._a);
    var v = vec2.sub([], this._c, this._a);
    
    var m = [];
    m = m.concat(u);
    m = m.concat(v);
    mat2.invert(m,m);
    
    vec2.transformMat2(coeffs, coeffs, m);
    var alpha = coeffs[0] + coeffs[1];
    return (alpha >= 0 && alpha <= 1);
  },
  
  
  /** 
   * Returns the bounding box of the shape. 
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {
    var left = Math.min(this._a[0], this._b[0], this._c[0]);
    var right = Math.max(this._a[0], this._b[0], this._c[0]);
    var width = right - left;
    
    var bottom = Math.min(this._a[1], this._b[1], this._c[1]);
    var top = Math.max(this._a[1], this._b[1], this._c[1]);
    var height = top - bottom;
    
    return new TentaGL.Math.Rect2D([left, bottom], width, height);
  },
  
  
  //////// Rendering
  
  
  /** 
   * Renders the triangle. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    var a = vec2.copy([], this._a);
    a[2] = 0;
    var b = vec2.copy([], this._b);
    b[2] = 0;
    var c = vec2.copy([], this._c);
    c[2] = 0;
    
    var u = vec2.sub([], this._b, this._a);
    var v = vec2.sub([], this._c, this._a);
    var n = vec2.cross([], u, v);
    
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

Util.Inheritance.inherit(TentaGL.Math.Triangle2D, TentaGL.Math.Shape2D);

