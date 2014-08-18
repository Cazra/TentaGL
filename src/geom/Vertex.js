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
 * Constructs a Vertex given its XYZ coordinates. A fourth homogeneous
 * coordinate is also created, set to 1 to allow for translation affine
 * transformations on the vertex.
 * Most types of data for a vertex are stored as vec2s, vec3s, or vec4s from 
 * the gl-matrix.js framework. In essence though, these are just Float32Arrays.
 * When first constructed, the vertex only has a field for its xyz coordinates.
 * Other fields such as its normal vector and color get added on as they 
 * become used.
 * To construct the vertex, each of the coordinates can be provided separately, 
 * or in a 3-element array.
 * @constructor
 * @param {Number || vec3} x
 * @param {Number} y
 * @param {Number} z
 */
TentaGL.Vertex = function(x, y, z) {
  if(x.length) {
    z = x[2];
    y = x[1];
    x = x[0];
  }
  
  this._xyz = vec4.fromValues(x, y, z, 1);
  this._texST = vec2.fromValues(0, 0);
  this._normal = vec3.fromValues(0, 0, 0);
  this._tangental = vec3.fromValues(0, 0, 0);
}

TentaGL.Vertex.prototype = {
  
  constructor:TentaGL.Vertex, 
  
  /** 
   * Returns a copy of the vertex's homogeneous XYZW coordinates. 
   * @return {vec4}
   */
  getXYZ:function() {
    return vec4.clone(this._xyz);
  },
  
  
  /**
   * Returns the vertex's X coordinate.
   * @return {Number}
   */
  getX:function() {
    return this._xyz[0];
  },
  
  /**
   * Returns the vertex's Y coordinate.
   * @return {Number}
   */
  getY:function() {
    return this._xyz[1];
  },
  
  /**
   * Returns the vertex's Z coordinate.
   * @return {Number}
   */
  getZ:function() {
    return this._xyz[2];
  },
  
  
  
  /** 
   * Sets the vertex's X coordinate. 
   * @param {Number} x
   */
  setX:function(x) {
    this._xyz[0] = x;
  },
  
  /** 
   * Sets the vertex's Y coordinate. 
   * @param {Number} y
   */
  setY:function(y) {
    this._xyz[1] = y;
  },
  
  /** 
   * Sets the vertex's Z coordinate. 
   * @param {Number} z
   */
  setZ:function(z) {
    this._xyz[2] = z;
  },
  
  
  /** 
   * Setter/getter for the vertex's xyzw position. 
   * @param {vec3} xyz  Optional.
   * @return {vec4}
   */
  xyz: function(xyz) {
    if(xyz !== undefined) {
      this._xyz = vec4.fromValues(xyz[0], xyz[1], xyz[2], 1);
    }
    return vec4.clone(this._xyz);
  },
  
  
  
  /** 
   * Returns a copy of this vertex's 2D texture coordinates array.
   * If this vertex's 2D texture coordinates are undefined, an Error is thrown.
   * @return {vec2}
   */
  getTexST:function() {
    return vec2.clone(this._texST);
  },
  
  
  /** 
   * Returns true iff 2D texture coordsinates have been defined for this vertex. 
   * @return {boolean}
   */
  hasTexST: function() {
    return (this._texST != undefined);
  },
  
  
  /**
   * Sets the 2D texture coordinates for this vertex.
   * @param {Number} s
   * @param {Number} t
   */
  setTexST:function(s, t) {
    this._texST = vec2.fromValues(s, t);
  },
  
  /** 
   * Returns the vertex's 2D texture coordinate S. 
   * @return {Number}
   */
  getTexS:function() {
    return this._texST[0];
  },
  
  /** 
   * Returns the vertex's 2D texture coordinate T. 
   * @return {Number}
   */
  getTexT:function() {
    return this._texST[1];
  },
  
  
  /** 
   * Setter/getter for the texture coordinates. 
   */
  st: function(st) {
    if(st !== undefined) {
      this._texST = vec2.fromValues(st[0], st[1]);
    }
    return vec2.clone(this._texST);
  },
  
  
  
  /** 
   * Returns a copy of this vertex's surface normal vector. If this vertex's 
   * surface normal vector has not yet been defined, an Error is thrown.
   * @return {vec3}
   */
  getNormal:function() {
    return vec3.clone(this._normal);
  },
  
  
  /** 
   * Returns true iff the surface normal vector has been defined for this vertex. 
   * @return {boolean}
   */
  hasNormal: function() {
    return (this._normal != undefined);
  },
  
  
  /** 
   * Sets the surface normal vector for this vertex. The stored vector becomes 
   * normalized.
   * @param {Number} x  Normalized x component.
   * @param {Number} y  Normalized y component.
   * @param {Number} z  Normalized z component.
   */
  setNormal:function(x, y, z) {
    this._normal = vec3.fromValues(x, y, z);
    this._normal = vec3.normalize(this._normal, this._normal);
  },
  
  
  /** 
   * Setter/getter for the normal vector. 
   * @param {vec3} xyz
   * @return {vec3}
   */
  normal: function(xyz) {
    if(xyz !== undefined) {
      this._normal = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
    }
    return vec3.clone(this._normal);
  },
  
  
  
  /** 
   * Returns a copy of this vertex's surface tangental vector. If this vertex's
   * surface tangental vector has not yet been defined, an Error is thrown.
   * @return {vec3}
   */
  getTangental:function() {
    return vec3.clone(this._tangental);
  },
  
  
  /** 
   * Returns true iff this vertex's tangental vector is undefined. 
   * @return {boolean}
   */
  hasTangental: function() {
    return (this._tangental !== undefined);
  },
  
  
  /** 
   * Computes (but doesn't set) the surface tangental vertex of this vertex, using the texture 
   * coordinates of this vertex and two vertices it shares a polygon with.
   * @param {TentaGL.Vertex} v2
   * @param {TentaGL.Vertex} v3
   * @return {vec3}
   */
  computeTangental:function(v2, v3) {
    var u = vec3.sub(vec3.create(), v2.xyz(), this.xyz());
    var v = vec3.sub(vec3.create(), v3.xyz(), this.xyz());
    
    var su = v2.getTexS() - this.getTexS();
    var sv = v3.getTexS() - this.getTexS();
    var tu = v2.getTexT() - this.getTexT();
    var tv = v3.getTexT() - this.getTexT();
    var dst = tv*su - tu*sv;
    if(dst == 0) {
      return vec3.fromValues(1, 0, 0);
    }
    else {
      var tang = vec3.create();
      vec3.scale(tang, u, tv);
      vec3.sub(tang, tang, vec3.scale(vec3.create(), v, tu));
      vec3.scale(tang, tang, 1/dst);
      
      var t = tang;
      if(vec3.length(tang) == 0) {
        return vec3.fromValues(1, 0, 0);
      }
      
      return tang;
    }
  },
  
  
  /** 
   * Sets the tangental vector for this vertex. It is advised to set this by 
   * using the result values from a call to computeTangental. The stored
   * vector becomes normalized.
   * @param {vec3} xyz
   */
  setTangental:function(xyz) {
    this._tangental = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
    this._tangental = vec3.normalize(this._tangental, this._tangental);
  },
  
  
  /** 
   * Setter/getter for the tangental vector. 
   * @param {vec3} xyz    Optional.
   * @return {vec3}
   */
  tangental: function(xyz) {
    if(xyz !== undefined) {
      this._tangental = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
    }
    return vec3.clone(this._tangental);
  },
  
  
  
  /** 
   * Returns a deep clone of this Vertex. 
   * @return {TentaGL.Vertex}
   */
  clone:function() {
    return this.transform(mat4.create());
  },
  
  
  /**
   * Returns a new Vertex resulting from this Vertex being transformed by 
   * an affine transformation matrix. This is essentially a transformed deep 
   * clone.
   * @param {mat4} transform  The affine transformation matrix being applied to
   *      this vertex.
   * @return {TentaGL.Vertex} The transformed copy of this vertex.
   */
  transform:function(transform) {
  //  console.log("transform vertex!");
  //  console.log("  transform: " + Util.Debug.arrayString(transform));
  //  console.log("  old XYZ: " + this.getX() + ", " + this.getY() + ", " + this.getZ());
    
    var xyz = vec4.transformMat4(vec4.create(), this.xyz(), transform);
    var result = new TentaGL.Vertex(xyz[0], xyz[1], xyz[2]);
    
  //  console.log("  new XYZ: " + xyz[0] + ", " + xyz[1] + ", " + xyz[2]);
    
    if(this._normal !== undefined) {
      // We need to turn normal from a vec3 into a vec4 before it can be matrix-multiplied.
      var normal = this.getNormal();
      normal = vec4.fromValues(normal[0], normal[1], normal[2], 0);
      normal = vec4.transformMat4(normal, normal, transform);
      result.setNormal(normal[0], normal[1], normal[2]);
    }
    
    if(this._tangental !== undefined) {
      // We need to turn tangental from a vec3 into a vec4 before it can be matrix-multiplied.
      var tang = this.getTangental();
      tang = vec4.fromValues(tang[0], tang[1], tang[2], 0);
      tang = vec4.transformMat4(tang, tang, transform);
      result.setTangental(tang[0], tang[1], tang[2]);
    }
    
    if(this._texST !== undefined) {
      result.setTexST(this.getTexS(), this.getTexT());
    }
    
    return result;
  }


};

