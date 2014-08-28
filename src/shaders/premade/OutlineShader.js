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
 * A shader that extrudes back-facing vertices to render an outline.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.OutlineShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "extrude.vert";
  var fragURL = shaderRoot + "simple.frag";
  
  var self = this;
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating OutlineShader");
    TentaGL.ShaderProgram.call(self, gl, vertSrc, fragSrc);
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.xyz);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.normal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.texST);
    
    self._extrudeAmt = self.getUniform("extrudeAmt");
    
    self._opacityUni = self.getUniform("opacity");
    
    self._fogEqUni = self.getUniform("fogEquation");
    self._fogColorUni = self.getUniform("fogColor");
    self._fogDensityUni = self.getUniform("fogDensity");
    
    self._mvpUni = self.getUniform("mvpTrans");
    self._normalUni = self.getUniform("normalTrans");
    
    self._colorUni = self.getUniform("solidColor");
    self._texUni = self.getUniform("tex");
    self._useTexUni = self.getUniform("useTex");
  });
};

TentaGL.OutlineShader.prototype = {
  
  constructor: TentaGL.OutlineShader,
  
  isaOutlineShader: true,
  
  
  /** 
   * Sets the amount to extrude vertices to produce the outline. 
   * This is effectively the outline width.
   * @param {WebGLRenderingContext} gl
   * @param {float} amt
   */
  setExtrudeAmt: function(gl, amt) {
    this._extrudeAmt.set(gl, [amt]);
  }
};


/** 
 * If the OutlineShader has been loaded, its name is returned.
 * @return {string}
 */
TentaGL.OutlineShader.getName = function(gl) {
  return gl._outlineShaderName;
};


/** 
 * Loads OutlineShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.OutlineShader.load = function(gl, name) {
  var program = new TentaGL.OutlineShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  gl._outlineShaderName = name;
  
  return program;
};


Util.Inheritance.inherit(TentaGL.OutlineShader, TentaGL.SimpleShader);

