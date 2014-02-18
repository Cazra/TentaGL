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
 */
TentaGL.BufferTexture = function(gl, width, height, pixelFormat) {
  pixelFormat = pixelFormat || gl.RGBA;
  
  this._width = width;
  this._height = height;
  this._pixelFormat = pixelFormat;
  this._clearColor = [0, 0, 0, 1];
  
  // Create the frame buffer.
  this._frameBuffer = gl.createFrameBuffer();
  gl.bindFrameBuffer(gl.FRAMEBUFFER, this._frameBuffer);
  
  // Bind the texture to receive the colors.
  this._tex = TentaGL.BufferTexture.createGLTexture(gl, width, height, pixelFormat);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._tex, 0);
  
  // Bind a RenderBuffer to store depth data.
  this._depth = TentaGL.BufferTexture.createGLDepthBuffer(gl, width, height);
  gl.framebufferRenderBuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depth);
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};



TentaGL.BufferTexture.prototype = {
  
  constructor:TentaGL.BufferTexture,
  
  
  /** Removes the Texture and the FrameBuffer from GL memory. */
  clean:function(gl) {
    gl.deleteFrameBuffer(this._frameBuffer);
    gl.deleteTexture(this._tex);
  },
  
  
  /** True. */
  isLoaded:function() {
    return true;
  },
  
  
  /** 
   * Renders a scene to this BufferTexture.
   * @param {WebGLRenderingContext} gl
   * @param {any} renderable   Any object with a render(WebGLContext) method. 
   *      This object's render method will be called to draw the scene on this
   *      BufferTexture.
   */
  renderToMe:function(gl, renderable) {
    var oldViewport = TentaGL.getViewport(gl);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    
    TentaGL.setViewport(gl, [0, 0, this._width, this._height]);
    gl.clearColor(this._clearColor[0], this._clearColor[1], this._clearColor[2], this._clearColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderable.render(gl);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    TentaGL.setViewport(gl, oldViewport);
  },
  
  
  useMe:function(gl) {
    // TODO
    
  }
};



/** 
 * Allocates a blank texture in the GL state with the specified dimensions 
 * and returns it. 
 * @param {WebGLRenderingContext} gl
 * @param {int} width
 * @param {int} height
 * @return {WebGLTexture}
 */
TentaGL.BufferTexture.createGLTexture = function(gl, width, height, pixelFormat) {
  var tex = gl.createTexture();
  
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, pixelFormat, width, height, 0, pixelFormat, gl.UNSIGNED_BYTE, null);
  
  // Use gl.NEAREST by default for min-mag filters.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return tex;
};


/** 
 * Allocates and returns a depth buffer with the specified dimensions. 
 * @param {WebGLRenderingContext} gl
 * @param {int} width
 * @param {int} height
 * @return {WebGLRenderbuffer}
 */
TentaGL.BufferTexture.createGLDepthBuffer = function(gl, width, height) {
  var buffer = gl.createRenderBuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  return buffer;
};

