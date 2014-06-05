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
 * An interface for a sprite that always faces the plane behind the camera, 
 * rather than at the camera eye like BillboardSprite does.
 * @constructor
 * @param {vec3} xyz
 */
TentaGL.IconSprite = function(xyz) {
  TentaGL.Sprite.call(this, xyz);
};


TentaGL.IconSprite.prototype = {
  
  constructor:TentaGL.IconSprite,
  
  isaIconSprite:true,
  
  
  //////// Metrics
  
  /** 
   * Returns icon's width. Override this.
   * @return {number}
   */
  getIconWidth:function() {},
  
  /**
   * Returns icon's height. Override this.
   * @return {number}
   */
  getIconHeight:function() {},
  
  
  /** 
   * Returns the aspect ratio of the icon. 
   * @return {number}
   */
  getIconAspect:function() {
    return this.getIconWidth()/this.getIconHeight();
  },
  
  
  //////// Alignment
  
  /** 
   * Sets the horizontal and vertical alignment of the icon relative to its anchor. 
   * @param {TentaGL.Align} horizontal  LEFT, CENTER, or RIGHT
   * @param {TentaGL.Alight} vertical   TOP, CENTER, or BOTTOM
   */
  setAlignment:function(horizontal, vertical) {
    var x = undefined;
    var y = undefined;
    
    // Set horizontal alignment.
    if(horizontal == TentaGL.Align.LEFT) {
      x =0;
    }
    else if(horizontal == TentaGL.Align.CENTER) {
      x = 0.5;
    }
    else if(horizontal == TentaGL.Align.RIGHT) {
      x = 1;
    }
    
    // Set vertical alignment.
    if(vertical == TentaGL.Align.BOTTOM) {
      y = 0;
    }
    else if(vertical == TentaGL.Align.CENTER) {
      y = 0.5;
    }
    else if(vertical == TentaGL.Align.TOP) {
      y = 1;
    }
    this.setAnchorXYZ([x,y,0]);
  },
  
  
  //////// Scaling
  
  /** 
   * Scales the icon such that its X and Y scale properties equal its
   * width and height, respectively.
   */
  scaleIconDims:function() {
    this.setScaleXYZ(this.getIconWidth(), this.getIconHeight(), 1);
  },
  
  
  /** 
   * Scales the icon such that it becomes the specified width and its height
   * is set such that the aspect ratio for the icon's texture is maintained.
   * @param {Number} width
   */
  scaleToWidth:function(width) {
    var aspect = this.getIconWidth()/this.getIconHeight();
    this.setScaleXYZ([width, width/aspect, 1]);
  },
  
  
  /** 
   * Scales the icon such that it becomes the specified height and its width
   * is set such that the aspect ratio for the icon's texture is maintained.
   * @param {Number} height
   */
  scaleToHeight:function(height) {
    var aspect = this.getIconWidth()/this.getIconHeight();
    this.setScaleXYZ([height*aspect, height, 1]);
  },
  
  
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
    this.billboardWorldPlane(vec3.negate(vec3.create(), camera.getLook()), camera.getUp())
    
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



Util.Inheritance.inherit(TentaGL.IconSprite, TentaGL.Sprite);
