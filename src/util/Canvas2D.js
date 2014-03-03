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
 * Provides a small framework for creating offscreen Canvas elements and 
 * drawing to them. 
 */
TentaGL.Canvas2D = {
  
  /** 
   * Creates and returns a Canvas element of the specified width and height. 
   * @param {int} width
   * @param {int} height
   * @return {Canvas}
   */
  create:function(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  
  
  /** 
   * Draws a string to a Canvas. This supports newline characters '\n'.
   * @param {string} str
   * @param {TentaGL.Font} font
   * @param {TentaGL.Color} 
   * @param {int} x   The position of the left edge of the rendered text.
   * @param {int} y   The position of the top edge of the rendered text.
   * @return {Canvas} canvas, for chaining.
   */
  drawString:function(canvas, str, font, color, x, y) {
    if(!x) {
      x = 0;
    }
    if(!y) {
      y = 0;
    }
    
    var g = canvas.getContext("2d");
    g.save();
    g.webkitImageSmoothingEnabled = false;
    g.font = font.toCSS();
    g.lineWidth = 1;
    g.fillStyle = color.toCSS();
    
    var lines = str.split("\n");
    for(var i in lines) {
      var line = lines[i];
      
      g.translate(0, font.getSize());
      g.fillText(line, x, y);
      g.translate(0, font.getVerticalPadding());
    }
    
    g.restore();
    
    return canvas;
  },
  
  
  /** 
   * Creates a new canvas with a rendered string.
   * @param {string} str
   * @param {TentaGL.Font} font
   * @param {TentaGL.Color} color
   * @return {Canvas}
   */
  createString:function(str, font, color) {
    var dims = font.getStringDimensions(str);
    var canvas = this.create(dims[0], dims[1]);
    var g = canvas.getContext("2d");
    
    if(color.getRed() == 1 && color.getGreen() == 1 && color.getBlue() == 1) {
      g.fillStyle = "black";
      g.fillRect(0,0,dims[0], dims[1]);
    }
    else {
      g.fillStyle = "white";
      g.fillRect(0,0,dims[0], dims[1]);
    }
    
    return this.drawString(canvas, str, font, color, 0, 0);
  },
};

