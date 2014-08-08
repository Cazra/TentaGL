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
   * Setter/getter for the viewport area. 
   * @param {WebGLRenderingContext} gl
   * @param {array: uint*4} xywh
   * @return {array: uint*4}
   */
  xywh: function(gl, xywh) {
    if(xywh !== undefined) {
      gl._viewportXYWH = xywh.slice(0);
      gl.viewport(xywh[0], xywh[1], xywh[2], xywh[3]);
    }
    return gl._viewportXYWH.slice(0);
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
   * Resets the viewport state metadata. 
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl._viewportXYWH = [0, 0, gl.canvas.width, gl.canvas.height];
    
    gl._viewportStack = [];
  },
  
  
  
  /** 
   * Saves the current viewport settings to the top of the viewport stack. 
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    var state = {
      _viewportXYWH:  gl._viewportXYWH.slice(0)
    };
    
    gl._viewportStack.push(state);
  },
  
  
  /** 
   * Restores the previously pushed viewport settings from the top of the 
   * viewport stack. 
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var state = gl._viewportStack.pop();
    
    this.xywh(gl, state._viewportXYWH);
  }
};
 
 
