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
    this._location = TentaGL.Texture.createGLTexture(gl);
    this._loaded = false;
  }
  else {
    throw Error("Invalid srcType: " + srcType);
  }
};


TentaGL.Texture.prototype = {
  
  constructor:TentaGL.Texture,

  /** 
   * Universal image source onload handler.
   * @param {WebGLRenderingContext} gl
   * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} src
   */
  _handleOnLoad:function(gl, src) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    this._loaded = true;
  },
  
  /** 
   * Deletes this texture from GL memory.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    gl.deleteTexture(this._location);
  },
  
  /** 
   * Returns the lcoation of this texture in GL memory.
   * @return {WebGLTexture}
   */
  getLocation:function() {
    return this._location;
  },
  
  /** 
   * Returns true iff the resource for this texture has finished loading.
   * @return {Boolean}
   */
  isLoaded:function() {
    return this._loaded;
  },
  
  /** 
   * Returns the constant for the current magnification filter being used.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.NEAREST or gl.LINEAR
   */
  getMagFilter:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER);
  },
  
  /**
   * Sets the magnification filter to be used with this texture.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} filter    Either gl.NEAREST or gl.LINEAR
   */
  setMagFilter:function(gl, filter) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  },
  
  /** 
   * Returns the constant for the current minification filter being used.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.NEAREST, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR,
   *       gl.NEAREST_MIPMAP_NEAREST, gl.NEARTEST_MIPMAP_LINEAR, or gl.LINEAR_MIPMAP_NEAREST.
   */
  getMinFilter:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER);
  },
  
  /**
   * Sets the minification filter to be used with this texture.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} filter    Either gl.NEAREST, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR,
   *       gl.NEAREST_MIPMAP_NEAREST, gl.NEARTEST_MIPMAP_LINEAR, or gl.LINEAR_MIPMAP_NEAREST.
   */
  setMinFilter:function(gl, filter) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  },
  
  /**
   * Gets the the wrapping method used for this texture on the S texture
   * coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.CLAMP_TO_EDGE, gl.REPEAR, or gl.MIRRORED_REPEAT.
   */
  getWrapS:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S);
  },
  
  /**
   * Sets the wrapping method used for this texture on the 
   * S texture coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} method
   */
  setWrapS:function(gl, method) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, method);
  },
  
  
  /**
   * Gets the the wrapping method used for this texture on the S texture
   * coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @return {GLenum} Either gl.CLAMP_TO_EDGE, gl.REPEAR, or gl.MIRRORED_REPEAT.
   */
  getWrapT:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T);
  },
  
  /**
   * Sets the wrapping method used for this texture on the 
   * T texture coordinates axis.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} method
   */
  setWrapT:function(gl, method) {
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, method);
  },
  
  
  /** 
   * Sets up the currently bound ShaderProgram so that its sampler2D uniform
   * variable "tex" will use this texture.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._location);
    TentaGL.ShaderLib.current(gl).setUniValue(gl, "tex", 0);
  }
};


TentaGL.Texture.SRC_PIXDATA = 1;
TentaGL.Texture.SRC_IMAGE = 2;
TentaGL.Texture.SRC_CANVAS = 3;
TentaGL.Texture.SRC_VIDEO = 4;


/** 
 * Creates an initially empty texture in GL memory. By default, this texture 
 * Displays as solid red and has its min-mag filters set to gl.NEAREST.
 * @param {WebGLRenderingContext} gl
 * @return {WebGLTexture}
 */
TentaGL.Texture.createGLTexture = function(gl) {
  var tex = gl.createTexture();
  
  gl.bindTexture(gl.TEXTURE_2D, tex);
  var loadingPixData = new Uint8Array([255, 0, 0, 255]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, loadingPixData);
  
  // Use gl.NEAREST by default for min-mag filters.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return tex;
};



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


