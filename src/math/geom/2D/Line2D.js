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
 * A finite line in 2D space.
 * @param {vec2} p1
 * @param {vec2} p2
 */
TentaGL.Math.Line2D = function(p1, p2) {
  this._p1 = vec2.copy([], p1);
  this._p2 = vec2.copy([], p2);
  
  this._updateMetrics();
};

TentaGL.Math.Line2D.prototype = {
  
  constructor: TentaGL.Math.Line2D,
  
  isaLine2D: true,
  
  
  /** 
   * Returns a clone of the line. 
   * @return TentaGL.Math.Line2D
   */
  clone: function() {
    return new TentaGL.Math.Line2D(this._p1, this._p2);
  },
  
  
  _updateMetrics: function() {
    this._length = vec2.dist(this._p1, this._p2);
  },
  
  
  //////// Metrics
  
  /** 
   * Returns the first point of the line. 
   * @return {vec3}
   */
  getPt1: function() {
    return this._p1;
  },
  
  
  /** 
   * Returns the second point of the line.
   * @return {vec3}
   */
  getPt2: function() {
    return this._p2;
  },
  
  
  /** 
   * Setter/getter for the 1st point.
   * @param {vec2} xy   Optional.
   * @return {vec2} 
   */
  pt1: function(xy) {
    if(xy) {
      this._p1 = vec2.copy([], xy);
      this._updateMetrics();
    }
    return this._p1.slice(0);
  },
  
  
  /** 
   * Setter/getter for the 2nd point.
   * @param {vec2} xy   Optional.
   * @return {vec2} 
   */
  pt2: function(xy) {
    if(xy) {
      this._p2 = vec2.copy([], xy);
      this._updateMetrics();
    }
    return this._p2.slice(0);
  },
  
  
  /** 
   * Returns the length of this line. 
   * @return {number}
   */
  getLength: function() {
    return this._length;
  },
  
  
  /** 
   * Returns the vector component of the line defined by v = p2 - p1.
   * @return {vec2}
   */
  getVec2: function() {
    return vec2.sub([], this._p2, this._p1);
  },
  
  
  /** 
   * Returns the angle, in radians in the range [-PI, PI], formed from this 
   * line's vector and the vector of the positive X axis. 
   * @return {number}
   */
  getAngle: function() {
    var v = this.getVec2();
    return Math.atan2(v[1], v[0]);
  },
  
  
  
  //////// Distance
  
  
  /** 
   * Returns the distance of a point to this line.
   * @param {vec3} pt
   */
  distToPt: function(pt) {
    var u = this.getVec2();
    var v = vec2.sub(vec2.create(), pt, this._p1);
    var w = vec2.sub(vec2.create(), pt, this._p2);
    
    if(vec2.dot(u, v) <= 0) {
      return vec2.len(v);
    }
    else if(vec2.dot(u, w) >= 0) {
      return vec2.len(w);
    }
    else {
      var uHat = vec2.normalize([], u);
      var vHat = vec2.normalize([], v);
      var cross = vec2.cross([], uHat, vHat);
      
      return vec2.len(v)*vec3.len(cross);
    }
  },
  
  
  /** 
   * Returns the distance from this line to another. 
   * @param {TentaGL.Math.Line2D} line
   * @return {number}
   */
  distToLine: function(line) {
    if(this.intersects(line)) {
      return 0;
    }
    
    var d1 = this.distToPt(line._p1);
    var d2 = this.distToPt(line._p2);
    var d3 = line.distToPt(this._p1);
    var d4 = line.distToPt(this._p2);
    
    return Math.min(d1, d2, d3, d4);
  },
  
  
  
  //////// Intersection
  
  
  /**
   * Returns true iff the line contains some point.
   * @param {vec3} pt
   * @param {float} tolerance   Optional.
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    return (this.distToPt(pt) <= tolerance);
  },
  
  
  /** 
   * Returns true iff this line intersects the other line.
   * @param {TentaGL.Math.Line2D} line
   * @return {boolean}
   */
  intersects: function(line) {
    return (this.intersection(line) != undefined);
  },
  
  
  /** 
   * Returns the intersection between this line and another, or 
   * undefined if they don't intersect. This may be a point (vec2), or it could be 
   * another Line2D if they are collinear.
   * @param {TentaGL.Math.Line2D} line
   * @param {float} tolerance   Optional.
   * @return {vec2 | TentaGL.Math.Line2D}
   */
  intersection: function(line, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var w = vec2.sub([], line._p1, this._p1);
    var u = this.getVec2();
    var v = line.getVec2();
    
    if(TentaGL.Math.vectorsParallel(u, v)) {
      // The lines are parallel. Return the overlapping segment.
      var p = this._p1;
      var r = vec2.add([], p, u);
      
      var q = line._p1;
      var s = vec2.add([], q, v);
      
      var hasQ = this.containsPt(q, tolerance);
      var hasS = this.containsPt(s, tolerance);
      
      var hasP = line.containsPt(p, tolerance);
      var hasR = line.containsPt(r, tolerance);
      
      if(hasQ && hasS) {
        return new TentaGL.Math.Line2D(q,s);
      }
      else if(hasQ && hasP) {
        return new TentaGL.Math.Line2D(q,p);
      }
      else if(hasQ && hasR) {
        return new TentaGL.Math.Line2D(q,r);
      }
      else if(hasS && hasP) {
        return new TentaGL.Math.Line2D(s,p);
      }
      else if(hasS && hasR) {
        return new TentaGL.Math.Line2D(s,r);
      }
      else if(hasP && hasR) {
        return new TentaGL.Math.Line2D(p, r);
      }
      else {
        return undefined;
      }
    }
    else {
      var m = [];
      m = m.concat(u);
      m = m.concat(vec2.negate([], v));
      var mInv = mat2.invert([], m);
      
      var coeffs = vec2.transformMat2([], w, mInv);
      var a = coeffs[0];
      var b = coeffs[1];
      if(a >= 0 && a <= 1 && b >= 0 && b <= 1) {
        return vec2.add([], this._p1, vec2.scale([], u, a));
      }
      else {
        return undefined;
      }
    }
  },
  
  

  
  //////// Transformation
  
  /** 
   * Transforms the points of this line segment using the provided transform 
   * matrix. 
   * @param {mat3} m
   */
  transformMat3: function(m) {
    var p1 = vec3.clone(this._p1);
    p1 = vec3.transformMat3(vec3.create(), p1, m);
    
    var p2 = vec3.clone(this._p2);
    vec3.transformMat3(p2, p2, m);
    
    return new TentaGL.Math.Line2D(p1, p2);
  },
  
  
  /** 
   * Transforms the points of this line segment using the provided transform 
   * matrix. 
   * @param {mat4} m
   */
  transformMat4: function(m) {
    var p1 = vec3.clone(this._p1);
    vec3.transformMat4(p1, p1, m);
    
    var p2 = vec3.clone(this._p2);
    vec3.transformMat4(p2, p2, m);
    
    return new TentaGL.Math.Line2D(p1, p2);
  },
  
  
  //////// Axis of separation
  
  /**  
   * Returns an indicator of where the specified point lies in relation to 
   * this line. 1 indicates that the segment must be rotated in the direction
   * from +X to -Y to point towards the point. -1 Indicates that the segment
   * must be rotated from +X to +Y. 0 Indicates that the point lies exactly
   * on the line, if it were projected infinitely in both of its directions.
   * 0 is rare, however and likely will involve rounding errors. So it is
   * not recommended for testing collinearness.
   * @param {vec3} pt
   * @return {int}
   */
  relativeCCW: function(pt) {
    var u = this.getVec2();
    var v = vec3.sub(vec3.create(), pt, this._p1);
    var cross = vec3.cross(v, u, v);
    
    if(cross[2] > 0) {
      return -1;
    }
    else if(cross[2] < 0) {
      return 1;
    }
    else {
      return 0;
    }
  },
  
  
  /** 
   * Tests if this point lies "above" the vector of the line. This, of course,
   * depends upon the direction of the Y axis.
   * @param {vec3} pt
   * @param {boolean} yIsDown   Optional. If true, then Y increases downwards 
   *      in our coordinate system. Default false.
   * @return {boolean}
   */
  ptIsAbove: function(pt, yIsDown) {
    var rccw = this.relativeCCW(pt);
    
    if(yIsDown) {
      rccw *= -1;
    }
    
    return (rccw < 0);
  },
  
  /** 
   * Tests if this point lies "below" the vector of the line. This, of course,
   * depends upon the direction of the Y axis.
   * @param {vec3} pt
   * @param {boolean} yIsDown   Optional. If true, then Y increases downwards 
   *      in our coordinate system. Default false.
   * @return {boolean}
   */
  ptIsBelow: function(pt, yIsDown) {
    var rccw = this.relativeCCW(pt);
    
    if(yIsDown) {
      rccw *= -1;
    }
    
    return (rccw > 0);
  },
  
  //////// Rendering
  
  
  /** 
   * Renders this line into the scene. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName   Optional.
   */
  render: function(gl, materialName) {
    var p1 = vec3.clone(this._p1);
    p1[2] = 0;
    
    var p2 = vec3.clone(this._p2);
    p2[2] = 0;
    
    var dx = p2[0] - p1[0];
    var dy = p2[1] - p1[1];
    
    TentaGL.ViewTrans.push(gl);
    
    var m = mat4.create();
    mat4.translate(m, m, [p1[0], p1[1], 0]);
    mat4.scale(m, m, [dx, dy, 0]);
    
    TentaGL.ViewTrans.mul(gl, m);
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    TentaGL.ModelLib.render(gl, "unitLine");
    
    TentaGL.ViewTrans.pop(gl);
  }
  
};


