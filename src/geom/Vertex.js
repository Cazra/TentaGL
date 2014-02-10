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
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
TentaGL.Vertex = function(x, y, z) {
  this._xyz = vec4.fromValues(x, y, z, 1);
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
   * Sets the vertex's XYZ coordinates.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  setXYZ:function(x, y, z) {
    this._xyz[0] = x;
    this._xyz[1] = y;
    this._xyz[2] = z;
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
   * Returns a copy of this vertex's 2D texture coordinates array.
   * If this vertex's 2D texture coordinates are undefined, an Error is thrown.
   * @return {vec2}
   */
  getTexST:function() {
    if(this._texST === undefined) {
      var msg = "Vertex 2D texture coordinates have not been defined.";
      throw Error(msg);
    }
    else {
      return vec2.clone(this._texST);
    }
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
   * Returns a copy of this vertex's surface normal vector. If this vertex's 
   * surface normal vector has not yet been defined, an Error is thrown.
   * This vector might not be normalized.
   * @return {vec3}
   */
  getNormal:function() {
    if(this._normal === undefined) {
      var msg = "Vertex surface normal has not been defined.";
      throw Error(msg);
    }
    else {
      return vec3.clone(this._normal);
    }
  },
  
  /** 
   * Sets the surface normal vector for this vertex. 
   * @param {Number} x  Normalized x component.
   * @param {Number} y  Normalized y component.
   * @param {Number} z  Normalized z component.
   */
  setNormal:function(x, y, z) {
    this._normal = vec3.fromValues(x, y, z);
  },
  
  
  
  
  /** 
   * Returns a copy of this vertex's surface tangental vector. If this vertex's
   * surface tangental vector has not yet been defined, an Error is thrown.
   * This vector might not be normalized.
   * @return {vec3}
   */
  getTangental:function() {
    if(this._tangental === undefined) {
      var msg = "Vertex surface tangental has not been defined.";
      throw Error(msg);
    }
    else {
      return vec3.clone(this._tangental);
    }
  },
  
  /** 
   * Computes (but doesn't set) the surface tangental vertex of this vertex, using the texture 
   * coordinates of this vertex and two vertices it shares a polygon with.
   * @param {TentaGL.Vertex} v2
   * @param {TentaGL.Vertex} v3
   */
  computeTangental:function(v2, v3) {
    var u = vec3.fromValues(v2.getX() - this.getX(), 
                            v2.getY() - this.getY(), 
                            v2.getZ() - this.getZ());
    var v = vec3.fromValues(v3.getX() - this.getX(), 
                            v3.getY() - this.getY(), 
                            v3.getZ() - this.getZ());
    
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
      return tang;
    }
  },
  
  
  /** 
   * Sets the tangental vector for this vertex. It is advised to set this by 
   * using the result values from a call to computeTangental.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  setTangental:function(x, y, z) {
    this._tangental = vec3.fromValues(x, y, z);
  },
  
  
  /**
   * Returns a new Vertex resulting from this Vertex being transformed by 
   * an affine transformation matrix.
   * @param {mat4} transform  The affine transformation matrix being applied to
   *      this vertex.
   * @return {TentaGL.Vertex} The transformed copy of this vertex.
   */
  transform:function(transform) {
    var xyz = vec4.transformMat4(vec4.create(), this.getXYZ(), transform);
    var result = new TentaGL.Vertex(xyz[0], xyz[1], xyz[2]);
    
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
    
    result.setColor(this.getColor());
    
    return result;
  }


};

