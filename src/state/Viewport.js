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
 * A simple API for changing the state of the viewport in the gl context.
 */
TentaGL.Viewport = {
  
  /** 
   * Returns the metrics of the gl context's viewport. 
   * The metrics are returned as a list containing, in order: 
   *  The x coordinate of the left edge in canvas coordinates.
   *  The y coordinate of the bottom edge in canvas coordinates. (0 corresponds to the bottom edge of the canvas. y increases upwards)
   *  The width.
   *  The height.
   * @param {WebGLRenderingContext} gl
   * @return {array: [uint, uint, uint, uint]}
   */
  get:function(gl) {
    return [gl._viewX, gl._viewY, gl._viewWidth, gl._viewHeight];
  },
  
  
  /** 
   * Returns the x coordinate of the viewport's left edge. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getX:function(gl) {
    return gl._viewX;
  },
  
  
  /** 
   * Returns the y coordinate of the viewport's bottom edge. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getY:function(gl) {
    return gl._viewY;
  },
  
  
  /** 
   * Returns the width of the viewport. 
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getWidth:function(gl) {
    return gl._viewWidth;
  },
  
  
  /** 
   * Returns the height of the viewport.
   * @param {WebGLRenderingContext} gl
   * @return {uint}
   */
  getHeight:function(gl) {
    return gl._viewHeight;
  },
  
  
  /** 
   * Sets the rectangle defining the gl context's viewport on the canvas.
   * @param {WebGLRenderingContext} gl
   * @param {array:[uint, uint, uint, uint]
   */
  set:function (gl, xywh) {
    gl._viewX = xywh[0];
    gl._viewY = xywh[1];
    gl._viewWidth = xywh[2];
    gl._viewHeight = xywh[3];
    gl.viewport(xywh[0], xywh[1], xywh[2], xywh[3]);
  },
  
  
  /** 
   * Saves the current viewport settings to the top of the viewport stack. 
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    if(!gl._viewportStack) {
      gl._viewportStack = [];
    }
    
    gl._viewportStack.push(this.get(gl));
  },
  
  
  /** 
   * Restores the previously pushed viewport settings from the top of the 
   * viewport stack. 
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    this.set(gl, gl._viewportStack.pop());
  }
};
 
 
