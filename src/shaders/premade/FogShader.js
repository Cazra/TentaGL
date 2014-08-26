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
 * Mix-in for fog shaders.
 * @abstract
 */
TentaGL.FogShader = function() {};

TentaGL.FogShader.prototype = {
  
  constructor: TentaGL.FogShader,
  
  isaFogShader: true, 
  
  
  /** 
   * Sets the fog color and attenuation for the scene. 
   * Set rgba to undefined to turn fog off.
   * @param {WebGLRenderingContext} gl
   * @param {enum: Fog} eq
   * @param {vec4} rgba       The normalized color components for the fog.
   * @param {float} density   For linear fog, this is used for the distance at which 
   *                          the fog becomes completely opaque instead.
   */
  setFog: function(gl, eq, rgba, density) {
    this._fogEqUni.set(gl, [eq]);
    if(eq !== TentaGL.Fog.NONE) {
      this._fogColorUni.set(gl, rgba);
      this._fogDensityUni.set(gl, [density]);
    }
  }
};

Util.Inheritance.inherit(TentaGL.FogShader, TentaGL.ShaderProgram);
