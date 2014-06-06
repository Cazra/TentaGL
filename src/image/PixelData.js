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
 * Encapsulates a rectangular area of raw pixel data.
 * @constructor
 * @param {Uint8Array} rgbaByteArray   The array containing the pixel data.
 *      The size of the array should be width*height*4, each element should be 
 *      represented by 4 consecutive bytes in RGBA order, and the first 
 *      element should be the pixel in the lower-left corner of the image the 
 *      array represents. Each row in the array is read from bottom to top, 
 *      and left to right in each row.
 * @param {int} width
 * @param {int} height
 */
TentaGL.PixelData = function(rgbaByteArray, width, height) {
  this._pixels = rgbaByteArray;
  this._width = width;
  this._height = height;
};


TentaGL.PixelData.prototype = {
  
  constructor:TentaGL.PixelData,
  
  /** Produces a copy of this PixelData. */
  clone:function() {
    var pixels = new Uint8Array(this._pixels.length);
    for(var i=0; i < this._pixels.length; i++) {
      pixels[i] = this._pixels[i];
    }
    
    return new TentaGL.PixelData(pixels, this._width, this._height);
  },
  
  
  /** 
   * Returns the width of the pixel area. 
   * @return {int}
   */
  getWidth:function() {
    return this._width;
  },
  
  /** 
   * Returns the height of the pixel area. 
   * @return {int}
   */
  getHeight:function() {
    return this._height;
  },
  
  
  /**
   * Returns the array of pixel data wrapped by this object.
   * @return {Uint8Array}
   */
  getData:function() {
    return this._pixels;
  },
  
  
  /** 
   * Extracts the RGBA values of the pixel at the specified coordinates in the 
   * source data. 
   * @param {int} x
   * @param {int} y
   * @param {int} flipY   Optional. If true, y increases downward. 
   *      Default to false.
   * @return {length-4 array}   An array containing the RGBA byte values for 
   *      the pixel.
   */
  getPixelAt:function(x, y, flipY) {
    if(flipY) {
      y = this.height-1-y;
    }
    
    var index = (this._width*y + x)*4;
    var r = this._pixels[index];
    var g = this._pixels[index+1];
    var b = this._pixels[index+2];
    var a = this._pixels[index+3];
    return [r, g, b, a];
  },
  
  
  /** 
   * Sets the rgba value for the pixel at the specified coordinates in the
   * PixelData.
   * @param {int} x
   * @param {int} y
   * @param {vec4} rgba
   * @param {int} flipY   Optional. If true, y increases downward. 
   *      Default to false.
   */
  setPixelAt:function(x, y, rgba, flipY) {
    if(flipY) {
      y = this.height-1-y;
    }
    
    var index = (this._width*y + x)*4;
    this._pixels[index] = rgba[0];
    this._pixels[index+1] = rgba[1];
    this._pixels[index+2] = rgba[2];
    this._pixels[index+3] = rgba[3];
  },
  
  
  /** 
   * Returns a copy of this PixelData with some filter function applied to
   * all its pixels.
   * @param {TentaGL.RGBAFilter} filter
   * @return TentaGL.PixelData
   */
  filter:function(filter) {
    var result = this.clone();
    
    for(var i=0; i < this._pixels.length; i+=4) {
      filter.filter(result._pixels, this._pixels, i, this._width, this._height);
    }
    
    return result;
  },
  
  
  /** 
   * Returns a cropped copy of this PixelData. Remember, in WebGL, the (0,0)
   * is actually at the lower-left corner of the image and (w,h) is at the
   * upper-right corner.
   * @param {int} x
   * @param {int} y
   * @param {int} w
   * @param {int h}
   */
  crop:function(x, y, w, h) {
    
    var data = new Uint8Array(w*h*4);
    for(var dx=x; dx < x+w; dx++) {
      for(var dy=y; dy < y+h; dy++) {
        var si = (this._width*dy + dx)*4;
        var di = (w*(dy-y) + (dx-x))*4;
        
        data[di] = this._pixels[si];
        data[di+1] = this._pixels[si+1];
        data[di+2] = this._pixels[si+2];
        data[di+3] = this._pixels[si+3];
      }
    }
    
    return new TentaGL.PixelData(data, w, h);
  },
  
  
  /** 
   * Produces a canvas element from this pixel data. 
   * @return {canvas element}
   */
  toCanvas: function() {
    var canvas = document.createElement("canvas");
    var w = canvas.width = this.getWidth();
    var h = canvas.height = this.getHeight();
    
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(w,h);
    
    for(var si=0; si < this._pixels.length; si+=4) {
      var xy = TentaGL.PixelData.indexToXY(si, w);
      var x = xy[0];
      var y = h-xy[1]-1;
      
      var di = TentaGL.PixelData.xyToIndex(x, y, w);
      
      imgData.data[di] = this._pixels[si];
      imgData.data[di+1] = this._pixels[si + 1];
      imgData.data[di+2] = this._pixels[si + 2];
      imgData.data[di+3] = this._pixels[si + 3];
    }
    
    ctx.putImageData(imgData, 0, 0);
    
    var container = document.getElementById("imgDebug");
    if(container) {
      container.appendChild(canvas);
    }
    
    return canvas;
  },
};


