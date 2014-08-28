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
 * Outlines part of a scene with some material using the OutlineShader.
 * The technique used here is that the outlined objects are rendered a 
 * second time, only rendering their back faces with some outline color or 
 * texture. The vertices are extruded in the direction of their normals to give
 * the outline its width.
 * @constructor
 * @param {TentaGL.Material || string} material   A material or a material's name.
 * @param {float} width   The preferred width of the outline.
 */
TentaGL.Outliner = function(material, width) {
  this._material = material;
  this._width = width;
};


/** 
 * Returns whether we are currently outlining something. This lets TentaGL know
 * not to change shaders or materials in the middle of outlining.
 */
TentaGL.Outliner.isOutlining = function(gl) {
  return gl._isOutlining;
};


TentaGL.Outliner.prototype = {
  
  constructor: TentaGL.Outliner,
  
  isaOutliner: true,
  
  
  /** 
   * Renders the outline for a scene.
   * @param {WebGLRenderingContext} gl
   * @param {function(gl: WebGLRenderingContext) : undefined} renderFunc
   * @param {GLenum} cullMode   Optional. Default GL_FRONT.
   */
  renderOutline: function(gl, renderFunc, cullMode) {
    if(!this._material.isaMaterial) {
      this._material = TentaGL.MaterialLib.get(gl, this._material);
    }
    if(cullMode === undefined) {
      cullMode = GL_FRONT;
    }
    
    TentaGL.ShaderLib.push(gl);
    TentaGL.Cull.push(gl);
    TentaGL.Cull.setMode(gl, cullMode);
    
    var shaderName = TentaGL.OutlineShader.getName(gl);
    TentaGL.ShaderLib.use(gl, shaderName);
    
    var program = TentaGL.ShaderLib.current(gl);
    if(program.setExtrudeAmt) {
      program.setExtrudeAmt(gl, this._width);
    }
    
    gl._isOutlining = true;
    
    this._material.useMe(gl);
    renderFunc(gl);
    
    gl._isOutlining = false;
    
    TentaGL.Cull.pop(gl);
    TentaGL.ShaderLib.pop(gl);
  }
  
};


