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
 * Constructs an object representing a uniform variable in a ShaderProgram.
 * @constructor
 * @param {WebGLActiveInfo } info   Information about the variable returned 
 *      return from a getActiveAttrib or getActiveUniform call.
 * @param {WebGLProgram} glProg   The program containing the variable.
 * @param {WebGLUniformLocation} location   The location of the variable in 
 *      the WebGL context.
 */
TentaGL.Uniform = function(info, glProg, location) {
  TentaGL.ShaderVar.call(this, info, glProg);
  this._location = location;
};

TentaGL.Uniform.prototype = Object.create(TentaGL.ShaderVar.prototype);


/** 
 * Returns the location of the Uniform in the WebGL context. 
 * @return {WebGLUniformLocation}
 */
TentaGL.Uniform.prototype.getLocation = function() {
  return this._location;
};


/** 
 * Returns the current value of this Uniform in the GL context.
 * @return {any} see getUniform at http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14.10
 */
TentaGL.Uniform.prototype.get = function(gl) {
  gl.getUniform(this._glProg, this._location);
};


/** 
 * Sets the value of this Uniform in the GL context.
 * @param {WebGLRenderingContext} gl
 * @param {typed array} valueArray  A typed array of the appropriate type and 
 *      length for the variable. In the case of a size 1 INT or FLOAT variable,
 *      
 */
TentaGL.Uniform.prototype.set = function(gl, valueArray) {
  TentaGL.Uniform.setters[this._type].call(this, gl, valueArray);
};





TentaGL.Uniform.setters = [];
TentaGL.Uniform.setters[TentaGL.GL_FLOAT] = function(gl, valueArray) { gl.uniform1f(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_FLOAT_VEC2] = function(gl, valueArray) { gl.uniform2fv(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_FLOAT_VEC3] = function(gl, valueArray) { gl.uniform3fv(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_FLOAT_VEC4] = function(gl, valueArray) { gl.uniform4fv(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_INT] = function(gl, valueArray) { gl.uniform1i(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_INT_VEC2] = function(gl, valueArray) { gl.uniform2iv(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_INT_VEC3] = function(gl, valueArray) { gl.uniform3iv(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_INT_VEC4] = function(gl, valueArray) { gl.uniform4iv(this._location, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_FLOAT_MAT2] = function(gl, valueArray) { gl.uniformMatrix2fv(this._location, false, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_FLOAT_MAT3] = function(gl, valueArray) { gl.uniformMatrix3fv(this._location, false, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_FLOAT_MAT4] = function(gl, valueArray) { gl.uniformMatrix4fv(this._location, false, valueArray); };
TentaGL.Uniform.setters[TentaGL.GL_SAMPLER_2D] = function(gl, valueArray) { gl.uniform1i(this._location, valueArray); };
