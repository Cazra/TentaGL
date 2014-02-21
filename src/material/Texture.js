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
 * Constructs a Texture in the WebGL state that is ready to receive data from 
 * some image source. Any shader using this material must have a sampler2D
 * uniform variable named "tex" to access its pixel data.
 * @constructor
 * @param {WebGLRenderingContext} gl
 * @param {int} srcType   One of either TentaGL.Texture.SRC_PIXDATA, 
 *      TentaGL.Texture.SRC_IMAGE, TentaGL.Texture.SRC_CANVAS, 
 *      or TentaGL.Texture.SRC_VIDEO.
 */
TentaGL.Texture = function(gl, srcType) {
  if(srcType === TentaGL.Texture.SRC_PIXDATA || 
    srcType === TentaGL.Texture.SRC_IMAGE ||
    srcType === TentaGL.Texture.SRC_CANVAS ||
    srcType === TentaGL.Texture.SRC_VIDEO) {
    
    this._srcType = srcType;
    this._tex = TentaGL.createTexture(gl);
    this._width = 1;
    this._height = 1;
    this._loaded = false;
  }
  else {
    throw Error("Invalid srcType: " + srcType);
  }
};


TentaGL.Texture.prototype = {
  
  constructor:TentaGL.Texture,

  /** 
   * DOM image source onload handler.
   * @param {WebGLRenderingContext} gl
   * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} src
   */
  _handleOnLoad:function(gl, src) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    
    this._width = src.width;
    this._height = src.height;
    this._loaded = true;
  },
  
  /** 
   * Sets the contents of the texture to a byte array of pixel data.
   * @param {WebGLRenderingContext} gl
   * @param {Uint8Array} data   The array containing the pixel data.
   *      The size of the array should be width*height*4, each element should be 
   *      represented by 4 consecutive bytes in RGBA order, and the first 
   *      element should be the pixel in the lower-left corner of the image the 
   *      array represents. Each row in the array is read from bottom to top, 
   *      and left to right in each row.
   * @param {int} width
   * @param {int} height
   */
  loadRGBAData:function(gl, data, width, height) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    this._width = width;
    this._height = height;
    this._loaded = true;
  },
  
  /** 
   * Deletes this texture from GL memory.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    gl.deleteTexture(this._tex);
  },
  
  /** 
   * Returns the lcoation of this texture in GL memory.
   * @return {WebGLTexture}
   */
  getLocation:function() {
    return this._tex;
  },
  
  /** 
   * Returns true iff the resource for this texture has finished loading.
   * @return {Boolean}
   */
  isLoaded:function() {
    return this._loaded;
  },
  
  
  /** 
   * Returns the width of the texture if it is available.
   * @return {int}
   */
  getWidth:function() {
    return this._width;
  },
  
  
  /** 
   * Returns the height of the texture if it is available. 
   * @return {int}
   */
  getHeight:function() {
    return this._height;
  },
  
  /** 
   * Returns the constant for the current magnification filter being used.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.NEAREST or gl.LINEAR
   */
  getMagFilter:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER);
  },
  
  /**
   * Sets the magnification filter to be used with this texture.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} filter    Either gl.NEAREST or gl.LINEAR
   */
  setMagFilter:function(gl, filter) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  },
  
  /** 
   * Returns the constant for the current minification filter being used.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.NEAREST, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR,
   *       gl.NEAREST_MIPMAP_NEAREST, gl.NEARTEST_MIPMAP_LINEAR, or gl.LINEAR_MIPMAP_NEAREST.
   */
  getMinFilter:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER);
  },
  
  /**
   * Sets the minification filter to be used with this texture.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} filter    Either gl.NEAREST, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR,
   *       gl.NEAREST_MIPMAP_NEAREST, gl.NEARTEST_MIPMAP_LINEAR, or gl.LINEAR_MIPMAP_NEAREST.
   */
  setMinFilter:function(gl, filter) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  },
  
  /**
   * Gets the the wrapping method used for this texture on the S texture
   * coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.CLAMP_TO_EDGE, gl.REPEAR, or gl.MIRRORED_REPEAT.
   */
  getWrapS:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S);
  },
  
  /**
   * Sets the wrapping method used for this texture on the 
   * S texture coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} method
   */
  setWrapS:function(gl, method) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, method);
  },
  
  
  /**
   * Gets the the wrapping method used for this texture on the S texture
   * coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.CLAMP_TO_EDGE, gl.REPEAR, or gl.MIRRORED_REPEAT.
   */
  getWrapT:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T);
  },
  
  /**
   * Sets the wrapping method used for this texture on the 
   * T texture coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} method
   */
  setWrapT:function(gl, method) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, method);
  },
  
  
  /** 
   * Produces a PixelData object containing the raw pixel data of some 
   * rectangular area of this texture. Here, X and Y are the coordinates of the 
   * lower-left corner of the area.
   * @param {WebGLRenderingContext} gl
   * @param {int} x   Optional. Default 0.
   * @param {int} y   Optional. Default 0.
   * @param {int} w   Optional. Defaults to the width of the texture - x.
   * @param {int} h   Optional. Defaults to the height of the texture - y.
   * @return {TentaGL.PixelData}
   */
  getPixelData:function(gl, x, y, w, h) {
    x = x || 0;
    y = y || 0;
    w = w || this._width - x;
    h = h || this._height - y;
    
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glTex, 0);
    
    var data = new Uint8Array(w*h*4);
    gl.readPixels(x, y, w, h, gl.RGBA, data);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
    
    return new TentaGL.PixelData(data, w, h);
  },
  
  
  /** 
   * Sets up the currently bound ShaderProgram so that its sampler2D uniform
   * variable "tex" will use this texture.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    var shader = TentaGL.ShaderLib.current(gl);
    
    if(shader.hasUniform("tex")) {
      shader.setUniValue(gl, "tex", 0);
    }
  }
};


TentaGL.Texture.SRC_PIXDATA = 1;
TentaGL.Texture.SRC_IMAGE = 2;
TentaGL.Texture.SRC_CANVAS = 3;
TentaGL.Texture.SRC_VIDEO = 4;



/** 
 * Returns a new Texture constructed from an image. 
 * @param {WebGLRenderingContext} gl
 * @param {string} imagePath  The filepath to the image.
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.Image = function(gl, imagePath) {
  var result = new TentaGL.Texture(gl, TentaGL.Texture.SRC_IMAGE);
  var img = new Image();
  img.onload = function() {
    result._handleOnLoad(gl, img);
  };
  img.src = imagePath;
  return result;
};


/** 
 * Returns a new Texture constructed from a PixelData object.
 * @param {WebGLRenderingContext} gl
 * @param {TentaGL.PixelData} pixelData
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.PixelData = function(gl, pixelData) {
  return TentaGL.Texture.RGBAUint8Array(gl, pixelData.getData(), pixelData.getWidth(), pixelData.getHeight());
};


/** 
 * Returns a new Texture constructed from a byte array of RGBA pixel data.
 * @param {WebGLRenderingContext} gl
 * @param {Uint8Array} data   The array containing the pixel data.
 *      The size of the array should be width*height*4, each element should be 
 *      represented by 4 consecutive bytes in RGBA order, and the first 
 *      element should be the pixel in the lower-left corner of the image the 
 *      array represents. Each row in the array is read from bottom to top, 
 *      and left to right in each row.
 * @param {int} width
 * @param {int} height
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.Uint8Array = function(gl, data, width, height) {
  var result = new TentaGL.Texture(gl, TentaGL.Texture.SRC_PIXDATA);
  result.loadRGBAData(gl, data, width, height);
  return result;
}

