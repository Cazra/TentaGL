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
  
  
  /** Resets the meta-data about the scissor test state for a gl context. */
  reset: function(gl) {
    gl._scissorX = 0;
    gl._scissorY = 0;
    gl._scissorWidth = 1;
    gl._scissorHeight = 1;
    
    gl._scissorEnabled = false;
  },
  
  
  
  /** 
   * Specifies the scissor rectangle for the gl context. 
   * @param {WebGLRenderingContext}
   * @param {array: uint || undefined} xywh  4 integers defining the x scissor box.
   *      If undefined, scissoring will be disabled. 
   *      Otherwise, scissoring will be enabled and the scissor box will be set.
   */
  set:function(gl, xywh) {
    if(xywh) {
      gl._scissorX = xywh[0];
      gl._scissorY = xywh[1];
      gl._scissorWidth = xywh[2];
      gl._scissorHeight = xywh[3];
      gl._scissorEnabled = true;
      
      gl.enable(GL_SCISSOR_TEST);
      gl.scissor(xywh[0], xywh[1], xywh[2], xywh[3]);
    }
    else {
      gl._scissorEnabled = false;
      
      gl.disable(GL_SCISSOR_TEST);
    }
  },
  
  
  /** 
   * Returns the metrics defining the scissor test box for the gl context.
   * The metrics are an array with 4 values:
   *  The x coordinate of the left edge of the scissor box in canvas space.
   *  The y coordinate of the bottom edge of the scissor box in canvas space. (0 is at the bottom of the canvas, y increases upwards)
   *  The width of the scissor box.
   *  The height of the scissor box.
   * @return {array: uint}   
   */
  get:function(gl) {
    return [gl._scissorX, gl._scissorY, gl._scissorWidth, gl._scissorHeight];
  },
  
  
  /** 
   * Returns the x coordinate of the left edge of the scissor test box. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getX:function(gl) {
    return gl._scissorX;
  },
  
  /** 
   * Returns the y coordinate of the bottom edge of the scissor test box. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getY:function(gl) {
    return gl._scissorY;
  },
  
  
  /** 
   * Returns the width of the scissor test box. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getWidth:function(gl) {
    return gl._scissorWidth;
  },
  
  
  /** 
   * Returns the height of the scissor test box. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getHeight:function(gl) {
    return gl._scissorHeight;
  },
  
  
  /** 
   * Returns whether the scissor test is enabled for the gl context. 
   * @param {WebGLRenderingContext} gl
   * @return {boolean}
   */
  isEnabled:function(gl) {
    return gl._scissorEnabled;
  }
};
 
 