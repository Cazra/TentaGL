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
}

TentaGL.PointLight.prototype = {
  
  constructor: TentaGL.PointLight,
  
  isaPointLight: true,
  
  /** 
   * Returns the position of the light.
   * @return {vec4}
   */
  getXYZ: function() {
    return this._xyz;
  },
  
  
  /** 
   * Sets the position of the light. 
   * @param {vec3} xyz
   */
  setXYZ: function(xyz) {
    this._xyz[0] = xyz[0];
    this._xyz[1] = xyz[1];
    this._xyz[2] = xyz[2];
  }
  
};

Util.Inheritance.inherit(TentaGL.PointLight, TentaGL.Light);

