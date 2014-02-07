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
 * Constructs an object representing a vertex attribute in a ShaderProgram.
 * @param {WebGLActiveInfo } info   Information about the variable returned 
 *      return from a getActiveAttrib or getActiveUniform call.
 * @param {WebGLProgram} glProg   The program containing the variable.
 * @param {GLint} location   The location of the variable in 
 *      the WebGL context.
 */
TentaGL.Attribute = function(info, glProg, location) {
  TentaGL.ShaderVar.call(this, info, glProg);
  this._location = location;
};

TentaGL.Attribute.prototype = Object.create(TentaGL.ShaderVar.prototype);


/** 
 * Returns the location of the Attribute in the WebGL context. 
 * @return {WebGLUniformLocation}
 */
TentaGL.Attribute.prototype.getLocation = function() {
  return this._location;
};



