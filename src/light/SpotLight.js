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
 * @param {TentaGL.Color} diffuse   Optional.
 * @param {TentaGL.Color} specular  Optional.
 * @param {TentaGL.Color} ambient   Optional.
 */
TentaGL.SpotLight = function(xyz, direction, cutOffAngle,  diffuse, specular, ambient) {
  TentaGL.PointLight.call(this, xyz, diffuse, specular, ambient);
  TentaGL.DirectionalLight.call(this, xyz, diffuse, specular, ambient);
  
  this._angle = cutOffAngle;
};


TentaGL.SpotLight.prototype = {
  
  constructor: TentaGL.SpotLight,
  
  isaSpotLight: true,
  
  /** 
   * Returns the cut-off angle for the spotlight, in radians.
   * This is the angle between the spotlight's direction vector and the edge of
   * its cone.
   * @return {number}
   */
  getCutOffAngle: function() {
    return this._angle;
  },
  
  /** 
   * Sets the cut-off angle for the spotlight, in radians. 
   * @param {number} angle
   */
  setCutOffAngle: function(angle) {
    this._angle = angle;
  }
  
};


Util.Inheritance.inherit(TentaGL.SpotLight, TentaGL.PointLight);
Util.Inheritance.inherit(TentaGL.SpotLight, TentaGL.DirectionalLight);

