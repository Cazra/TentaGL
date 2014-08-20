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
 * @param {TentaGL.Color} clearColor    Optional. The clear color for the buffer.
 */
TentaGL.BufferTexture = function(gl, width, height, clearColor) {
  this._width = width;
  this._height = height;
  this._clearColor = clearColor || new TentaGL.Color([0, 0, 0, 0]);
  
  // Create the frame buffer.
  this._frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(GL_FRAMEBUFFER, this._frameBuffer);
  
  // Bind the texture to receive the colors.
  this._tex = TentaGL.Texture.create(gl, null, width, height);
  gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, this._tex, 0);
  
  // Bind a RenderBuffer to store depth data.
  this._depth = TentaGL.DepthBuffer.createBuffer(gl, width, height);
  gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, this._depth);
  
  gl.bindTexture(GL_TEXTURE_2D, null);
  gl.bindRenderbuffer(GL_RENDERBUFFER, null);
  gl.bindFramebuffer(GL_FRAMEBUFFER, null);
};



TentaGL.BufferTexture.prototype = {
  
  constructor:TentaGL.BufferTexture,
  
  isaBufferTexture: true,
  
  
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
    TentaGL.Viewport.push(gl);
    
    gl.bindFramebuffer(GL_FRAMEBUFFER, this._frameBuffer);
    TentaGL.Viewport.xywh(gl, [0, 0, this._width, this._height]);
    TentaGL.clear(gl, this._clearColor);
    renderFunc(gl);
    
    gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    
    TentaGL.Viewport.pop(gl);
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
   * Sets up the currently bound ShaderProgram so that its sampler2D uniform
   * variable "tex" will use this texture.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    gl.activeTexture(GL_TEXTURE0);
    gl.bindTexture(GL_TEXTURE_2D, this._tex);
    TentaGL.ShaderLib.current(gl).setTex(gl, 0);
  }
};


Util.Inheritance.inherit(TentaGL.BufferTexture, TentaGL.Material);


