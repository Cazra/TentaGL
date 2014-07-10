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
 * @param {vec3} p1
 * @param {vec3} p2
 */
TentaGL.Math.Line2D = function(p1, p2) {
  this._p1 = vec3.clone(p1);
  this._p1[2] = 1;
  
  this._p2 = vec3.clone(p2);
  this._p2[2] = 1;
  
  this._length = vec2.dist(p1, p2);
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
   * Returns the length of this line. 
   * @return {number}
   */
  getLength: function() {
    return this._length;
  },
  
  
  /** 
   * Returns the vector component of the line defined by v = p2 - p1.
   * @return {vec3}
   */
  getVec3: function() {
    return vec3.sub(vec3.create(), this._p2, this._p1);
  },
  
  
  /** 
   * Returns the angle, in radians in the range [-PI, PI], formed from this 
   * line's vector and the vector of the positive X axis. 
   * @return {number}
   */
  getAngle: function() {
    var v = this.getVec3();
    return Math.atan2(v[1], v[0]);
  },
  
  
  
  //////// Distance
  
  
  /** 
   * Returns the distance of a point to this line.
   * @param {vec3} pt
   */
  distToPt: function(pt) {
    var u = this.getVec3();
    var v = vec2.sub(vec2.create(), pt, this._p1);
    var w = vec2.sub(vec2.create(), pt, this._p2);
    
    if(vec2.dot(u, v) <= 0) {
      return vec2.len(v);
    }
    else if(vec2.dot(u, w) >= 0) {
      return vec2.len(w);
    }
    else {
      var uHat = vec2.normalize(vec2.create(), u);
      var vHat = vec2.normalize(vec2.create(), v);
      var cross = vec2.cross(vec2.create(), uHat, vHat);
      
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
   * @param {ufloat) tolerance    Optional. Default 0.
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var u = this.getVec3();
    var s;
    if(this._length == 0) {
      s = 0;
    }
    else if(u[0] == 0) {
      s = (pt[1] - this._p1[1])/u[1];
    }
    else {
      s = (pt[0] - this._p1[0])/u[0];
    }
    
    var x = this._p1[0] + s*u[0];
    var y = this._p1[1] + s*u[1];
    
    return Math.ptsEqual(pt, [x,y], tolerance);
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
   * undefined if they don't intersect. This may be a point (vec3), or it could be 
   * another Line2D if they are collinear.
   * @param {TentaGL.Math.Line2D} line
   * @param {ufloat} tolerance
   * @return {vec3 | TentaGL.Math.Line2D}
   */
  intersection: function(line, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    // If either of the lines have a length of 0, treat them as a point.
    if(this._length == 0 && line.containsPt(this._p1)) {
      return this._p1;
    }
    else if(line._length ==0 && this.containsPt(line._p1)) {
      return line._p1;
    }
    
    // Both are lines with length > 0.
    else {

      // Transform the system so that we are comparing the other line to a unit 
      // vector facing in +X.
      var m = mat3.create();
      mat3.scale(m, m, [1/this._length, 1, 1]);
      mat3.rotate(m, m, -this.getAngle());
      mat3.translate(m, m, [-this._p1[0], -this._p1[1]]);
      
      var mInv = mat3.invert(mat3.create(), m);
      
      var tLine = line.transformMat3(m);
      var tVec = tLine.getVec3();
      
      // The transformed line is parallel to the X axis...
      if(tVec[1] == 0 && tLine._p1[1] != 0) {
        
        // but isn't on the X axis.
        if(tLine._p1[1] != 0) {
          return undefined;
        }
        
        // and is on the X axis and contains (0,0)...
        else if(tLine.containsPt([0,0], tolerance)) {
          
          // and also contains (1,0). Therefore, line completely overlaps this.
          if(tLine.containsPt([1,0], tolerance)) {
            return this.clone();
          }
          
          // but doesn't contain (1,0). Therefore, line contains part of this.
          else {
            var maxPoint = TentaGL.Math.ptsMaxX([tLine._p1, tLine._p2]);
            vec3.transformMat3(maxPoint, maxPoint, mInv);
            
            return new TentaGL.Math.Line2D(this._p1, maxPoint);
          }
        }
        
        // and is on the X axis and contains (1,0), but not (0,0). Therefore,
        // line contains part of this.
        else if(tLine.containsPt([1,0], tolerance)) {
          var minPoint = TentaGL.Math.ptsMinX([tLine._p1, tLine._p2]);
          vec3.transformMat3(minPoint, minPoint, mInv);
          
          return new TentaGL.Math.Line2D(minPoint, this._p2);
        }
      }
      
      // The transformed line is not parallel to the X axis, and therefore 
      // intersects the X axis at some point.
      else {
        
        var s = -tLine._p1[1]/tVec[1];
        var x = tLine._p1[0] + s*tVec[0];
        
        // The transformed lines intersect.
        if(x >= 0-tolerance && x <= 1+tolerance) {
          var pt = [x, 0, 1];
          vec3.transformMat3(pt, pt, mInv);
          
          return pt;
        }
        
        // The transformed lines do not intersect.
        else {
          return undefined;
        }
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
    var u = this.getVec3();
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
   * @param {string} materialName   The name of the material used to color 
   *      the line.
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
    TentaGL.ViewTrans.updateMVPUniforms(gl);
    TentaGL.MaterialLib.use(gl, materialName);
    TentaGL.ModelLib.render(gl, "unitLine");
    
    TentaGL.ViewTrans.pop(gl);
  }
  
};


