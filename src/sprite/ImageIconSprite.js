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
 * An IconSprite for displaying an image.
 * All ImageIconSprites are 1 unit tall, unscaled.
 * @constructor
 * @param {vec3} xyz
 * @param {string} texName  The name of the image's texture in MaterialLib.
 */
TentaGL.ImageIconSprite = function(xyz, texName) {
  TentaGL.IconSprite.call(this, xyz);
  this._texName = texName;
  this._texWidth = 1;
  this._texHeight = 1;
};


TentaGL.ImageIconSprite.prototype = {
  
  constructor:TentaGL.ImageIconSprite,
  
  isaImageIconSprite:true,
  
  //////// Texture properties
  
  /** 
   * Returns the name of this icon's texture material. 
   * @return {string}
   */
  getTextureName:function() {
    return this._texName;
  },
  
  
  /** 
   * Changes the texture material used by this icon to the one with the 
   * specified name. 
   * @param {string} name
   */
  setTextureName:function(name) {
    this._texName = name;
  },
  
  
  /** 
   * Returns this icon's texture material. 
   * @return {TentaGL.Texture}
   */
  getTexture:function(gl) {
    return TentaGL.MaterialLib.get(gl, this._texName);
  },
  
  
  /** 
   * Returns the PixelData for the icon's texture material.
   * @return {TentaGL.PixelData}
   */
  getPixelData:function(gl) {
    return this.getTexture(gl).getPixelData();
  },
  
  
  //////// Metrics
  
  /** 
   * Returns width of the icon. 
   * @return {number}
   */
  getIconWidth:function() {
    return this._texWidth/this._texHeight;
  },
  
  /**
   * Returns the height of the icon.
   * @return {number}
   */
  getIconHeight:function() {
    return 1; 
  },
  
  
  /** 
   * Returns the pixel width of the icon's image. 
   * @return {int}
   */
  getTextureWidth: function() {
    return this._texWidth;
  },
  
  /**
   * Returns the pixel height of the icon's image.
   * @return {int}
   */
  getTextureHeight: function() {
    return this._texHeight; 
  },
  
  
  //////// Rendering
  
  
  /** Draws the icon's texture onto a unit plane. */
  draw:function(gl) {    
    TentaGL.MaterialLib.use(gl, this._texName);
    
    var tex = this.getTexture(gl);
    this._texWidth = tex.getWidth();
    this._texHeight = tex.getHeight();
    
    var iconW = this.getIconWidth();
    var iconH = this.getIconHeight();
    
    TentaGL.ViewTrans.scale(gl, [iconW, iconH]);
    TentaGL.ModelLib.render(gl, "unitPlane");
  }
};



Util.Inheritance.inherit(TentaGL.ImageIconSprite, TentaGL.IconSprite);
