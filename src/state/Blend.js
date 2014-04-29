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
 * Simple API for setting the blending state of the gl context. The API 
 * is optimized to avoid making unnecessary repeat calls to change the internal  
 * graphics state. Therefore, it is strongly encouraged for TentaGL
 * applications to change the blending state of the gl context through this
 * API instead of directly through the gl context.
 * 
 * TODO
 */
TentaGL.Blend = {
  
  _enabled: false,
  
  _equation: TentaGL.GL_FUNC_ADD,
  
  _srcFunc: TentaGL.GL_ONE,
  
  _dstFunc: TentaGL.GL_ZERO,
  
  
  
  setEnabled:function(gl, enabled) {
    if(this._enabled != enabled) {
      this._enabled = enabled;
      
      if(enabled) {
        gl.enable(gl.BLEND);
      }
      else {
        gl.disable(gl.BLEND);
      }
    }
  },
  
};