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
TentaGL.Math.InfinitePlane = function(normal, pt) {
  if(!pt) {
    pt = [0,0,0];
  }
  
  this._normal = vec3.clone(normal);
  this._pt = vec3.clone(pt);
};


TentaGL.Math.InfinitePlane.prototype = {
  constructor: TentaGL.Math.InfinitePlane,
  
  isaInfinitePlane: true,
  
  /** 
   * Returns the plane's normal vector. 
   * @return {vec3}
   */
  getNormal: function() {
    return this._normal;
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
    var nHat = vec3.normalize(vec3.create(), this._normal);
    var dot = vec3.dot(wHat, nHat);
    
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
      p2 = [p1[0] + 1, p[1], p[2]];
    }
    else if(this._normal[1] == 0) {
      p2 = [p1[0], p[1] + 1, p[2]];
    }
    else if(this._normal[2] == 0) {
      p2 = [p1[0], p[1], p[2] + 1];
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
    return (this.distToPt(pt) <= tolerance);
  }
};

