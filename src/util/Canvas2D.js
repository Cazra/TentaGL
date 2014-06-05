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
 * Please remember that when drawing on a canvas, the positive Y axis is down
 * and the origin is at the upper-left corner of the canvas.
 */
TentaGL.Canvas2D = {
  
  /** 
   * Creates and returns a Canvas element of the specified width and height. 
   * @param {int} width
   * @param {int} height
   * @param {TentaGL.Color} color   Optional. A background color for the canvas.
   * @return {Canvas}
   */
  create:function(width, height, color) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    if(color) {
      this.drawRect(canvas, 0, 0, width, height, false, 0, color);
    }
    
    return canvas;
  },
  
  
  /** 
   * Sets the alpha component of all pixels that aren't 255 to 0.
   * If your application doesn't enable blending, you may want to use this on
   * any textures produced from canvas renderings. Otherwise you'll end up
   * with a messy white-ish outline.
   * @param {Canvas} canvas
   * @return {Canvas}
   */
  removeAlpha:function(canvas) {
    var g = canvas.getContext("2d");
    var pixels = g.getImageData(0, 0, canvas.width, canvas.height);
    var data = pixels.data;
    
    for(var i=0; i<data.length; i+=4) {
      if(data[i+3] < 255) {
        data[i+3] = 0;
      }
    }
    
    g.putImageData(pixels, 0, 0);
    
    return canvas;
  },
  
  
  
  /** 
   * Draws a string to a Canvas. This supports newline characters '\n'.
   * @param {Canvas} canvas
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
    
    this.drawString(canvas, str, font, color, 0, 0);
    return canvas;
  },
  
  
  /** 
   * Draws a circle onto a Canvas. 
   * @param {Canvas} canvas
   * @param {Number} cx   The center X coordinate of the circle.
   * @param {Number} cy   The center Y coordinate of the circle.
   * @param {Number} r    The radius of the circle, sans edge thickness.
   * @param {TentaGL.Color} stroke  The color for the edge of the circle.
   * @param {Number} edgeW    The thickness of the edge of the circle.
   * @param {TentaGL.Color} fill    The color for the interior of the circle.
   * @return {Canvas}
   */
  drawCircle:function(canvas, cx, cy, r, stroke, edgeW, fill) {
    var g = canvas.getContext("2d");
    g.save();
    
    g.beginPath();
    g.arc(cx, cy, r, 0, TentaGL.TAU);
    if(fill) {
      g.fillStyle = fill.toCSS();
      g.fill();
    }
    if(stroke) {
      g.strokeStyle = stroke.toCSS();
      g.lineWidth = edgeW;
      g.stroke();
    }
    
    g.restore();
    return canvas;
  },
  
  
  /** 
   * Creates a new canvas with a rendered circle. 
   * @param {Number} r  The radius of the circle, sans edge thickness.
   * @param {TentaGL.Color} stroke  The color for the edge of the circle.
   * @param {Number} edgeW    The thickness of the edge of the circle.
   * @param {TentaGL.Color} fill    The color for the interior of the circle.
   * @return {Canvas}
   */
  createCircle:function(r, stroke, edgeW, fill) {
    var sideLen = r*2 + edgeW;
    var canvas = this.create(sideLen, sideLen);
    this.drawCircle(canvas, r+edgeW/2, r+edgeW/2, r, stroke, edgeW, fill);
    return canvas;
  },
  
  
  /** 
   * Draws a rectangle onto a canvas. 
   * @param {Canvas} canvas
   * @param {Number} x    The x coordinate of the rectangle's left edge.
   * @param {Number} y    The y coordinate of the rectangle's top edge.
   * @param {Number} w    The rectangle's width, sans edge thickness.
   * @param {Number} h    The rectangle's height, sans edge thickness.
   * @param {TentaGL.Color} stroke  The color for the edge of the rectangle.
   * @param {Number} edgeW  The thickness of the edge of the rectangle.
   * @param {TentaGL.Color} fill    The color of the interior of the rectangle.
   * @return {Canvas}
   */
  drawRect:function(canvas, x, y, w, h, stroke, edgeW, fill) {
    var g = canvas.getContext("2d");
    g.save();
    
    if(fill) {
      g.fillStyle = fill.toCSS();
      g.fillRect(x, y, w, h);
    }
    if(stroke) {
      g.strokeStyle = stroke.toCSS();
      g.lineWidth = edgeW;
      g.strokeRect(x, y, w, h);
    }
    
    g.restore();
    return canvas;
  },
  
  /** 
   * Creates a new canvas with a rendered rectangle. 
   * @param {Number} w
   * @param {Number} h
   * @param {TentaGL.Color} stroke  The color for the edge of the rectangle.
   * @param {Number} edgeW  The thickness of the edge of the rectangle.
   * @param {TentaGL.Color} fill    The color of the interior of the rectangle.
   * @return {Canvas}
   */
  createRect:function(w, h, stroke, edgeW, fill) {
    var canvas = this.create(w + edgeW, h + edgeW);
    this.drawRect(canvas, edgeW/2, edgeW/2, w, h, stroke, edgeW, fill);
    return canvas;
  },
  
  
  /** 
   * Draws a rounded rectangle onto a canvas. 
   * @param {Canvas} canvas
   * @param {Number} x    The x coordinate of the rectangle's left edge.
   * @param {Number} y    The y coordinate of the rectangle's top edge.
   * @param {Number} w    The rectangle's width, sans edge thickness.
   * @param {Number} h    The rectangle's height, sans edge thickness.
   * @param {Number} r    The radius of the rounded corners.
   * @param {TentaGL.Color} stroke  The color for the edge of the rectangle.
   * @param {Number} edgeW  The thickness of the edge of the rectangle.
   * @param {TentaGL.Color} fill    The color of the interior of the rectangle.
   * @return {Canvas}
   */
  drawRoundedRect:function(canvas, x, y, w, h, r, stroke, edgeW, fill) {
    var g = canvas.getContext("2d");
    g.save();
    
    g.beginPath();
    g.moveTo(x+r, y);
    g.lineTo(x+w-r, y);
    g.arc(x+w-r, y+r, r, TentaGL.TAU*3/4, 0);
    g.lineTo(x+w, y+h-r);
    g.arc(x+w-r, y+h-r, r, 0, TentaGL.TAU*1/4);
    g.lineTo(x+r, y+h);
    g.arc(x+r, y+h-r, r, TentaGL.TAU*1/4, TentaGL.TAU*2/4);
    g.lineTo(x, y+r);
    g.arc(x+r, y+r, r, TentaGL.TAU*2/4, TentaGL.TAU*3/4);
    
    if(fill) {
      g.fillStyle = fill.toCSS();
      g.fill();
    }
    if(stroke) {
      g.strokeStyle = stroke.toCSS();
      g.lineWidth = edgeW;
      g.stroke();
    }
    
    g.restore();
    return canvas;
  },
  
  
  /** 
   * Creates a new canvas with a rendered rounded rectangle. 
   * @param {Number} w    The rectangle's width, sans edge thickness.
   * @param {Number} h    The rectangle's height, sans edge thickness.
   * @param {Number} r    The radius of the rounded corners.
   * @param {TentaGL.Color} stroke  The color for the edge of the rectangle.
   * @param {Number} edgeW  The thickness of the edge of the rectangle.
   * @param {TentaGL.Color} fill    The color of the interior of the rectangle.
   * @return {Canvas}
   */
  createRoundedRect:function(w, h, r, stroke, edgeW, fill) {
    var canvas = this.create(w + edgeW, h + edgeW);
    this.drawRoundedRect(canvas, edgeW/2, edgeW/2, w, h, r, stroke, edgeW, fill);
    return canvas;
  },
  
  
  
  /** 
   * Draws an image or canvas element onto a canvas. 
   * @param {Canvas} canvas
   * @param {Image | Canvas} 
   * @param {int} x   The x coordinate of the image's left edge.
   * @param {int} y   The y coordinate of the image's top edge.
   * @param {uint} w  Optional. The stretched width of the image.
   * @param {uint} h  Optional. The stretched height of the image.
   * @return {Canvas}
   */
  drawImage: function(canvas, img, x, y, w, h) {
    var g = canvas.getContext("2d");
    
    console.log(canvas, img, x, y, w, h);
    
    if(w && h) {
      g.drawImage(img, x, y, w, h);
    }
    else {
      g.drawImage(img, x, y);
    }
    return canvas;
  },
  
  
  /** 
   * Creates a new canvas with a rendered image.
   * The canvas is fitted to the size of the image.
   * @param {Image | Canvas} img
   * @param {int} w   Optional. The stretched width of the image.
   * @param {int} h   Optional. The stretched height of the image.
   * @return {Canvas}
   */
  createImage: function(img, w, h) {
    var canvasW, canvasH;
    if(w) {
      canvasW = w;
    }
    else {
      canvasW = img.width;
    }
    
    if(h) {
      canvasH = h;
    }
    else {
      canvasH = img.height;
    }
    
    var canvas = this.create(canvasW, canvasH);
    this.drawImage(canvas, img, 0, 0, w, h);
    return canvas;
  },
  
  
  /** 
   * Creates a canvas as a cropped copy of an existing canvas or image.
   * @param {Image | Canvas} src
   * @param {uint} x  The left edge of the cropping region.
   * @param {uint} y  The top edge of the cropping region.
   * @param {uint} w  The width of the cropping region.
   * @param {uint} h  The height of the cropping region.
   * @return {Canvas}
   */
  crop: function(src, x, y, w, h) {
    var canvas = this.create(w, h);
    var g = canvas.getContext("2d");
    
    g.drawImage(src, x, y, w, h, 0, 0);
    
    return canvas;
  }
  
};

