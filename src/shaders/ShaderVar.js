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
 * Constructs an object representing a variable in a ShaderProgram.
 * The purpose of this is to serve as a super-type for Attribute and Uniform.
 * @constructor
 * @param {WebGLActiveInfo } info   Information about the variable returned 
 *      return from a getActiveAttrib or getActiveUniform call.
 * @param {WebGLProgram} glProg   The program containing the variable.
 */
TentaGL.ShaderVar = function(info, glProg) {
  this._name = info.name;
  this._size = info.size;
  this._type = info.type;
  this._sizeBytes = info.size*TentaGL.glSizeBytes(info.type);
  this._sizeUnits = info.size*TentaGL.glSizeUnits(info.type);
  
  this._glProg = glProg;
};

TentaGL.ShaderVar.prototype = {
  
  constructor: TentaGL.ShaderVar,
  
  /** 
   * Returns the name of the variable. 
   * @return {string}
   */
  getName:function() {
    return this._name;
  },
  
  
  /** 
   * Returns the size of the variable. 
   * Variables other than arrays will have a size of 1.
   * @return {GLint}
   */
  getSize:function() {
    return this._size;
  },
  
  
  /** 
   * Returns the size of the variable in bytes.
   * @return {GLint}
   */
  getSizeBytes:function() {
    return this._sizeBytes;
  },
  
  
  /** 
   * Returns the size of the variable in units of its base type.
   * @return {GLint}
   */
  getSizeUnits:function() {
    return this._sizeUnits;
  },
  
  
  /** 
   * Returns the GL type of the variable. 
   * @return {GLenum}
   */
  getType:function() {
    return this._type;
  },
  
  /** Returns the unit type of the variable. */
  getUnitType:function() {
    return TentaGL.glUnitType(this._type);
  },
  
  
  /**
   * Returns the string representation of this variable's GL type.
   * @return {string}
   */
  getTypeName:function() {
    return TentaGL.glTypeName(this._type);
  },
  
  
  /** 
   * Returns true iff this is a built-in variable. Built-in variables are any
   * whose name starts with "gl_".
   */
  isBuiltIn:function() {
    return (this._substring(0,3).valueOf() == "gl_");
  }
  
  
};




