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
 * Constructs a 3D picker for doing pixel-perfect mouse-over detections in
 * a scene.
 * @constructor
 * @param {TentaGL.Application} app   The application this picker is being used in.
 */
TentaGL.Picker = function(app) {
  this._app = app;
  this._bytes = new Uint8Array(4);
};

/** The ID of the picker's shader program in the ShaderLib. */
TentaGL.Picker.SHADER_ID = "pickShader";


/** 
 * Returns whether the gl context is currently being used for picking. 
 * Some gl state cannot be altered while picking. Most importantly, 
 * We cannot switch shaders while picking. 
 * @return {boolean}
 */
TentaGL.Picker.isPicking = function(gl) {
  return gl._isPicking;
};



TentaGL.Picker.prototype = {
  
  constructor:TentaGL.Picker,
  
  
  
  /** 
   * Updates the internal raster of mouse-over information of a scene for this picker.
   * @param {WebGLRenderingContext} gl
   * @param {function(WebGLRenderingContext)} renderFunc   
   *      The function used to render the scene.
   * @param {Boolean} renderToView  Optional. If true, the picker will render 
   *      to to the canvas as well as its offscreen buffer. This may be useful
   *      for debugging purposes. Default is false.
   */
  update:function(gl, renderFunc, renderToView) {
    var self = this;
    
    this._pixels = undefined;
    this._origFilter = TentaGL.SceneNode.getRenderFilter();
    TentaGL.ShaderLib.push(gl);
    
    // Set up the GL state for picker rendering. 
    TentaGL.Blend.setEnabled(gl, false);
    TentaGL.ColorBuffer.setClearColor(gl, new TentaGL.Color([0, 0, 0, 0]));
    TentaGL.MaterialLib.useNone(gl);
    TentaGL.ShaderLib.use(gl, TentaGL.Picker.SHADER_ID);
    
    gl._isPicking = true;
    
    this._nextID = 1;
    this._sprites = [];
    
    this._gl = gl;
    TentaGL.SceneNode.setRenderFilter(this._filterFunction.bind(this));
    
    if(renderToView) {
      renderFunc(gl);
      TentaGL.MaterialLib.useNone(gl);
      this._nextID = 1;
    }
    
    // Update the size of the buffer used for picking, if necessary.
    var w = this._app.getWidth();
    var h = this._app.getHeight();
    var minSize = w*h*4;
    if(minSize > this._bytes.length) {
      this._bytes = new Uint8Array(minSize);
    }
    
    // Render to the offscreen raster, cache the pixel data, 
    // and then delete the offscreen raster.
    var raster = new TentaGL.BufferTexture(gl, w, h);
    raster.renderToMe(gl, renderFunc);
    this._pixels = raster.getPixelData(gl, 0, 0, w, h, this._bytes);
    raster.clean(gl);
    
    
    // Restore the previous state.
    gl._isPicking = false;
    
    TentaGL.ShaderLib.pop(gl);
    TentaGL.SceneNode.setRenderFilter(this._origFilter);
  },
  
  
  
  /** 
   * The sprite filtering function used by the Picker. 
   * @param {TentaGL.Sprite} sprite
   * @return {Boolean}
   */
  _filterFunction: function(sprite) {
    if(this._origFilter(sprite)) {
      var id = this._nextID; //(0xFF000000 | this._nextID);
      this._nextID++;
      
      var pickColor = new TentaGL.Color.Hex(id);
      this._sprites[id] = sprite;
      var rgba = pickColor.rgba();
      TentaGL.ShaderLib.current(this._gl).setPickID(this._gl, rgba);
      
      return true;
    }
    else {
      return false;
    }
  },
  
  
  
  
  /** 
   * Extracts the RGBA values of the pixel at the specified coordinates in the 
   * picker raster. 
   * @param {int} x
   * @param {int} y
   * @param {int} flipY   Optional. If true, y increases downward. 
   *      Default to false.
   * @return {length-4 array}   An array containing the RGBA byte values for 
   *      the pixel.
   */
  _getPixelAt:function(x, y, flipY) {
    return this._pixels.getPixelAt(x, y, flipY);
  },
  
  
  /** 
   * Returns the sprite whose picking ID is stored at the specified location in
   * the picker raster.
   * @param {int} x
   * @param {int} y
   * @return {TentaGL.Sprite}
   */
  getSpriteAt:function(x, y) {
    if(this._pixels) {
      var pixel = this._getPixelAt(x, y);
      var id = TentaGL.Color.rgba2hex(pixel);
      return this._sprites[id];
    }
    else {
      return undefined;
    }
  },
  
  
  /** 
   * Returns the sprite whose picking ID is stored at the mouse's location.
   * @param {TentaGL.Mouse} mouse
   * @return {TentaGL.Sprite}
   */
  getSpriteAtMouse: function(mouse) {
    var mx = mouse.getX();
    var my = this._app.getHeight() - mouse.getY();
    return this.getSpriteAt(mx, my);
  }
  
};


