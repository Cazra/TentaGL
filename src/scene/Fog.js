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
 * An object defining fog for a scene. 
 * @param {enum: TentaGL.Fog} equation
 * @param {TentaGL.Color} color
 * @param {float} density
 */
TentaGL.Fog = function(equation, color, density) {
  if(density === undefined) {
    density = 1;
  }
  
  this._eq = equation;
  this._color = color;
  this._density = density;
};

TentaGL.Fog.NONE = 0;
TentaGL.Fog.LINEAR = 1;
TentaGL.Fog.EXP = 2;
TentaGL.Fog.EXP2 = 3;


TentaGL.Fog.prototype = {
  
  constructor: TentaGL.Fog, 
  
  isaFog: true,
  
  /** 
   * Returns the enumeration code for the fog factor equation used. 
   * @return {enum: TentaGL.Fog}
   */
  getEquation: function() {
    return this._eq;
  },
  
  
  /** 
   * Setter/getter for the fog's color.
   * @param {TentaGL.Color} color   Optional.
   * @return {TentaGL.Color}
   */
  color: function(color) {
    if(color !== undefined) {
      this._color = color;
    }
    return this._color;
  },
  
  
  /** 
   * Setter/getter for the fog's density.
   * @param {float} density   Optional.
   * @return {float}
   */
  density: function(density) {
    if(density !== undefined) {
      this._density = density;
    }
    return this._density;
  },
  
  
  /** 
   * Uses this fog in the scene.
   * @param {WebGLRenderingContext} gl
   */
  useMe: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    
    if(program.setFog) {
      program.setFog(gl, this._eq, this._color.rgba(), this._density);
    }
  }
};



