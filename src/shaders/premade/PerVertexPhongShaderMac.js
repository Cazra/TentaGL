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
 * It turns out that some Mac systems have problems with the array of structs
 * used in the other shader. See http://www.khronos.org/registry/webgl/sdk/tests/conformance/glsl/bugs/array-of-struct-with-int-first-position.html.
 * In this shader, there is only one defined light struct uniform in the shader.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.PerVertexPhongShaderMac = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "phongPerVertexMac.vert";
  var fragURL = shaderRoot + "phongPerVertexMac.frag";
  
  var self = this;
  
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating PerVertexPhongShaderMac");
    TentaGL.ShaderProgram.call(self, gl, vertSrc, fragSrc);
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.xyz);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.normal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.texST);
    self.setAttrGetter("vertexTang", TentaGL.Vertex.prototype.tangental);
    
    self._opacityUni = self.getUniform("opacity");
    
    self._fogEqUni = self.getUniform("fogEquation");
    self._fogColorUni = self.getUniform("fogColor");
    self._fogDensityUni = self.getUniform("fogDensity");
    
    self._mvpUni = self.getUniform("mvpTrans");
    self._mvUni = self.getUniform("mvTrans");
    self._vUni = self.getUniform("vTrans");
    self._normalUni = self.getUniform("normalTrans");
    
    self._colorUni = self.getUniform("solidColor");
    self._texUni = self.getUniform("tex");
    self._useTexUni = self.getUniform("useTex");
    
    // Material struct
    self._materialUni = {};
    self._materialUni.diff = self.getUniform("m.diff");
    self._materialUni.spec = self.getUniform("m.spec");
    self._materialUni.amb = self.getUniform("m.amb");
    self._materialUni.emis = self.getUniform("m.emis");
    self._materialUni.shininess = self.getUniform("m.shininess");
    
    // Light struct
    self._lightsUni = []; 
    var light = self._lightsUni[0] = {};
    
    light.type = self.getUniform("light.type");
    light.pos = self.getUniform("light.pos");
    light.dir = self.getUniform("light.dir");
    light.diff = self.getUniform("light.diff");
    light.spec = self.getUniform("light.spec");
    light.amb = self.getUniform("light.amb");
    light.attenA = self.getUniform("light.attenA");
    light.attenB = self.getUniform("light.attenB");
    light.attenC = self.getUniform("light.attenC");
    light.cutOffAngleCos = self.getUniform("light.cutOffAngleCos");
    light.spotExp = self.getUniform("light.spotExp");
  });
};

TentaGL.PerVertexPhongShaderMac.MAX_LIGHTS = 1;

TentaGL.PerVertexPhongShaderMac.prototype = {
  
  constructor: TentaGL.PerVertexPhongShader,
  
  isaPerVertexPhongShaderMac: true,
  
  //////// LightsShader implementations
  
  getMaxLights: function() {
    return TentaGL.PerVertexPhongShaderMac.MAX_LIGHTS;
  }
};


/** 
 * Loads PerVertexPhongShaderMac into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.PerVertexPhongShaderMac.load = function(gl, name) {
  var program = new TentaGL.PerVertexPhongShaderMac(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.PerVertexPhongShaderMac, TentaGL.PerVertexPhongShader);

