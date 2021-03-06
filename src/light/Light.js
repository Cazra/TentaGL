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
 * Base class for various types of lights. 
 * @constructor
 * @param {TentaGL.Color} diffuse   The color of reflected light being  
 *      scattered in all directions.
 * @param {TentaGL.Color} specular  The shiny color of the reflected light.
 * @param {TentaGL.Color} ambient   The color of uniform lighting contributed 
 *      to the scene, not dependent upon the angle of reflection. 
 */
TentaGL.Light = function(diffuse, specular, ambient) {
  if(!diffuse) {
    diffuse = TentaGL.Color.WHITE;
  }
  if(!specular) {
    specular = TentaGL.Color.WHITE;
  }
  if(!ambient) {
    ambient = TentaGL.Color.BLACK;
  }
  
  this._diffuse = diffuse;
  this._specular = specular;
  this._ambient = ambient;
};


TentaGL.Light.prototype = {
  
  constructor: TentaGL.Light,
  
  isaLight: true,
  
  /** 
   * Setter/getter for the light's diffuse color. 
   * @param {TentaGL.Color} diffuse   Optional.
   * @return {TentaGL.Color}
   */
  diffuse: function(diffuse) {
    if(diffuse) {
      this._diffuse = diffuse.clone();
    }
    return this._diffuse;
  },
  
  
  /** 
   * Setter/getter for the light's specular color.
   * @param {TentaGL.Color} specular    Optional.
   * @return {TentaGL.Color}
   */
  specular: function(specular) {
    if(specular) {
      this._specular = specular.clone();
    }
    return this._specular;
  },
  
  
  /** 
   * Setter/getter for the light's ambient color.
   * @param {TentaGL.Color} ambient   Optional.
   * @return {TentaGL.Color}
   */
  ambient: function(ambient) {
    if(ambient) {
      this._ambient = ambient.clone();
    }
    return this._ambient;
  },
  
  
  /** 
   * Renders an object to represent the light, for debugging. 
   * @param {WebGLRenderingContext} gl
   */
  render: function(gl) {}
};


Util.Inheritance.inherit(TentaGL.Light, TentaGL.Renderable);
