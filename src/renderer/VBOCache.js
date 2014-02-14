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
 * The VBOCache maintains a cache of VBO data for Models and the ShaderPrograms 
 * they are rendered with. 
 * @deprecated  See ModelLib.
 */
TentaGL.VBOCache = {
  
  /** A mapping of Models to VBOData objects. */
  _vboData:{},
  
  /** 
   * Removes all the cached VBO data from GL memory and from this cache. 
   * @return {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    for(var id in this._vboData) {
      this._vboData[id].clean(gl);
    }
    this._vboData = {};
  },
  
  
  /** Adds (or replaces) a model to the cache with the specified ID, createing its VBO data in the process.*/
  add:function(gl, id, model) {
  
  },
  
  
  
  /**
   * Gets the cached vertex data for some Model being rendered with some 
   * ShaderProgram. If the data doesn't exist, then it is created and cached.
   */
  get:function(gl, model, shader) {
    var id = model.getID();
    
    var vbo = this._vboData[id];
    if(vbo === undefined || vbo.getShader() !== shader) {
      this._vboData[id] = new TentaGL.VBOData(gl, model, shader);
    }
    else {
      console.log("Already has model");
    } 
    
    return this._vboData[id];
  },
  
  /** 
   * Removes the VBO data for the specified model from the cache and GL memory. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Model} model
   */
  remove:function(gl, model) {
    var id = model.getID();
    var vbo = this._vboData[id];
    vbo.clean(gl);
    delete this._vboData[id];
  }
};

