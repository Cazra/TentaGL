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
 * Constructs an initially empty texture. The texture's image data can be set
 * by constructing a PixelData object and loading it with the setPixelData 
 * method.
 * @constructor
 * @param {WebGLRenderingContext} gl
 */
TentaGL.Texture = function(gl) {
    this._tex = TentaGL.createTexture(gl);
    this._width = 1;
    this._height = 1;
};


TentaGL.Texture.prototype = {
  
  constructor:TentaGL.Texture,
  
  isaTexture: true,
  
  /** 
   * Sets the contents of the texture to the data in a PixelData object.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.PixelData} pixelData
   */
  setPixelData:function(gl, pixelData) {
    var data = pixelData.getData();
    var width = pixelData.getWidth();
    var height = pixelData.getHeight();
    
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    this._width = width;
    this._height = height;
    
    TentaGL.MaterialLib.useNone(gl);
  },
  
  
  
  /** 
   * Deletes this texture from GL memory.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    gl.deleteTexture(this._tex);
  },
  
  /** 
   * Returns the location of this texture in GL memory.
   * @return {WebGLTexture}
   */
  getLocation:function() {
    return this._tex;
  },
  
  
  //////// Dimensions
  
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
  
  
  
  //////// Min-mag
  
  /** 
   * Returns the constant for the current magnification filter being used.
   * Default gl.NEAREST
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
   * Default gl.NEAREST
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
  
  
  
  //////// Wrapping
  
  /**
   * Gets the the wrapping method used for this texture on the S texture
   * coordinates axis.
   * Default gl.CLAMP_TO_EDGE
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
   * Default gl.CLAMP_TO_EDGE
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
  
  
  //////// Pixel data
  
  /** 
   * Produces a PixelData object containing the raw pixel data of some 
   * rectangular area of this texture. Here, X and Y are the coordinates of the 
   * lower-left corner of the texture area.
   * @param {WebGLRenderingContext} gl
   * @param {int} x   Optional. Default 0.
   * @param {int} y   Optional. Default 0.
   * @param {int} w   Optional. Defaults to the width of the texture - x.
   * @param {int} h   Optional. Defaults to the height of the texture - y.
   * @param {Uint8Array} bytes      Optional. A pre-allocated byte array to store 
   *      the pixel data in. The size of this array should be at least 4*w*h. 
   * @return {TentaGL.PixelData}
   */
  getPixelData:function(gl, x, y, w, h, bytes) {
    x = x || 0;
    y = y || 0;
    w = w || this._width - x;
    h = h || this._height - y;
    
    return TentaGL.PixelData.fromGLTexture(gl, this._tex, x, y, w, h, bytes);
  },
  
  
  
  //////// GL state
  
  /** 
   * Sets up the currently bound ShaderProgram so that its bound sampler2D 
   * texture0 uniform variable will use this texture.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.activeTexture(gl.TEXTURE0);
    TentaGL.ShaderLib.current(gl).setTex0UniValue(gl, 0);
  }
};

TentaGL.Inheritance.inherit(TentaGL.Texture, TentaGL.Material);



/** 
 * Returns a new Texture constructed from an image at a specified URL. 
 * @param {WebGLRenderingContext} gl
 * @param {string} url  The filepath to the image.
 * @param {function(data: PixelData) : PixelData} processCB    Optional. A 
 *      callback function for doing any post-processing on the image's pixel
 *      data BEFORE it is loaded into the texture. The resulting PixelData
 *      should be returned in the callback.
 * @param {function(tex: TentaGL.Texture) : undefined} texStateCB   Optional. 
 *      A callback function for setting up any gl properties for the texture 
 *      AFTER its pixel data has been loaded.
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.fromURL = function(gl, url, pixelsCB, texStateCB) {  
  var result = new TentaGL.Texture(gl);
  TentaGL.PixelData.fromURL(url, function(pixelData) {
    if(pixelsCB) {
      pixelData = pixelsCB(pixelData);
    }
    result.setPixelData(gl, pixelData);
    if(texStateCB) {
      texStateCB(result);
    }
  });
  return result;
};


/** 
 * Returns a new Texture constructed from a Canvas element. 
 * @param {WebGLRenderingContext} gl
 * @param {Canvas} canvas
 * @param {function(data: PixelData) : PixelData} processCB    Optional. A 
 *      callback function for doing any post-processing on the canvas's pixel
 *      data BEFORE it is loaded into the texture. The resulting PixelData
 *      should be returned in the callback.
 * @param {function(tex: TentaGL.Texture) : undefined} texStateCB   Optional. 
 *      A callback function for setting up any gl properties for the texture 
 *      AFTER its pixel data has been loaded.
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.fromCanvas = function(gl, canvas, pixelsCB, texStateCB) {
  var pixelData = TentaGL.PixelData.fromCanvas(canvas);
  return TentaGL.Texture.fromPixelData(gl, pixelData, pixelsCB, texStateCB);
};



/** 
 * Returns a new Texture constructed from a PixelData object.
 * @param {WebGLRenderingContext} gl
 * @param {TentaGL.PixelData} pixelData
 * @param {function(data: PixelData) : PixelData} processCB    Optional. 
 *      A callback function for doing any post-processing on the pixel
 *      data BEFORE it is loaded into the texture. The resulting PixelData
 *      should be returned in the callback.
 * @param {function(tex: TentaGL.Texture) : undefined} texStateCB   Optional. 
 *      A callback function for setting up any gl properties for the texture 
 *      AFTER its pixel data has been loaded.
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.fromPixelData = function(gl, pixelData, pixelsCB, texStateCB) {
  if(pixelsCB) {
    pixelData = pixelsCB(pixelData);
  }
  
  var result = new TentaGL.Texture(gl);
  result.setPixelData(gl, pixelData);
  
  if(texStateCB) {
    texStateCB(result);
  }
  return result;
};


