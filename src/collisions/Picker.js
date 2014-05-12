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
    var origShader = TentaGL.ShaderLib.currentName(gl);
    
    // Set up the GL state for picker rendering. 
    TentaGL.Blend.setEnabled(gl, false);
    TentaGL.Blend.lock(gl);
    
    TentaGL.ColorBuffer.setClearColor(gl, TentaGL.Color.RGBA(0, 0, 0, 0));
    TentaGL.ColorBuffer.lock(gl);
    
    TentaGL.MaterialLib.useNone(gl);
    
    TentaGL.Picker.useShader(gl);
    TentaGL.ShaderLib.lock(gl);
    
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
    TentaGL.ShaderLib.unlock(gl);
    TentaGL.Blend.unlock(gl);
    TentaGL.ColorBuffer.unlock(gl);
    TentaGL.ShaderLib.use(gl, origShader);
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
  _getPixelAt:function(x, y, flipY) {
    return this._pixels.getPixelAt(x, y, flipY);
  },
  
  
  /** 
   * Returns the sprite whose picking ID is stored at the specified location in
   * the picker raster.
   * @param {int} x
   * @param {int} y
   * @param {boolean} ignoreComposite   Optional. Whether to ignore composited sprites.
   *      Default to true, meaning that for composited sprites, this will return the top level
   *      sprite the composite hierarchy for the sprite that was clicked.
   * @return {TentaGL.Sprite}
   */
  getSpriteAt:function(x, y, ignoreComposite) {
    if(this._pixels) {
      var pixel = this._getPixelAt(x, y);
      var id = TentaGL.Color.rgba2Hex(pixel[0], pixel[1], pixel[2], pixel[3]);
      var sprite = this._sprites[id];
      if(ignoreComposite || !sprite) {
        return sprite;
      }
      else {
        var path = sprite.getCompositePath();
        return path[path.length-1];
      }
    }
    else {
      return undefined;
    }
  },
  
};


/** The ID of the picker's shader program in the ShaderLib. */
TentaGL.Picker._shaderID = "pickShader";

/** Source code for the picker's vertex shader. */
TentaGL.Picker._vShader = 
  "attribute vec4 vertexPos;\n" +
  "attribute vec2 vertexTexCoords;\n" + 
  "\n" +
  "uniform mat4 mvpTrans;\n" +
  "\n" +
  "varying vec2 texCoords;\n" +
  "\n" +
  "// pass-through shader.\n" +
  "void main(void) {\n" + 
  "  gl_Position = mvpTrans * vertexPos;\n" +
  "  texCoords = vertexTexCoords;\n" +
  "}\n";

/** Source code for the picker's fragment shader. */
TentaGL.Picker._fShader = 
  "precision mediump float;\n" +
  "\n" +
  "uniform vec4 pickID;\n" +
  "uniform sampler2D tex;\n" +
  "\n" +
  "varying vec2 texCoords;\n" +
  "\n" +
  "// All fragments are colored white.\n" +
  "void main(void) {\n" +
  "  if(texture2D(tex, texCoords).a == 0.0) {\n"+
  "    gl_FragColor = vec4(0, 0, 0, 1);\n" +
  "    discard;\n" +
  "  }\n" +
  "  else {\n" +
  "    gl_FragColor = pickID;\n" +
  "  }\n" +
  "}\n";

  
/** 
 * Loads the picker's shader program into the ShaderLib with ID "pickShader". 
 * @param {WebGLRenderingContext} gl
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.Picker.loadShaderProgram = function(gl) {
  var program = new TentaGL.ShaderProgram(gl, TentaGL.Picker._vShader, TentaGL.Picker._fShader);
  TentaGL.ShaderLib.add(gl, TentaGL.Picker._shaderID, program);
  
  program.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  program.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  
  program.bindMVPTransUni("mvpTrans");
  program.bindPickIDUni("pickID");
  
  return program;
};


/** 
 * Sets the GL context to use the picker's shader program. 
 * @param {WebGLRenderingContext} gl
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.Picker.useShader = function(gl) {
  return TentaGL.ShaderLib.use(gl, TentaGL.Picker._shaderID);
};


