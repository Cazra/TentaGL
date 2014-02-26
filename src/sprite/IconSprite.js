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



TentaGL.IconSprite = function(xyz, camera, texName) {
  TentaGL.BillboardSprite.call(this, xyz, camera);
  this._texName = texName;
  
  var tex = TentaGL.MaterialLib.get(texName);
  this._width = tex.getWidth();
  this._height = tex.getHeight();
  
};


TentaGL.IconSprite.prototype = {
  
  constructor:TentaGL.IconSprite,
  
  
  /** 
   * Returns the name of this icon's texture material. 
   * @return {string}
   */
  getTextureName:function() {
    return this._texName;
  },
  
  /** 
   * Returns this icon's texture material. 
   * @return {TentaGL.Texture}
   */
  getTexture:function() {
    return TentaGL.MaterialLib.get(this._texName);
  },
  
  
  /** 
   * Returns the icon's pixel width. 
   * @return {int}
   */
  getIconWidth:function() {
    return this._width;
  },
  
  /**
   * Returns the icon's pixel height.
   * @return {int}
   */
  getIconHeight:function() {
    return this._height;
  },
  
  
  draw:function(gl) {    
    TentaGL.MaterialLib.use(gl, this._texName);
    TentaGL.VBORenderer.render(gl, "unitPlane");
  }
};



TentaGL.Inheritance.inherit(TentaGL.IconSprite.prototype, TentaGL.BillboardSprite.prototype);