/** 
 * Extracts and returns the PixelData for a texture stored in GL memory. 
 * @param {WebGLRenderingContext} gl
 * @param {WebGLTexture} glTex
 * @param {int} x
 * @param {int} y
 * @param {int} w
 * @param {int} h
 * @param {Uint8Array} bytes      Optional. A pre-allocated byte array to store 
 *      the pixel data in. The size of this array should be at least 4*w*h. 
 */
TentaGL.PixelData.fromGLTexture = function(gl, glTex, x, y, w, h, bytes) {
  
  var fb = gl.createFramebuffer();
  gl.bindFramebuffer(GL_FRAMEBUFFER, fb);
  gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, glTex, 0);
  
  if(!bytes) {
    bytes = new Uint8Array(w*h*4);
  }
  gl.readPixels(x, y, w, h, GL_RGBA, GL_UNSIGNED_BYTE, bytes);
  
  gl.bindFramebuffer(GL_FRAMEBUFFER, null);
  gl.deleteFramebuffer(fb);
  
  return new TentaGL.PixelData(bytes, w, h);
};



/** 
 * Produces PixelData from an image at the specifed url. 
 * Due to the asynchronous behavior of loading images, a callback function
 * must be provided to use the resulting PixelData.
 * @param {string} url
 * @param {function(data : TentaGL.PixelData) : undefined} callback   
 *      A callback for any post-processing of the PixelData for the image,  
 *      including application of RGBAFilters and loading it into a gl context's
 *      MaterialLib.
 */
TentaGL.PixelData.fromURL = function(url, callback) {
  TentaGL.ImageLoader.load(url, function(img) {
    // Produce a canvas that we can draw our image on and read pixels back from.
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    
    // Extract the pixel data from the canvas with our image rendered to it,
    // then process it with our callback.
    var result = TentaGL.PixelData.fromCanvas(canvas);
    callback(result);
  });
};



/** 
 * Produces PixelData from a Canvas element. 
 * @param {Canvas} canvas
 * @return {TentaGL.PixelData}
 */
TentaGL.PixelData.fromCanvas = function(canvas) {
  var container = document.getElementById("imgDebug");
  if(container) {
    container.appendChild(canvas);
  }
  
  var width = canvas.width;
  var height = canvas.height;
  
  var srcData = canvas.getContext("2d").getImageData(0, 0, width, height).data;
  var dstData = new Uint8Array(width*height*4);
  
  for(var x=0; x < width; x++) {
    for(var y=0; y < height; y++) {
      var si = (y*width + x)*4;
      
      var dstY = height-1-y;
      var di = (dstY*width + x)*4;
      
      dstData[di] = srcData[si];
      dstData[di+1] = srcData[si+1];
      dstData[di+2] = srcData[si+2];
      dstData[di+3] = srcData[si+3];
    }
  }
  
  return new TentaGL.PixelData(dstData, width, height);
};


/** 
 * Converts a GL pixel array index to GL X, Y coordinates. 
 */
TentaGL.PixelData.indexToXY = function(index, width) {
  index /= 4;
  var y = Math.floor(index/width);
  var x = index - y*width;
  
  return [x, y];
};


/**
 * Converts GL X,Y coordinates to a GL pixel array index.
 */
TentaGL.PixelData.xyToIndex = function(x, y, width) {
  return 4*(width*y + x);
};
