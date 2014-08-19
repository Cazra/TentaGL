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
 * @param {vec3} xyz
 */
TentaGL.Vertex = function(xyz) {
  this._xyz = vec3.copy([], xyz);
  this._xyz[3] = 1;
  
  this._texST = [0, 0];
  this._normal = [0, 0, 0];
  this._tangental = [0, 0, 0];
}

TentaGL.Vertex.prototype = {
  
  constructor:TentaGL.Vertex, 
  
  
  /** 
   * Setter/getter for the vertex's xyzw position, with w=1. 
   * @param {vec3} xyz  Optional.
   * @return {vec4}
   */
  xyz: function(xyz) {
    if(xyz !== undefined) {
      this._xyz = vec3.copy([], xyz);
      this._xyz[3] = 1;
    }
    return vec4.clone(this._xyz);
  },
  
  
  
  /** 
   * Setter/getter for the texture coordinates. 
   * @param {vec2} st   Optional.
   * @return {vec2}
   */
  texST: function(st) {
    if(st !== undefined) {
      this._texST = vec2.copy([], st);
    }
    return vec2.clone(this._texST);
  },
  
  
  
  /** 
   * Setter/getter for the normal vector. 
   * @param {vec3} xyz
   * @return {vec3}
   */
  normal: function(xyz) {
    if(xyz !== undefined) {
      this._normal = vec3.copy([], xyz);
    }
    return vec3.clone(this._normal);
  },
  
  
  /** 
   * Computes (but doesn't set) the surface tangental vertex of this vertex, using the texture 
   * coordinates of this vertex and two vertices it shares a polygon with.
   * @param {TentaGL.Vertex} v2
   * @param {TentaGL.Vertex} v3
   * @return {vec3}
   */
  computeTangental:function(v2, v3) {
    var u = vec3.sub([], v2.xyz(), this.xyz());
    var v = vec3.sub([], v3.xyz(), this.xyz());
    
    var su = v2._texST[0] - this._texST[0];
    var sv = v3._texST[0] - this._texST[0];
    var tu = v2._texST[1] - this._texST[1];
    var tv = v3._texST[1] - this._texST[1];
    var dst = tv*su - tu*sv;
    if(dst == 0) {
      return [1, 0, 0];
    }
    else {
      var tang = vec3.create();
      vec3.scale(tang, u, tv);
      vec3.sub(tang, tang, vec3.scale([], v, tu));
      vec3.scale(tang, tang, 1/dst);
      
      var t = tang;
      if(vec3.length(tang) == 0) {
        return [1, 0, 0];
      }
      
      return tang;
    }
  },
  
  
  
  /** 
   * Setter/getter for the tangental vector. 
   * @param {vec3} xyz    Optional.
   * @return {vec3}
   */
  tangental: function(xyz) {
    if(xyz !== undefined) {
      this._tangental = vec3.copy([], xyz);
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
    var xyz = vec4.transformMat4([], this.xyz(), transform);
    var result = new TentaGL.Vertex(xyz);
    
    // We need to turn normal from a vec3 into a vec4 before it can be matrix-multiplied.
    // w=0 so that it doesn't get translated.
    var normal = vec3.copy([], this.normal());
    normal[3] = 0;
    vec4.transformMat4(normal, normal, transform);
    result.normal(normal);
    
    // We need to turn tangental from a vec3 into a vec4 before it can be matrix-multiplied.
    // w=0 so that it doesn't get translated.
    var tang = vec3.copy([], this.tangental());
    tang[3] = 0;
    vec4.transformMat4(tang, tang, transform);
    result.tangental(tang);
    
    result.texST(this._texST);
    
    return result;
  }


};

