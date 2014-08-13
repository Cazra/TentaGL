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
 * @param {vec3} p1
 * @param {vec3} p2
 */
TentaGL.Math.Line3D = function(p1, p2) {
  this._p1 = vec3.clone(p1);
  this._p1[3] = 1;
  
  this._p2 = vec3.clone(p2);
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
   * Returns the length of the line.
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
    return vec3.sub([], this._p2, this._p1);
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
   * @param {vec3} pt
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
  },
  
  
  /** 
   * Returns the distance between this line and another line. 
   * // TODO: account for segment distance. Currently, it assumes each line is infinite in length.
   * @param {TentaGL.Math.Line3D} line
   * @return {number}
   */
  distToLine: function(line) {
    var p = vec4.clone(this._p1); // p' = p + r*u
    var u = this.getVec3();
    
    var q = vec4.clone(line._p1); // q' = q + s*v
    q[3] = 1;
    var v = line.getVec3();
    
    // To make this problem easier to solve, we will transform our system such 
    // that p is at the origin and u = [1, 0, 0].
    var rotateQ = TentaGL.Math.getQuatFromTo(u, [1,0,0]);
    var rotate = mat4.fromQuat(mat4.create(), rotateQ);
    
    var trans = mat4.create();
    mat4.translate(trans, trans, vec3.negate([], p));
    
    var scale = mat4.create();
    var scaleAmt = 1/vec3.length(u);
    mat4.scale(scale, scale, [scaleAmt, scaleAmt, scaleAmt]);
    
    var m = mat4.mul(mat4.create(), rotate, trans);
    mat4.mul(m, scale, m);
    
    var qq = vec4.transformMat4(vec4.create(), q, m); // qq' = qq + s*vv
    var vv = vec3.transformMat4(vec3.create(), v, m);
    
    console.log(u, v, q, m, trans, scale, rotate, vec3.length(u));
    
    // Next, we apply some calculus and linear algebra to solve a system of 
    // differential equations...
    // We'll figure out the parametric values for the two closest points in the 
    // transformed system. Which we can then use to calculate the distance back
    // in our original system.
    // How I figured this out is left as an excercise for other math nerds.
    var m = mat2.create();
    m[0] = vv[0]*vv[0] + vv[1]*vv[1] + vv[2]*vv[2];
    m[1] = vv[0];
    m[2] = vv[0];
    m[3] = 1;
    mat2.invert(m,m);
    
    var t = vec2.fromValues(-vec3.dot(qq, vv), -qq[0]);
  //  console.log(t, m);
    
    var sr = vec2.transformMat2(vec2.create(), t, m);
    
    var ppp = vec3.add(vec3.create(), p, vec3.scale(vec3.create(), u, sr[1]));
    var qqq = vec3.add(vec3.create(), q, vec3.scale(vec3.create(), v, sr[0]));
    
    return vec3.dist(ppp, qqq);
  },

  
  //////// Collisions
  
  /** 
   * Returns true iff the specified point lies on this line, 
   * within some tolerance. 
   * @param {vec3} pt
   * @param {float} tolerance
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    return (this.distToPt(pt) <= tolerance);
  },
  
  
  /** 
   * Returns the bounding box of the line.
   * @return {TentaGL.Math.Rect3D}
   */
  getBoundingBox: function() {
    var left, right;
    if(this._p1[0] <= this._p2[0]) {
      left = this._p1[0];
      right = this._p2[0];
    }
    else {
      left = this._p2[0];
      right = this._p1[0];
    }
    var width = right - left;
    
    var bottom, top;
    if(this._p1[1] <= this._p2[1]) {
      bottom = this._p1[1];
      top = this._p2[1];
    }
    else {
      bottom = this._p2[1];
      top = this._p1[1];
    }
    var height = top - bottom;
    
    var back, front;
    if(this._p1[2] <= this._p2[2]) {
      back = this._p1[2];
      front = this._p2[2];
    }
    var depth = front - back;
    
    return new TentaGL.Math.Rect3D([left, bottom, back], width, height, depth);
  },
  
  
  //////// Rendering
  
  
  /** 
   * Renders the line. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    var p1 = vec3.clone(this._p1);
    var p2 = vec3.clone(this._p2);
    var v = this.getVec3();
    
    TentaGL.ViewTrans.push(gl);
    
    TentaGL.ViewTrans.translate(gl, p1);
    TentaGL.ViewTrans.scale(gl, v);
    
    TentaGL.ViewTrans.updateMVPUniforms(gl);
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    TentaGL.ModelLib.render(gl, "unitLine");
    
    TentaGL.ViewTrans.pop(gl);
  }
  
};


Util.Inheritance.inherit(TentaGL.Math.Line3D, TentaGL.Math.Shape3D);


