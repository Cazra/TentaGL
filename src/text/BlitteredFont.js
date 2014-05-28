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
 * A custom font produced from a sprite map of character images.
 * @constructor
 * @param {TentaGL.PixelData} pixelData   The pixel data for the sprite map for the font.
 *      The sprite map should have 16 characters per row with character 0x20 
 *      (space character) first in the upper left corner. It is als assumed that 
 *      each character image in the map has the same dimensions and has a 
 *      1-pixel border. See the example font map at images/finalFontasy.png.
 * @param {boolean} monospaced    Whether the font is monospaced.
 * @param {uint} charW            The width of each character image in the sprite map.
 * @param {uint} charH            The height of each character image in the sprite map.
 */
TentaGL.BlitteredFont = function(pixelData, monospaced, charW, charH) {
  this._createChars(pixelData, monospaced, charW, charH);
  
  this._hPad = 1;
  this._vPad = 1;
  
  this._texIDPrefix = "bfont" + TentaGL.BlitteredFont._count + ":";
  TentaGL.BlitteredFont._count++;
};

TentaGL.BlitteredFont._count = 0;

TentaGL.BlitteredFont.prototype = {
  
  constructor: TentaGL.BlitteredFont,
  
  isaBlitteredFont: true,
  
  /** 
   * Removes the textures for each character of this blittered font from the 
   * GL context. 
   */
  clean: function(gl) {
    for(var c in this._charPixData) {
      var id = this._texIDPrefix + c;
      
      TentaGL.MaterialLib.remove(gl, id);
    }
  },
  
  
  /** 
   * Creates the pixel data for each of the characters in this blittered font.
   */
  _createChars: function(pixelData, monospaced, charW, charH) {
    this._charPixData = {};
    this._charWidths = {};
    
    this._monospaced = monospaced;
    this._charW = charW;
    this._charH = charH;
    
    for(var c = 32; i < 128; i++) {
      var i = (c-32)%16;
      var j = (c-32)/16;
      
      var x = 1 + i*(charW + 2);
      var y = pixelData.getHeight() - (1 + j*(charH + 2)) - 1;
      
      var charID = String.fromCharCode(c);
      var charPix = pixelData.crop(x, y, charW, charH);
      
      
      if(monospaced && c != 32) {
        var left = 0;
        var right = charPix.getWidth();
        
        // Find the left border.
        var leftFound = false;
        while(left < right && !leftFound) {
          for(var y=0; y < charPix.getHeight(); y++) {
            if(charPix.getPixelAt(left, y)[3] != 0) { 
              leftFound = true;
              break;
            }
          }
          
          if(!leftFound) {
            left++;
          }
        }
        
        // Find the right border.
        var rightFound = false;
        while(right > left && !rightFound) {
          for(var y=0; y < charPix.getHeight(); y++) {
            if(charPix.getPixelAt(right, y)[3] != 0) { 
              rightFound = true;
              break;
            }
          }
          
          if(!rightFound) {
            right--;
          }
        }
        
        var w = right - left + 1;
        charPix = charPix.crop(left, 0, w, charH);
        
        this._charWidths[charId] = w;
        this._charPixData[charID] = charPix;
      }
      else {
        this._charWidths[charId] = charW;
        this._charPixData[charID] = charPix;
      }
    }
  },
  
  /** 
   * Creates the textures for each character in the blittered font in the 
   * GL context. 
   * @param {WebGLRenderingContext} gl
   */
  _createTextures: function(gl) {
    for(var c in this._charPixData) {
      var id = this._texIDPrefix + c;
      
      var charTex = TentaGL.Texture.fromPixelData(gl, this._charPixData[c]);
      TentaGL.MaterialLib.add(gl, id, charTex);
    }
  }
  
};
