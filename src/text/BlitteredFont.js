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
 * @param {int} hPad              The horizontal padding between rendered characters, in pixels.
 * @param {int} vPad              The vertical padding between rendered characters, in pixels.
 */
TentaGL.BlitteredFont = function(pixelData, monospaced, charW, charH, hPad, vPad) {
  if(pixelData) {
    this._createChars(pixelData, monospaced, charW, charH);
  }
  
  if(hPad === undefined) {
    hPad = 1;
  }
  if(vPad === undefined) {
    vPad = 1;
  }
  
  this._hPad = hPad;
  this._vPad = vPad;
  
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
   * @param {TentaGL.PixelData} pixelData   The pixel data for the font map image.
   * @param {boolean} monospaced    Whether the blittered font is monospaced.
   * @param {uint} charW            The width of a single character image in the font map.
   * @param {uint} charH            The height of a single character image in the font map.
   */
  _createChars: function(pixelData, monospaced, charW, charH) {
    this._charPixData = {};
    this._charWidths = {};
    
    this._monospaced = monospaced;
    this._charW = charW;
    this._charH = charH;
    
    for(var c = 32; c < 128; c++) {
      var i = (c-32)%16;
      var j = Math.floor((c-32)/16);
      
      var x = 1 + i*(charW + 2);
      var y = pixelData.getHeight() - (1 + charH + j*(2 + charH));
      
      var charID = String.fromCharCode(c);
      var charPix = pixelData.crop(x, y, charW, charH);
      
      
      if(!monospaced && c != 32) {
        var left = 0;
        var right = charPix.getWidth() - 1;
        
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
        
        this._charWidths[charID] = w;
        this._charPixData[charID] = charPix;
        
        charPix.toCanvas();
      }
      else if(!monospaced && c == 32) {
        // None-monospaced spaces are half an em wide.
        this._charWidths[charID] = charW/2;
        this._charPixData[charID] = charPix;
        
        charPix.toCanvas();
      }
      else {
        this._charWidths[charID] = charW;
        this._charPixData[charID] = charPix;
        
        charPix.toCanvas();
      }
    }
  },
  
  
  /** 
   * Returns whether the blittered font is monospaced.
   * @return {boolean}
   */
  isMonospaced: function() {
    return this._monospaced;
  },
  
  
  /** 
   * Returns the height, in pixels, of a single line of text rendered with 
   * the blittered font. 
   * @return {uint}
   */
  getLineHeight: function() {
    return this._charH;
  },
  
  
  /**  
   * Returns the PixelData for a particular character in the blittered font.
   * @param {string} ch   The character.
   * @return {TentaGL.PixelData}
   */
  getCharPixelData: function(ch) {
    return this._charPixData[ch];
  },
  
  
  /** 
   * Returns the width, in pixels, of a particular character in the blittered font.
   * For a monospaced font, this returns the same value for all characters.
   * @param {string} ch   The character.
   * @return {uint}
   */
  getCharWidth: function(ch) {
    return this._charWidths[ch];
  },
  
  
  /** 
   * Returns the horizontal padding between characters for this blittered font, 
   * in pixels.
   * @return {uint}
   */
  getHorizontalPadding: function() {
    return this._hPad;
  },
  
  
  /** 
   * Returns the 
   */
  getVerticalPadding: function() {
    return this._vPad;
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
  },
  
  
  /** 
   * Returns the dimensions of a string rendered with this blittered font.
   * @param {string} text
   * @param {number} charH    Optional. If provided, the text will be uniformly 
   *      scaled such that every character's height is charH units. If omitted, 
   *      each character's height in units will be equal to the character pixel 
   *      height for this blittered font.
   * @return {[width: number, height: number]}
   */
  getStringDimensions: function(text, charH) {
    if(!this._charWidths) {
      return [0, 0];
    }
    
    var width = 0;
    var height = 0;
    
    var lineHeight = this.getLineHeight();
    var vPad = this.getVerticalPadding();
    var hPad = this.getHorizontalPadding();
    
    var s = 1;
    if(charH) {
      s = charH/lineHeight;
    }
    
    var lines = text.split("\n");
    for(var i=0; i < lines.length; i++) {
      var line = lines[i];
      
      var lineWidth = 0;
      
      for(var j=0; j < line.length; j++) {
        var ch = line.charAt(j);
        var w = this.getCharWidth(ch);
        
        lineWidth += w + hPad;
      }
      
      if(lineWidth > width) {
        width = lineWidth;
      }
      
      height += lineHeight + vPad;
    }
    
    return [width*s, height*s];
  },
  
  
  /** 
   * Renders a string using the blittered font.
   * @param {WebGLRenderingContext} gl
   * @param {string} text     The text to be rendered.
   * @param {vec3} xyz        The position to render the text at.
   * @param {boolean} yFlipped    Optional. Whether the y axis is flipped.  
   *      If true, y increases down. Else, y increases up. Default false.
   * @param {number} charH    Optional. If provided, the text will be uniformly 
   *      scaled such that every character's height is charH units. If omitted, 
   *      each character's height in units will be equal to the character pixel 
   *      height for this blittered font.
   */
  renderString: function(gl, text, xyz, yFlipped, charH) {
    if(!this._charPixData) {
      return;
    }
    
    // If this is the MaterialLib doesn't have the textures loaded, load them.
    if(!TentaGL.MaterialLib.has(gl, this._texIDPrefix + " ")) {
      this._createTextures(gl);
    }
    
    var h = this.getLineHeight();
    var vPad = this.getVerticalPadding();
    var hPad = this.getHorizontalPadding();
    
    TentaGL.ViewTrans.push(gl);
    
    TentaGL.ViewTrans.translate(gl, xyz);
    
    // If charH was provided, uniformly scale the transform so that each 
    // character's height will be charH.
    if(charH) {
      var s = charH/h;
      TentaGL.ViewTrans.scale(gl, [s,s]);
    }
    
    // Render the text line by line.
    var lines = text.split("\n");
    for(var i=0; i < lines.length; i++) {
      var line = lines[i];
      
      TentaGL.ViewTrans.push(gl);
      
      // Render the line character by character.
      for(var j=0; j < line.length; j++) {
        var ch = line.charAt(j);
        var texID = this._texIDPrefix + ch;
        var w = this.getCharWidth(ch);
        
        TentaGL.MaterialLib.use(gl, texID);
        
        // Render the character.
        TentaGL.ViewTrans.push(gl);
        TentaGL.ViewTrans.scale(gl, [w,h]);
        TentaGL.ViewTrans.updateMVPUniforms(gl);
        if(yFlipped) {
          TentaGL.ModelLib.render(gl, "unitSprite");
        }
        else {
          TentaGL.ModelLib.render(gl, "unitPlane");
        }
        TentaGL.ViewTrans.pop(gl);
        
        // Translate over to next character.
        TentaGL.ViewTrans.translate(gl, [w + hPad, 0]);
      }
      
      TentaGL.ViewTrans.pop(gl);
      
      // Translate down to next line.
      if(yFlipped) {
        TentaGL.ViewTrans.translate(gl, [0, h + vPad]);
      }
      else {
        TentaGL.ViewTrans.translate(gl, [0, -(h + vPad)]);
      }
    }
    
    TentaGL.ViewTrans.pop(gl);
  }
  
};


