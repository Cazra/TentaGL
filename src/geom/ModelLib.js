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
 * A singleton for loading and caching VBO data for models. 
 */
TentaGL.ModelLib = {
  
  /** A mapping of model IDs to their VBO data. */
  _vboData:{},
  
  /** 
   * Removes all the cached VBO data from GL memory and from this library. 
   * @return {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    for(var id in this._vboData) {
      this._vboData[id].clean(gl);
    }
    this._vboData = {};
  },
  
  
  /** 
   * Creates and adds the VBO data for a model to the library, intended to be 
   * used only with the specified shader. (This may change once I figure out 
   * some way to allow different shaders to use the same VBOs)
   * @param {WebGLRenderingContext} gl
   * @param {string} modelID  The uniqueID that 
   */
  add:function(gl, modelID, model, shader) {
    var shader = TentaGL.ShaderLib[shaderID];
    var vbo = new VBOData(gl, model, shader);
    this._vboData
  },
  
  
  /** 
   * Removes the VBO data for the specified model from the 
   * ModelLib and GL memory. 
   * @param {WebGLRenderingContext} gl
   * @param {string} modelID
   */
  remove:function(gl, modelID) {
    var vbo = this._vboData[modelID];
    vbo.clean(gl);
    delete this._vboData[modelID];
  },
  
};

