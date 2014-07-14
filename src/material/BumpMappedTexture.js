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
 * A material for a bump-mapped texture.
 * @constructor
 * @param {string} colorTexName    The name of the main texture, 
 *      used for pixel colors.
 * @param {string} bumpTexName     The name of the bump-map texture, 
 *      used for surface normal offsets.
 */
TentaGL.BumpMappedTexture = function(colorTexName, bumpTexName) {
  this._color = colorTexName;
  this._bump = bumpTexName;
};


TentaGL.BumpMappedTexture.prototype = {
  
  constructor: TentaGL.BumpMappedTexture,
  
  isaBumpMappedTexture: true,
  
  /** 
   * Returns the name of the texture used for pixel colors.
   * @return {string}
   */
  getColorTextureName: function() {
    return this._color;
  },
  
  
  /** 
   * Returns the texture used for pixel colors.
   * @param {WebGLRenderingContext} gl
   * @return {TentaGL.Texture}
   */
  getColorTexture: function(gl) {
    return TentaGL.MaterialLib.get(gl, this._color);
  },  
  
  
  /** 
   * Returns the name of the texture used for the bump-map.
   * @return {string}
   */
  getBumpTextureName: function() {
    return this._bump;
  },
  
  /** 
   * Returns the texture used for the bump-map.
   * @param {WebGLRenderingContext} gl
   * @return {TentaGL.Texture}
   */
  getBumpTexture: function(gl) {
    return TentaGL.MaterialLib.get(gl, this._bump);
  },
  
  /** 
   * Uses the bump-mapped shader in the shader currently being used. 
   * @param {WebGLRenderingContext} gl
   */
  useMe: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    
    this.getColorTexture(gl).useMe(gl);
    
    if(program.setBump) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.getBumpTexture(gl).getLocation());
      program.setBump(gl, 1);
    }
  }
  
};


Util.Inheritance.inherit(TentaGL.BumpMappedTexture, TentaGL.Material);

