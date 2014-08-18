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
 * A point-light that projects light in some direction in a cone-shaped area.
 * @param {vec3} xyz
 * @param {vec3} direction
 * @param {number} cutOffAngle    The cut-off angle, in radians.
 * @param {number} spotExponent   The exponent defining the rate of decay for 
 *      light intensity towards the edge of the splotlight cone.
 * @param {TentaGL.Color} diffuse   Optional.
 * @param {TentaGL.Color} specular  Optional.
 * @param {TentaGL.Color} ambient   Optional.
 */
TentaGL.SpotLight = function(xyz, direction, cutOffAngle, spotExponent, diffuse, specular, ambient) {
  TentaGL.PointLight.call(this, xyz, diffuse, specular, ambient);
  TentaGL.DirectionalLight.call(this, direction, diffuse, specular, ambient);
  
  this._angle = cutOffAngle;
  this._spotExp = spotExponent;
};


TentaGL.SpotLight.prototype = {
  
  constructor: TentaGL.SpotLight,
  
  isaSpotLight: true,
  
  /** 
   * Setter/getter for the spotlight's cur-off angle, in radians. 
   * @param {number} angle    Optional.
   * @return {number}
   */
  cutOffAngle: function(angle) {
    if(angle !== undefined) {
      this._angle = angle;
    }
    return this._angle;
  },
  
  
  /** 
   * Setter/getter for the spotlight's decay exponent. 
   * @param {number} n    Optional.
   * @return {number}
   */
  spotExponent: function(n) {
    if(n !== undefined) {
      this._spotExp = n;
    }
    return this._spotExp;
  }
  
};


Util.Inheritance.inherit(TentaGL.SpotLight, TentaGL.PointLight);
Util.Inheritance.inherit(TentaGL.SpotLight, TentaGL.DirectionalLight);

