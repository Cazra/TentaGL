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
 * Constructs a 3D picker for mapping viewport coordinates to objects in a scene. 
 * @constructor
 * @param {int} width   The width of the viewport the picking is done in.
 * @param {int} height  The heigh of the viewport the picking is done in.
 */
TentaGL.Picker = function(width, height) {
  this._width = width;
  this._height = height;
};


TentaGL.Picker.prototype = {
  
  constructor:TentaGL.Picker,
  
  /** 
   * Updates the internal raster of mouse-over information of a scene for this picker.
   * @param {WebGLRenderingContext} gl
   * @param {function(WebGLRenderingContext)} renderFunc   
   *      The function used to render the scene.
   */
  update:function(gl, renderFunc) {
    var self = this;
    this._origFilter = TentaGL.getRenderFilter();
    var origShader = TentaGL.ShaderLib.current(gl).getID();
    var origBlendState = TentaGL.BlendStateLib.current().getID();
    
    // TODO: Set blending state to no blend.
    TentaGL.BlendStateLib.use(gl, TentaGL.BlendStateLib.NO_BLEND);
    TentaGL.Picker.useShader(gl);
    TentaGL.ShaderLib.lock();
    this._nextID = 1;
    this._sprites = [];
    
    this._gl = gl;
    TentaGL.setRenderFilter(this._filterFunction.bind(this));
    
    renderFunc(gl);
    this._nextID = 1;
    
    // Render to the offscreen raster, cache the pixel data, 
    // and then delete the offscreen raster.
    var raster = new TentaGL.BufferTexture(gl, this._width, this._height);
    raster.renderToMe(gl, renderFunc);
    this._pixels = raster.getPixelData(gl);
    raster.clean(gl);
    
    TentaGL.ShaderLib.unlock();
    TentaGL.BlendStateLib.use(gl, origBlendState);
    TentaGL.ShaderLib.use(gl, origShader);
    TentaGL.setRenderFilter(this._origFilter);
  },
  
  
  
  /** 
   * The sprite filtering function used by the Picker. 
   * @param {TentaGL.Sprite} sprite
   * @return {Boolean}
   */
  _filterFunction: function(sprite) {
    if(this._origFilter(sprite)) {
      var id = (0xFF000000 | this._nextID);
      this._nextID++;
      
      var pickColor = new TentaGL.Color.Hex(id);
      this._sprites[id] = sprite;
      var rgba = pickColor.getRGBA();
      TentaGL.ShaderLib.current(this._gl).setPickIDUniValue(this._gl, rgba);
      
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
  getPixelAt:function(x, y, flipY) {
    return this._pixels.getPixelAt(x, y, flipY);
  },
  
  
  /** 
   * Returns the sprite whose picking ID is stored at the specified location in
   * the picker raster.
   * @param {int} x
   * @param {int} y
   * @param {int} flipY   Optional. If true, y increases downward. 
   *      Default to false.
   * @return {TentaGL.Sprite}
   */
  getSpriteAt:function(x, y, flipY) {
    var pixel = this.getPixelAt(x, y, flipY);
    var id = TentaGL.Color.rgba2Hex(pixel[0], pixel[1], pixel[2], pixel[3]);
    return this._sprites[id];
  },
};

/** The ID of the picker's shader program in the ShaderLib. */
TentaGL._shaderID = "pickShader";

/** Source code for the picker's vertex shader. */
TentaGL.Picker._vShader = 
  "attribute vec4 vertexPos;\n" +
  "\n" +
  "uniform mat4 mvpTrans;\n" +
  "\n" +
  "// pass-through shader.\n" +
  "void main(void) {\n" + 
  "  gl_Position = mvpTrans * vertexPos;\n" +
  "}\n";

/** Source code for the picker's fragment shader. */
TentaGL.Picker._fShader = 
  "precision mediump float;\n" +
  "\n" +
  "uniform vec4 pickID;\n" +
  "\n" +
  "// All fragments are colored white.\n" +
  "void main(void) {\n" +
  "  gl_FragColor = pickID;\n" +
  "}\n";

  
/** 
 * Loads the picker's shader program into the ShaderLib with ID "pickShader". 
 * @param {WebGLRenderingContext} gl
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.Picker.loadShaderProgram = function(gl) {
  var shaderProgram = TentaGL.ShaderLib.add(gl, TentaGL._shaderID, TentaGL.Picker._vShader, TentaGL.Picker._fShader);
  
  shaderProgram.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  
  shaderProgram.bindMVPTransUni("mvpTrans");
  shaderProgram.bindPickIDUni("pickID");
  
  return shaderProgram;
};


/** 
 * Sets the GL context to use the picker's shader program. 
 * @param {WebGLRenderingContext} gl
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.Picker.useShader = function(gl) {
  return TentaGL.ShaderLib.use(gl, TentaGL._shaderID);
};


