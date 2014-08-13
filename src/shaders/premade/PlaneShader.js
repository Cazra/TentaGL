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
 * An abstract class for a shader program that renders an infinite plane,
 * with texture coordinates computed as a function of world coordinates.
 * PlaneShaders should include the vec4 uniforms sFunc and tFunc
 * @abstract
 */
TentaGL.PlaneShader = function() {};

TentaGL.PlaneShader.prototype = {
  
  constructor: TentaGL.PlaneShader,
  
  isaPlaneShader: true,
  
  /** 
   * Sets the coefficients for the function used to compute the S texture 
   * coordinate: 
   * s = ax + by + cz + d
   * @param {WebGLRenderingContext} gl
   * @param {vec4} abcd
   */
  setSFunc: function(gl, abcd) {
    this._sFuncUni.set(gl, abcd);
  },
  
  /** 
   * Sets the coefficients for the function used to compute the T texture 
   * coordinate: 
   * t = ax + by + cz + d
   * @param {WebGLRenderingContext} gl
   * @param {vec4} abcd
   */
  setTFunc: function(gl, abcd) {
    this._tFuncUni.set(gl, abcd);
  }
};


Util.Inheritance.inherit(TentaGL.PlaneShader, TentaGL.ShaderProgram);

