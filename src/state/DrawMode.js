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
 * Small API for setting the WebGL drawing mode for primitives. 
 * By default the drawing mode is set to GL_TRIANGLES.
 */
TentaGL.DrawMode = {
  
  
  /** 
   * Resets the drawing mode metadata. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._drawMode = GL_TRIANGLES;
  },
  
  
  /** 
   * Setter/getter for the primitives drawing mode.
   * Either GL_LINES or GL_TRIANGLES.
   * @param {WebGLRenderingContext} gl
   * @param {GLenum} mode   Optional.
   * @return {GLenum}
   */
  mode: function(gl, mode) {
    if(mode !== undefined && gl._drawMode != mode) {
      gl._drawMode = mode;
    }
    return gl._drawMode;
  }
  
};
