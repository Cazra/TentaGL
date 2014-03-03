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
 * An IconSprite for displaying 2D text that always faces toward the plane 
 * behind a camera. Text IconSprites use alpha color components. 
 * The text parts of their textures have alpha = 1. All other parts of their
 * textures have alpha = 0. To render them properly in your shader, I recommend
 * discarding texels whose alpha color components are 0.
 * A new TEXTure (puns!) is automatically produced and added to the MaterialLib
 * when an instance of this sprite is created.
 * @constructor
 * @param {WebGLRenderingContext} gl
 * @param {vec4} xyz
 * @param {TentaGL.Camera} camera
 * @param {string} text
 * @param {TentaGL.Font} font   Optional. Default Arial Monospace 16.
 * @param {TentaGL.Color} color   Optional. Default black.
 * @param {Number} antialiasTolerance   Optional. Range [0, 1]. Default 0.5.
 */
TentaGL.TextIconSprite = function(gl, xyz, camera, text, font, color, antialiasTolerance) {
  if(!antialiasTolerance) {
    antialiasTolerance = 0.5;
  }
  if(!color) {
    color = new TentaGL.Color.RGBA(0, 0, 0, 1);
  }
  if(!font) {
    font = new TentaGL.Font("Arial", "Monospace", 16);
  }
  
  var texName = "_text:" + TentaGL.TextIconSprite.count;
  TentaGL.IconSprite.call(this, xyz, camera, texName);
  
  this._text = text;
  this._font = font;
  this._color = color;
  this._tolerance = antialiasTolerance;
  
  TentaGL.MaterialLib.add(texName, new TentaGL.Texture(gl));
  this._update(gl);
  
  TentaGL.TextIconSprite.count++;
};

/** 
 * A counter used to ensure assign a unique material to each TextIconSprite. 
 */
TentaGL.TextIconSprite.count = 0;


TentaGL.TextIconSprite.prototype = {
  
  constructor:TentaGL.TextIconSprite,
  
  /** Removes the internal texture for this sprite form the MaterialLib and GL memory.  */
  clean:function(gl) {
    TentaGL.MaterialLib.remove(gl, this.getTextureName());
  },
  
  /** 
   * Sets the text of this sprite. 
   * @param {WebGLRenderingContext} gl
   * @param {string} text
   */
  setText:function(gl, text) {
    this._text = text;
    this._update(gl);
  },
  
  /** 
   * Sets the font of this sprite. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Font} font
   */
  setFont:function(gl, font) {
    this._font = font;
    this._update(gl);
  },
  
  /** 
   * Sets the color of this sprite.
   * @param {WebGLRenderingContext} gl   
   * @param {TentaGL.Color} color
   */
  setColor:function(gl, color) {
    this._color = color;
    this._update(gl);
  },
  
  /** 
   * Sets the anti-aliasing tolerance of this sprite. 
   * @param {WebGLRenderingContext} gl
   * @param {Number} tolerance
   */
  setAntialiasTolerance:function(gl, tolerance) {
    this._tolerance = tolerance;
    this._update(gl);
  },
  
  
  /** 
   * Updates the internal texture used to display the text for this sprite. 
   * @param {WebGLRenderingContext} gl
   */
  _update:function(gl) {
    var textIconPixelData = TentaGL.PixelData.Canvas(TentaGL.Canvas2D.createString(this._text, this._font, this._color));
    textIconPixelData = textIconPixelData.filter(new TentaGL.RGBAFilter.OneColor(this._color, this._tolerance));
    this.getTexture().setPixelData(gl, textIconPixelData);
  },
  
};


TentaGL.Inheritance.inherit(TentaGL.TextIconSprite.prototype, TentaGL.IconSprite.prototype);

