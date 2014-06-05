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
 * A sprite for blittered text.
 * @constructor
 * @param {vec3} xyz    The position of the sprite.
 * @param {string} text   The text displayed by this sprite. 
 * @param {TentaGL.BlitteredFont} blitFont    The BlitteredFont used to render 
 *      the text.
 * @param {boolean} yFlipped    Optional. Whether the y axis is flipped.  
 *      If true, y increases down. Else, y increases up. Default false.
 * @param {number} charH    Optional. The preferred height for a single line 
 *      of text displayed with this sprite. If omitted, the height of a line of 
 *      text will be a number of units equal to the blittered font's pixel line 
 *      height.
 */
TentaGL.TextSprite = function(xyz, text, blitFont, yFlipped, charH) {
  TentaGL.Sprite.call(this, xyz);

  if(!yFlipped) {
    yFlipped = false;
  }
  
  this._blitFont = blitFont;
  this._text = text;
  this._yFlipped = yFlipped;
  this._charH = charH;
};


TentaGL.TextSprite.prototype = {
  
  constructor: TentaGL.TextSprite,
  
  isaTextSprite: true,
  
  
  /** 
   * Returns the text displayed by this sprite.
   * @return {string}
   */
  getText: function() {
    return this._text;
  },
  
  /** 
   * Sets the text displayed by this sprite.
   * @param {string} text
   */
  setText: function(text) {
    this._text = text;
  },
  
  
  /** 
   * Returns the BlitteredFont used to render this sprite's text.
   * @return {TentaGL.BlitteredFont}
   */
  getBlitteredFont: function() {
    return this._blitFont;
  },
  
  
  /** 
   * Sets the BlitteredFont used to render this sprite's text.
   * @param {TentaGL.BlitteredFont} font
   */
  setBlitteredFont: function(font) {
    this._blitFont = font;
  },
  
  
  
  /** 
   * Returns the preferred height of a single line of text displayed by this 
   * sprite.
   * @return {number}
   */
  getLineHeight: function() {
    if(this._charH === undefined) {
      this._blitFont.getLineHeight();
    }
    else {
      return this._charH;
    }
  },
  
  /** 
   * Sets the preferred height of a single line of text displayed by this 
   * sprite. If set to undefined, this will be the line height of the blittered 
   * font, in pixels.
   * @param {number} h
   */
  setLineHeight: function(h) {
    this._charH = h;
  },
  
  
  
  /** 
   * Draws the sprite.
   * @param {WebGLRenderingContext} gl
   */
  draw: function(gl) {
    this._blitFont.renderString(gl, this._text, [0,0,0], this._yFlipped, this._charH);
  }
};

Util.Inheritance.inherit(TentaGL.TextSprite, TentaGL.Sprite);

