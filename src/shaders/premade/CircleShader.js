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
 * A pre-fabricated shader program that applies a model-view-projection 
 * transform to vertices in the scene and colors texels using a texture.
 * Lighting/Shading is not provided in this program.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.CircleShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "simple.vert";
  var fragURL = shaderRoot + "circle.frag";
  
  var self = this;
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating CircleShader");
    TentaGL.ShaderProgram.call(self, gl, vertSrc, fragSrc);
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.xyz);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.normal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.texST);
    
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

TentaGL.CircleShader.prototype = {
  
  constructor: TentaGL.CircleShader,
  
  isaCircleShader: true
};


/** 
 * Loads SimpleShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.CircleShader.load = function(gl, name) {
  var program = new TentaGL.CircleShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  gl._circleShaderProgramName = name;
  
  return program;
};


Util.Inheritance.inherit(TentaGL.CircleShader, TentaGL.SimpleShader);

