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
 * A TextSprite that is also an IconSprite. It displays 2D text in 3D space that
 * is always oriented to face the plane behind the camera.
 * @constructor
 * @param {vec4} xyz
 * @param {string} text
 * @param {TentaGL.BlitteredFont} blitFont    The BlitteredFont used to render 
 *      the text.
 */
TentaGL.TextIconSprite = function(xyz, text, blitFont) {
  TentaGL.IconSprite.call(this);
  TentaGL.TextSprite.call(this, xyz, text, blitFont);
};


TentaGL.TextIconSprite.prototype = {
  
  constructor:TentaGL.TextIconSprite,
  
  isaTextIconSprite:true,
  
  //////// Metrics
  
  /** 
   * Returns the pixel width of the icon's text. 
   * @return {int}
   */
  getIconWidth:function() {
    return this.getWidth();
  },
  
  /**
   * Returns the pixel height of the icon's text.
   * @return {int}
   */
  getIconHeight:function() {
    return this.getHeight(); 
  },
  
  
  //////// Rendering
  
  /** 
   * Draws the sprite.
   * @param {WebGLRenderingContext} gl
   */
  draw: function(gl) {
    this.getBlitteredFont().renderString(gl, this._text, [0,0,0], this._yFlipped, 1);
  }
};

Util.Inheritance.inherit(TentaGL.TextIconSprite, TentaGL.IconSprite);
Util.Inheritance.inherit(TentaGL.TextIconSprite, TentaGL.TextSprite);

