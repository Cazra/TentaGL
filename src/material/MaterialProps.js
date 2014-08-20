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
 * An encapsulation of material lighting properties. 
 * This doesn't really define the color for the material so much as it defines
 * how the material will react with the different components of lights in the 
 * scene.
 * @constructor
 * @param {TentaGL.Color} diffuse   Optional. Default: RGBA(1,1,1,1).
 * @param {TentaGL.Color} specular  Optional. Default: RGBA(1,1,1,1).
 * @param {number} shininess        Optional. Default: 0.
 * @param {TentaGL.Color} ambient   Optional. Default: RGBA(1,1,1,1).
 * @param {TentaGL.Color} emission  Optional. This one doesn't actually react
 *      to other light source in the scene. This actually functions as an 
 *      additive color to the computed color after lighting. So, it produces a 
 *      glowing effect for the object.
 *      Default: RGBA(0,0,0,1).
 */
TentaGL.MaterialProps = function(diffuse, specular, shininess, ambient, emission) {
  if(!diffuse) {
    diffuse = new TentaGL.Color([1, 1, 1, 1]); // all diffuse
  }
  if(!specular) {
    specular = new TentaGL.Color([1, 1, 1, 1]); // all specular
  }
  if(!shininess) {
    shininess = 10;
  }
  if(!ambient) {
    ambient = new TentaGL.Color([1, 1, 1, 1]); // all ambient
  }
  if(!emission) {
    emission = new TentaGL.Color([0, 0, 0, 1]); // no emission
  }
  
  this._diffuse = diffuse;
  this._specular = specular;
  this._shininess = shininess;
  this._ambient = ambient;
  this._emission = emission;
};

TentaGL.MaterialProps.prototype = {
  
  constructor: TentaGL.MaterialProps,
  
  isaMaterialProps: true,
  
  
  /** 
   * Setter/getter for the diffuse material property. 
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  diffuse: function(color) {
    if(color) {
      this._diffuse = color.clone();
    }
    return this._diffuse;
  },
  
  
  /** 
   * Setter/getter for the specular material property.
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  specular: function(color) {
    if(color) {
      this._specular = color.clone();
    }
    return this._specular;
  },
  
  
  /** 
   * Sets the shininess exponent for the specular component of the lighting. s^n
   * @param {number} n    Optional.
   * @return {number}
   */
  shininess: function(n) {
    if(n !== undefined) {
      this._shininess = n;
    }
    return this._shininess;
  },
  
  
  /** 
   * Setter/getter for the ambient material property. 
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  ambient: function(color) {
    if(color) {
      this._ambient = color.clone();
    }
    return this._ambient;
  },

  
  /** 
   * Setter/getter for the emission material property.
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  emission: function(color) {
    if(color) {
      this._emission = color.clone();
    }
    return this._emission;
  },
  
  
  
  /** 
   * Uses the material properties in the shader. 
   * @param {WebGLRenderingContext} gl
   */
  useMe: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    
    if(program.setMaterialProps) {
      program.setMaterialProps(gl, this);
    }
  }
  
};
