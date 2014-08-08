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
 * A simple API for setting the face-culling state of the gl context.
 */
TentaGL.Cull = {
  
  /** 
   * Sets the face-culling mode for the gl context. 
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} mode   Any allowed value for gl.cullFace.
   */
  setMode:function(gl, mode) {
    if(gl._cullMode != mode) {
      gl._cullMode = mode;
      
      if(mode == GL_NONE) {
        gl.disable(GL_CULL_FACE);
      }
      else {
        gl.enable(GL_CULL_FACE);
        gl.cullFace(mode);
      }
    }
  },
  
  
  /** 
   * Returns the face-culling mode being used.
   * @param {WebGLRenderingContext} gl
   */
  getMode:function(gl) {
    return gl._cullMode;
  },
  
  
  
  /** 
   * Setter/getter for the face-culling mode. 
   * @param {WebGLRenderingContext} gl
   * @param {glEnum} mode   Optional.
   * @return {glEnum}
   */
  mode: function(gl, mode) {
    if(mode !== undefined) {
      this.setMode(gl, mode);
    }
    return gl._cullMode; 
  },
  
  
  
  /** 
   * Resets the metadata about the face-culling state for a gl context. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._cullMode = GL_NONE;
  }
  
  
};

