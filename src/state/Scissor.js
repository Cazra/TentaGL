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
 * A simple API for changing the scissor test state of the gl context.
 * When enabled, only pixels inside the rectangle in canvas space defined
 * by the scissor state can be modified. By default, the scissor test is disabled.
 */
TentaGL.Scissor = {
  
  
  /** 
   * Resets the meta-data about the scissor test state for a gl context. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._scissorEnabled = false;
    gl._scissorXYWH = [0, 0, gl.canvas.width, gl.canvas.height];
    
    gl._scissorStack = [];
  },
  
  
  /** 
   * Setter/getter for whether the scissor test is enabled. 
   * @param {WebGLRenderingContext} gl
   * @param {boolean} enabled   Optional.
   * @return {boolean}
   */
  enabled: function(gl, enabled) {
    if(enabled !== undefined && gl._scissorEnabled != enabled) {
      gl._scissorEnabled = enabled;
      
      if(enabled) {
        gl.enable(GL_SCISSOR_TEST);
      }
      else {
        gl.disable(GL_SCISSOR_TEST);
      }
    }
    return gl._scissorEnabled;
  },
  
  
  /** 
   * Setter/getter for the scissor area.
   * @param {WebGLRenderingContext} gl
   * @param {array: int*4} xywh   Optional.
   * @return {array: int*4}
   */
  xywh: function(gl, xywh) {
    if(xywh !== undefined) {
      gl._scissorXYWH = xywh.slice(0);
      gl.scissor(xywh[0], xywh[1], xywh[2], xywh[3]);
    }
    return gl._scissorXYWH.slice(0);
  },
  
  
  
  /** 
   * Saves the current scissor area state to the stack.
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    var state = {
      _scissorEnabled:  gl._scissorEnabled,
      _scissorXYWH:     gl._scissorXYWH.slice(0)
    };
    
    gl._scissorStack.push(state);
  },
  
  /** 
   * Restores the previously saved scissor area state from the stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    this.xywh(gl, gl._scissorStack.pop());
  }
};
 
 