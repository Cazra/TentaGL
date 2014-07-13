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
TentaGL.ViewTrans = {
  
  
  //////// View transform
  
  /** 
   * Sets the model-view transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans  The new model-view transform matrix.
   */
  set: function(gl, trans) {
    gl._modelViewTrans = trans;
  },
  
  
  /** 
   * Returns the current model-view transform matrix.
   * @return {mat4}
   */
  get: function(gl) {
    return gl._modelViewTrans;
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
   * Translates the model-view transform matrix. 
   * This is equivalent to calling TentaGL.ViewTrans.mul(gl, T), 
   * where T is a translation transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {vec3} xyz  The amount to translate along each axis.
   */
  translate: function(gl, xyz) {
    if(!xyz[2]) {
      xyz[2] = 0;
    }
    var trans = mat4.create();
    mat4.translate(trans, trans, xyz);
    
    this.mul(gl, trans);
  },
  
  
  /** 
   * Rotates the model-view transform matrix about an axis. 
   * @param {WebGLRenderingContext} gl
   * @param {vec3} axis   The axis to rotate around.
   * @param {number} rads   The angle, in radians.
   */
  rotate: function(gl, axis, rads) {
    var q = quat.create();
    quat.setAxisAngle(q, axis, rads);
    
    var trans = mat4.create();
    mat4.fromQuat(trans, q);
    
    this.mul(gl, trans);
  },
  
  
  /** 
   * Scales the model-view transform matrix. 
   * @param {WebGLRenderingContext} gl
   * @param {vec3} xyz  The amount to scale along each axis.
   */
  scale: function(gl, xyz) {
    if(!xyz[2]) {
      xyz[2] = 1;
    }
    var trans = mat4.create();
    mat4.scale(trans, trans, xyz);
    
    this.mul(gl, trans);
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
   * Resets the model-view and projection transform matrices to the identity 
   * matrix and empties the model-view transform stack.
   * @param {WebGLRenderingContext} gl
   */
  reset: function(gl) {
    this.set(gl, mat4.create());
    gl._transformStack = [];
    
    this.setProjection(gl, mat4.create());
    
    gl._normalTrans = mat3.create();
    gl._mvpTrans = mat4.create();
  },
  
  
  //////// View transform
  
  /** 
   * Sets the view transform matrix (and model-view transform matrix). 
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans  The new view matrix.
   */
  setView: function(gl, trans) {
    this.set(trans);
    gl._viewTrans = trans;
  },
  
  
  /** 
   * Returns the current view transform matrix.
   * @return {mat4}
   */
  getView: function(gl) {
    return gl._viewTrans;
  },
  
  
  /** 
   * Multiplies the view transform matrix (M) by another matrix (T) so that the
   * result is M = M x T.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans
   */
  mulView: function(gl, trans) {
    mat4.mul(gl._viewTrans, gl._viewTrans, trans);
  },
  
  /** 
   * Multiplies the view transform matrix (M) by another matrix (T) so 
   * that the result is M = T x M.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans
   */
  premulView: function(gl, trans) {
    mat4.mul(gl._viewTrans, trans, gl._viewTrans);
  },
  
  
  //////// Projection transform
  
  /** 
   * Sets the projection transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans  The new projection matrix.
   */
  setProjection: function(gl, trans) {
    gl._projTrans = trans;
  },
  
  
  /** 
   * Returns the current projection transform matrix.
   * @return {mat4}
   */
  getProjection: function(gl) {
    return gl._projTrans;
  },
  
  
  /** 
   * Multiplies the projection transform matrix (M) by another matrix (T) so 
   * that the result is M = M x T.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans
   */
  mulProjection: function(gl, trans) {
    mat4.mul(gl._projTrans, gl._projTrans, trans);
  },
  
  
  /** 
   * Multiplies the projection transform matrix (M) by another matrix (T) so 
   * that the result is M = T x M.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} trans
   */
  premulProjection: function(gl, trans) {
    mat4.mul(gl._projTrans, trans, gl._projTrans);
  },
  
  
  //////// Shader vars
  
  
  /** 
   * Updates the MVP and normal transform matrix uniform variables in the 
   * currently bound shader program, using the current projection and 
   * model-view matrices.
   * @param {WebGLRenderingContext} gl
   */
  updateMVPUniforms: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    
    if(program.setNormalTrans) {
      mat3.normalFromMat4(gl._normalTrans, gl._modelViewTrans);
      program.setNormalTrans(gl, gl._normalTrans);
    }
    
    if(program.setMVPTrans) {
      mat4.mul(gl._mvpTrans, gl._projTrans, gl._modelViewTrans);
      program.setMVPTrans(gl, gl._mvpTrans);
    }
    
    if(program.setMVTrans) {
      program.setMVTrans(gl, gl._modelViewTrans);
    }
    
    if(program.setVTrans) {
      program.setVTrans(gl, gl._viewTrans);
    }
  },
  
  
  
  //////// Current camera
  

  /** 
   * Returns the camera being used for the view and projection 
   * transforms by the gl context. 
   * @param {WebGLRenderingContext} gl
   * @return {TentaGL.Camera}
   */
  getCamera: function(gl) {
    return gl._camera;
  },


  /** 
   * Sets the camera being used for the view and projection transforms by the 
   * gl context. The gl context's transforms are set to those of the camera, 
   * effectively reseting the scene transform to the view-projection matrix.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Camera} camera
   * @param {float} aspect    The aspect ratio for the view.
   */
  setCamera: function(gl, camera, aspect) {
    gl._camera = camera;
    
    this.set(gl, camera.getViewTransform());
    this.setProjection(gl, camera.getProjectionTransform(aspect));
  }
  
};




