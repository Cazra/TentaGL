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
    this._tex = TentaGL.Texture.create(gl);
    this._width = 1;
    this._height = 1;
    
    this._magFilter = GL_NEAREST;
    this._minFilter = GL_NEAREST;
    
    this._wrapS = GL_CLAMP_TO_EDGE;
    this._wrapT = GL_CLAMP_TO_EDGE;
    
};


TentaGL.Texture.prototype = {
  
  constructor:TentaGL.Texture,
  
  isaTexture: true,
  
  
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
   * Setter/getter for the texture's magnification filter.
   * @param {WebGLRenderingContext} gl
   * @param {GLenum} filter    Optional. GL_NEAREST or GL_LINEAR
   * @return {GLenum}
   */
  magFilter: function(gl, filter) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    if(filter !== undefined) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    }
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER);
  },
  

  /** 
   * Setter/getter for the texture's minification filter. 
   * @param {WebGLRenderingContext} gl
   * @param {GLenum} filter    Optional. Either gl.NEAREST, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR,
   *       gl.NEAREST_MIPMAP_NEAREST, gl.NEARTEST_MIPMAP_LINEAR, or gl.LINEAR_MIPMAP_NEAREST.
   * @return {GLenum}
   */
  minFilter: function(gl, filter) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    if(filter !== undefined) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    }
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER);
  },
  
  
  //////// Wrapping
  
  
  /** 
   * Setter/getter for the S-wrapping method for this texture. 
   * @param {WebGLRenderingContext} gl
   * @param {GLenum} method   Optional. Either gl.CLAMP_TO_EDGE, gl.REPEAR, or gl.MIRRORED_REPEAT.
   * @return {GLenum}
   */
  wrapS: function(gl, method) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    if(method !== undefined) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, method);
    }
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S);
  },
  
  
  
  /** 
   * Setter/getter for the T-wrapping method for this texture. 
   * @param {WebGLRenderingContext} gl
   * @param {GLenum} method   Optional. Either gl.CLAMP_TO_EDGE, gl.REPEAR, or gl.MIRRORED_REPEAT.
   * @return {GLenum}
   */
  wrapT: function(gl, method) {
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    if(method !== undefined) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, method);
    }
    return gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T);
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
  
  
  //////// GL state
  
  /** 
   * Sets up the currently bound ShaderProgram so that its bound sampler2D 
   * texture0 uniform variable will use this texture.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    if(program.setTex) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this._tex);
      TentaGL.ShaderLib.current(gl).setTex(gl, 0);
    }
  },
  
  
  //////// Renderable
  
  
  /** 
   * Renders the texture's image using the current scene transform
   * and the texture's pixel dimensions. (This may cause it to be huge in 3D 
   * rendering)
   * @param {WebGLRenderingContext} gl
   * @param {boolean} yFlipped    Optional. Default false. Whether the Y axis 
   *      is flipped (true for traditional 2D rendering).
   * @param {boolean height       Optional. If provided, the image will be 
   *      rendered using the specified height, and its width will be scaled
   *      proportionately.
   */
  render: function(gl, yFlipped, height) {
    TentaGL.ViewTrans.push(gl);
    
    this.useMe(gl);
    
    var w, h;
    if(height) {
      w = height/this.getHeight() * this.getWidth();
      h = height;
    }
    else {
      w = this.getWidth();
      h = this.getHeight();
    }
    TentaGL.ViewTrans.scale(gl, [w, h]);
    
    if(yFlipped) {
      TentaGL.ModelLib.render(gl, "unitSprite");
    }
    else {
      TentaGL.ModelLib.render(gl, "unitPlane");
    }
    
    TentaGL.ViewTrans.pop(gl);
  }
};

Util.Inheritance.inherit(TentaGL.Texture, TentaGL.Material);


/** 
 * Creates an initially empty texture in GL memory. By default, this texture 
 * Displays as solid red and has its min-mag filters set to gl.NEAREST.
 * @param {WebGLRenderingContext} gl
 * @param {Uint8Array} data   Optional. RGBA array of pixel data. This is
 *      allowed to be null, in which case the resulting appearance will be
 *      undefined (Displays white for me). Defaults to null.
 * @param {int} width   Optional. Width of the texture. Defaults to 1.
 * @param {int} height  Optional. Height of the texture. Defaults to 1.
 * @return {WebGLTexture}
 */
TentaGL.Texture.create = function(gl, data, width, height) {
  data = data || null;
  width = width || 1;
  height = height || 1;
  
  var tex = gl.createTexture();
  gl.bindTexture(GL_TEXTURE_2D, tex);
  gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
  
  // Use gl.NEAREST by default for min-mag filters.
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
  gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
  return tex;
};



/** 
 * Returns a new Texture constructed from an image at a specified URL. 
 * @param {WebGLRenderingContext} gl
 * @param {string} url  The filepath to the image.
 * @param {function(data: PixelData) : PixelData} pixelsCB    Optional. A 
 *      callback function for doing any processing on the image's pixel
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
 *      callback function for doing any processing on the canvas's pixel
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
 * @param {function(data: PixelData) : PixelData} pixelsCB    Optional. 
 *      A callback function for doing any processing on the pixel
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


/** 
 * Creates an 8x8 texture of a solid color.
 * @param {WebGLRenderingContext} gl
 * @param {TentaGL.Color} color
 * @param {function(data: PixelData) : PixelData} pixelsCB    Optional. 
 *      A callback function for doing any processing on the pixel
 *      data BEFORE it is loaded into the texture. The resulting PixelData
 *      should be returned in the callback.
 * @param {function(tex: TentaGL.Texture) : undefined} texStateCB   Optional. 
 *      A callback function for setting up any gl properties for the texture 
 *      AFTER its pixel data has been loaded.
 * @return {TentaGL.Texture}
 */
TentaGL.Texture.fromColor = function(gl, color, pixelsCB, texStateCB) {
  var canvas = TentaGL.Canvas2D.createRect(8, 8, false, 0, color);
  return TentaGL.Texture.fromCanvas(gl, canvas, pixelsCB, texStateCB);
};

