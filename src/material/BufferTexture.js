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
 * Constructs a texture that can have scenes rendered onto it with a GL context.
 * For a shader to be able to use a BufferedTexture as a material, it must have
 * its uniform variable for storing texture0 bound, using its bindTex0Uni
 * method when the program is initialized.
 * @constructor
 * @param {WebGLRenderingContext} gl
 * @param {int} width   The desired width of the texture.
 * @param {int} height  The desired height of the texture.
 */
TentaGL.BufferTexture = function(gl, width, height, clearColor) {
  this._width = width;
  this._height = height;
  this._clearColor = clearColor || [0, 0, 0, 1];
  
  // Create the frame buffer.
  this._frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
  
  // Bind the texture to receive the colors.
  this._tex = TentaGL.createTexture(gl, null, width, height);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._tex, 0);
  
  // Bind a RenderBuffer to store depth data.
  this._depth = TentaGL.createDepthbuffer(gl, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depth);
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};



TentaGL.BufferTexture.prototype = {
  
  constructor:TentaGL.BufferTexture,
  
  
  /** Removes the Texture and the FrameBuffer from GL memory. */
  clean:function(gl) {
    gl.deleteFramebuffer(this._frameBuffer);
    gl.deleteTexture(this._tex);
    gl.deleteRenderbuffer(this._depth);
  },
  
  
  /** True. */
  isLoaded:function() {
    return true;
  },
  
  
  /** 
   * Renders a scene to this BufferTexture.
   * @param {WebGLRenderingContext} gl
   * @param {function} renderFunc   A function that accepts a single parameter 
   *      - a WebGLRenderingContext - which renders a scene.
   */
  renderToMe:function(gl, renderFunc) {
    var oldViewport = TentaGL.getViewport(gl);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    TentaGL.setViewport(gl, [0, 0, this._width, this._height]);
    
    gl.clearColor(this._clearColor[0], this._clearColor[1], this._clearColor[2], this._clearColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderFunc(gl);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    TentaGL.setViewport(gl, oldViewport);
  },
  
  
  /** 
   * Returns a PixelData object containing the current pixel data 
   * for this texture. 
   * @param {WebGLRenderingContext} gl
   * @param {int} x Optional. X position of lower-left corner of area containing 
   *      the pixel data. Defaults to 0, the extreme left of the texture.
   * @param {int} y Optional. Y position of lower-left corner of area containing
   *      the pixel data. Defaults to 0, the extreme bottom of the texture.
   * @param {int} w Optional. The width of the area containing the pixel data. 
   *      Defaults to the width of this texture.
   * @param {int} h Optional. The height of the area containing the pixel data.
   *      Defaults to the height of this texture.
   * @return {TentaGL.PixelData}
   */
  getPixelData:function(gl, x, y, w, h) {
    x = x || 0;
    y = y || 0;
    w = w || this._width - x;
    h = h || this._height - y;
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    
    var data = new Uint8Array(w*h*4);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
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
    TentaGL.ShaderLib.current(gl).setTex0UniValue(gl, 0);
  }
};

