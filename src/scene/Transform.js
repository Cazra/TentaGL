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
 * An API for changing the Model-View-Projection and Normal transforms for a scene.
 */
TentaGL.Transform = {
  
  /** 
   * Sets the model-view transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans  The new model-view transform matrix.
   */
  set: function(gl, trans) {
    gl._modelViewTrans = trans;
  },
  
  
  /** 
   * Multiplies the model-view transform matrix (M) by another matrix (T) so 
   * that the result is M = M x T.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans
   */
  mul: function(gl, trans) {
    mat4.mul(gl._modelViewTrans, gl._modelViewTrans, trans);
  },
  
  
  /** 
   * Multiplies the model-view transform matrix (M) by another matrix (T) so 
   * that the result is M = T x M.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans
   */
  premul: function(gl, trans) {
    mat4.mul(gl._modelViewTrans, trans, gl._modelViewTrans);
  },
  
  
  /** 
   * Saves the current model-view transform matrix onto the transform stack. 
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    gl._transformStack.push(mat4.clone(gl._modelViewTrans));
  },
  
  
  /**
   * Restores the current model-view transform matrix from the transform stack.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    gl._modelViewTrans = gl._transformStack.pop();
  },
  
  
  /** 
   * Resets the model-view transform matrix to the identity matrix and empties
   * the transform stack.
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    gl.setTransform(mat4.create());
    gl._transformStack = [];
  },
  
  
};
