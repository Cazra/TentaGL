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
 * @param {vec4} xyz
 * @param {string} text
 * @param {TentaGL.Font} font   Optional. Default Arial Monospace 16.
 * @param {TentaGL.Color} color   Optional. Default black.
 * @param {Number} antialiasTolerance   Optional. Range [0, 1]. Default 0.5.
 */
TentaGL.TextIconSprite = function(xyz, text, font, color, antialiasTolerance) {
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
  TentaGL.IconSprite.call(this, xyz, texName);
  
  this._text = text;
  this._font = font;
  this._color = color;
  this._tolerance = antialiasTolerance;
  
  this._texCreated = false;
  this._needsUpdate = true;
  
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
    if(this._texCreated) {
      TentaGL.MaterialLib.remove(gl, this.getTextureName());
    }
  },
  
  /** 
   * Sets the text of this sprite. 
   * @param {string} text
   */
  setText:function(text) {
    this._text = text;
    this._needsUpdate = true;
  },
  
  /** 
   * Sets the font of this sprite. 
   * @param {TentaGL.Font} font
   */
  setFont:function(font) {
    this._font = font;
    this._needsUpdate = true;
  },
  
  /** 
   * Sets the color of this sprite.
   * @param {TentaGL.Color} color
   */
  setColor:function(color) {
    this._color = color;
    this._needsUpdate = true;
  },
  
  /** 
   * Sets the anti-aliasing tolerance of this sprite. 
   * @param {Number} tolerance
   */
  setAntialiasTolerance:function(tolerance) {
    this._tolerance = tolerance;
    this._needsUpdate = true;
  },
  
  
  /** 
   * Updates the internal texture used to display the text for this sprite. 
   * The texture is created in GL memory the first time this method is called.
   * @param {WebGLRenderingContext} gl
   */
  _update:function(gl) {
    if(!this._texCreated) {
      TentaGL.MaterialLib.add(this.getTextureName(), new TentaGL.Texture(gl));
      this._texCreated = true;
    }
    
    var textIconPixelData = TentaGL.PixelData.Canvas(TentaGL.Canvas2D.createString(this._text, this._font, this._color));
    textIconPixelData = textIconPixelData.filter(new TentaGL.RGBAFilter.OneColor(this._color, this._tolerance));
    this.getTexture().setPixelData(gl, textIconPixelData);
    
    this._needsUpdate = false;
  },
  
  
  
  /** Updates the TEXTure if necessary and then draws the sprite. */
  draw:function(gl) {
    if(this._needsUpdate) {
      this._update(gl);
    }
    
    TentaGL.IconSprite.prototype.draw.call(this, gl);
  }
};


TentaGL.Inheritance.inherit(TentaGL.TextIconSprite.prototype, TentaGL.IconSprite.prototype);

