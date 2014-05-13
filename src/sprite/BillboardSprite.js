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
 * A sprite in 3D space that is always facing towards the camera's eye and is oriented 
 * relative to the camera's up vector. 
 * @constructor
 * @param {vec4} xyz
 */
TentaGL.BillboardSprite = function(xyz) {
  TentaGL.Sprite.call(this, xyz);
};


TentaGL.BillboardSprite.prototype = {
  
  constructor:TentaGL.BillboardSprite,
  
  isaBillboardSprite:true,
  
  //////// Rendering
  
  /** 
   * Renders this sprite, temporarily concatenating its model transform to the 
   * current Model-view transform of the scene. 
   * @param {WebGLRenderingContext} gl
   */
  render:function(gl) {
    if(!this.isVisible() || !TentaGL.SceneNode.filter(this)) {
      return;
    }
    TentaGL.ViewTrans.push(gl);
    
    var camera = TentaGL.ViewTrans.getCamera(gl);
    var camEye = camera.getEye();
    this.billboardWorldPoint(camEye, camera.getUp())
    
    TentaGL.ViewTrans.mul(gl, this.getModelTransform());
    TentaGL.ViewTrans.updateMVPUniforms(gl);
    
    this.draw(gl);
    
    TentaGL.ViewTrans.pop(gl);
  },
  
  /** 
   * Sets the materials for and draws the Models making up this sprite. 
   * Override this. 
   */
  draw:function(gl) {},
};


Util.Inheritance.inherit(TentaGL.BillboardSprite, TentaGL.Sprite);
