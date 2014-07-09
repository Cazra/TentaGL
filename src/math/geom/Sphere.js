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
 * A mathematical sphere object.
 * @param {ufloat} radius   The sphere's radius
 * @param {vec3} pt         Optional. The point of the sphere's center.
 *      Default: [0,0,0]
 */
TentaGL.Math.Sphere = function(radius, pt) {
  if(!pt) {
    pt = [0,0,0];
  }

  this._pt = vec3.clone(pt);
  this._radius = radius;
};

TentaGL.Math.Sphere.prototype = {
  
  constructor: TentaGL.Math.Sphere,
  
  isaSphere: true,
  
  
  /** 
   * Creates a clone of this sphere.
   * @return {TentaGL.Math.Sphere}
   */
  clone: function() {
    return new TentaGL.Math.Sphere(this._radius, this._pt);
  },
  
  
  
  /** 
   * Returns the radius of the sphere. 
   * @return {ufloat}
   */
  getRadius: function() {
    return this._radius;
  },
  
  /** 
   * Returns the sphere's central point. 
   * @return {vec3}
   */
  getPoint: function() {
    return this._pt;
  },
  
  
  //////// Distance
  
  /** 
   * Returns the distance from the sphere's surface to some point. 
   * @param {vec3} pt
   * @return {number}
   */
  distToPt: function(pt) {
    var v = vec3.sub(vec3.create(), pt, this._pt);
    return Math.abs(vec3.len(v) - this._radius);
  },
  
  
  
  //////// Intersection
  
  
  /** 
   * Determines if a point lies within this sphere's volume.
   * @param {vec3} pt
   * @return {boolean}
   */
  containsPt: function(pt) {
    var v = vec3.sub(vec3.create(), pt, this._pt);
    return (vec3.len(v) <= this._radius);
  },
  
  
  /** 
   * Determines if the surface area of the sphere contains a point within some 
   * tolerance for distance, close to 0.
   * @param {vec3} pt
   * @param {ufloat} tolerance  Optional. Default 0.
   * @return {boolean}
   */
  surfaceContainsPt: function(pt, tolerance) {
    if(!tolerance) {
      tolerance = 0;
    }
    
    var v = vec3.sub(vec3.create(), pt, this._pt);
    var dist = Math.abs(vec3.len(v) - this._radius);
    return (dist <= tolerance);
  },
  
  
  /** 
   * Determines whether the volume of this sphere intersects with the volume 
   * of another sphere. 
   * @param {TentaGL.Math.Sphere} sphere
   * @return {boolean}
   */
  intersectsSphere: function(sphere) {
    var sqDist = vec3.sqrDist(this._pt, sphere._pt);
    var sqSum = this._radius + sphere._radius;
    sqSum *= sqSum;
    return (sqDist <= sqSum);
  },
  
  
  /** 
   * Determines whether the volume of this sphere intersects with an infinite 
   * plane. 
   * @param {TentaGL.Math.InfinitePlane} plane
   * @return {boolean}
   */
  intersectsPlane: function(plane) {
    var centerDist = plane.distToPt(this._pt);
    return (centerDist <= this._radius);
  },
  
  
  ////// Rendering
  
  
  /** 
   * Renders this sphere into the scene. 
   * @param {WebGLRenderingContext} gl
   * @param {string} materialName
   */
  render: function(gl, materialName) {
    var pt = vec3.clone(this._pt);
    var r = this._radius;
    
    TentaGL.ViewTrans.push(gl);
    
    var m = mat4.create();
    mat4.translate(m, m, pt);
    mat4.scale(m, m, [r, r, r]);
    
    TentaGL.ViewTrans.mul(gl, m);
    TentaGL.ViewTrans.updateMVPUniforms(gl);
    
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    TentaGL.ModelLib.render(gl, "unitSphere");
    
    TentaGL.ViewTrans.pop(gl);
  },
  
  
};