/** 
 * Produces a BlitteredFont from an fontmap image at some url. 
 * @param {string} url
 * @param {boolean} monospaced    Whether the font is monospaced.
 * @param {uint} charW            The width of each character image in the sprite map.
 * @param {uint} charH            The height of each character image in the sprite map.
 * @param {int} hPad              The horizontal padding between rendered characters, in pixels.
 * @param {int} vPad              The vertical padding between rendered characters, in pixels.
 * @param {function(pixels: TentaGL.PixelData): TentaGL.PixelData} pixelsCB  
 *      Optional. A callback function that manipulates the pixel data from the 
 *      fontmap image before using it to create the data for the blittered font.
 * @return {TentaGL.BlitteredFont}
 */
TentaGL.BlitteredFont.fromURL = function(url, monospaced, charW, charH, hPad, vPad, pixelsCB) {
  var bFont = new TentaGL.BlitteredFont(undefined, monospaced, charW, charH, hPad, vPad);
  
  TentaGL.PixelData.fromURL(url, function(pixels) {
    if(pixelsCB) {
      pixels = pixelsCB(pixels);
    }
    
    bFont._createChars(pixels, monospaced, charW, charH);
  });
  
  return bFont;
};



/** 
 * Produces a BlitteredFont from a Font with some Color.
 * @param {TentaGL.Font} font
 * @param {TentaGL.Color} color
 * @param {function(pixels: TentaGL.PixelData): TentaGL.PixelData} pixelsCB  
 *      Optional. A callback function that manipulates the pixel data from the 
 *      fontmap image before using it to create the data for the blittered font.
 * @return {TentaGL.BlitteredFont}
 */
TentaGL.BlitteredFont.fromFont = function(font, color, hPad, vPad, pixelsCB) {
  var monospaced = (font.getType() == "monospace");
  var dimsEm = font.getStringDimensions("W");
  var charW = Math.floor(dimsEm[0]);
  var charH = Math.floor(dimsEm[1]);
  
  var bFont = new TentaGL.BlitteredFont(undefined, monospaced, charW, charH, hPad, vPad);
  
  // Create a canvas for the fontmap.
  var bgColor;
  if(color.r() + color.g() + color.b() > 1.5) {
    bgColor = new TentaGL.Color.RGBA(0,0,0,1);
  }
  else {
    bgColor = new TentaGL.Color.RGBA(1,1,1,1);
  }
  
  var canvas = TentaGL.Canvas2D.create((charW + 2)*16, (charH + 2)*6, bgColor);
  
  for(var c = 32; c < 128; c++) {
    var i = (c-32)%16;
    var j = Math.floor((c-32)/16);
    
    var x = 1 + i*(charW + 2);
    var y = 1 + j*(charH + 2);
    
    var charID = String.fromCharCode(c);
    
    var charCanvas = TentaGL.Canvas2D.create(charW, charH, bgColor);
    TentaGL.Canvas2D.drawString(charCanvas, charID, font, color, 0, 0);
    
    TentaGL.Canvas2D.drawImage(canvas, charCanvas, x, y);
  }
  
  
  
  
  // Convert our fontmap canvas to PixelData. Make the bgColor transparent
  // and use the pixelsCB to apply any other filters provided by the user.
  var pixels = TentaGL.PixelData.fromCanvas(canvas);
  pixels = pixels.filter(new TentaGL.RGBAFilter.OneColor(color, 0.5));
  if(pixelsCB) {
    pixels = pixelsCB(pixels);
  }
  
  // Set the pixel data for the blittered font.
  bFont._createChars(pixels, monospaced, charW, charH);
  
  return bFont;
};





