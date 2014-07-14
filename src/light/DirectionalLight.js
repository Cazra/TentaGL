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
 * An effectively infinitely distant light source radiating light in a single 
 * direction. 
 * @param {vec3} direction    The direction toward the light source.
 * @param {TentaGL.Color} diffuse   Optional.
 * @param {TentaGL.Color} specular  Optional.
 * @param {TentaGL.Color} ambient   Optional.
 */
TentaGL.DirectionalLight = function(direction, diffuse, specular, ambient) {
  TentaGL.Light.call(this, diffuse, specular, ambient);
  
  this._direction = direction;
};

TentaGL.DirectionalLight.prototype = {
  
  constructor: TentaGL.DirectionalLight,
  
  isaDirectionalLight: true,
  
  
  /** 
   * Returns the direction of the light.
   * @return {vec3}
   */
  getDirection: function() {
    return this._direction;
  },
  
  
  /** 
   * Sets the direction of the light.
   * @param {vec3} direction
   */
  setDirection: function(direction) {
    this._direction[0] = direction[0];
    this._direction[1] = direction[1];
    this._direction[2] = direction[2];
  },
  
  
  /** 
   * Renders an object to represent the light, for debugging. 
   * @param {WebGLRenderingContext} gl
   */
  render: function(gl) {
    (new TentaGL.Math.Sphere(1, this._direction)).render(gl, "white");
  }
};

Util.Inheritance.inherit(TentaGL.DirectionalLight, TentaGL.Light);