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
 * A light radiating from a point in all directions. 
 * @constructor
 * @param {vec3} xyz    The position of the light source.
 * @param {TentaGL.Color} diffuse   Optional.
 * @param {TentaGL.Color} specular  Optional.
 * @param {TentaGL.Color} ambient   Optional.
 */
TentaGL.PointLight = function(xyz, diffuse, specular, ambient) {
  TentaGL.Light.call(this, diffuse, specular, ambient);
  
  this._xyz = vec4.clone(xyz);
  this._xyz[3] = 1;
  this._attenuation = [1, 0, 0];
}

TentaGL.PointLight.prototype = {
  
  constructor: TentaGL.PointLight,
  
  isaPointLight: true,
  
  
  /** 
   * Setter/getter for the position of the light.
   * @param {vec3} xyz    Optional.
   * @return {vec4}
   */
  xyz: function(xyz) {
    if(xyz !== undefined) {
      this._xyz = vec3.copy([], xyz);
      this._xyz[3] = 1;
    }
    return this._xyz;
  },
  
  
  /** 
   * Setter/getter for the X coordinate of the light. 
   * @param {number} x    Optional.
   * @return {number}
   */
  x: function(x) {
    if(x !== undefined) {
      this._xyz[0] = x;
    }
    return this._xyz[0];
  },
  
  
  /** 
   * Setter/getter for the Y coordinate of the light.
   * @param {number} y    Optional.
   * @return {number}
   */
  y: function(y) {
    if(y !== undefined) {
      this._xyz[1] = y;
    }
    return this._xyz[1];
  },
  
  
  /** 
   * Setter/getter for the Z coordinate of the light.
   * @param {number} z    Optional.
   * @return {number}
   */
  z: function(z) {
    if(z !== undefined) {
      this._xyz[2] = z;
    }
    return this._xyz[2];
  },
  
  
  
  /** 
   * Setter/getter for the attenuation coefficents for the light. These
   * define how the intensity of the light degrades relative to distance.
   * @param {[a: number, b: number, c:number]} coeffs
   * @return {[a: number, b: number, c:number]}
   */
  attenuation: function(coeffs) {
    if(coeffs !== undefined) {
      this._attenuation = coeffs.slice(0);
    }
    return this._attenuation;
  },
  
  
  /** 
   * Renders an object to represent the light, for debugging. 
   * @param {WebGLRenderingContext} gl
   */
  render: function(gl) {
    (new TentaGL.Math.Sphere(1, this._xyz)).render(gl);
  }
};

Util.Inheritance.inherit(TentaGL.PointLight, TentaGL.Light);

