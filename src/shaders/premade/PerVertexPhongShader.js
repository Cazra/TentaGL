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
 * A Phong shader that computes lighting per vertex. This is faster than per 
 * fragment Phong but lower quality. Per vertex Phong doesn't support bump 
 * mapping either.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.PerVertexPhongShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "phongPerVertex.vert";
  var fragURL = shaderRoot + "phongPerVertex.frag";
  
  var self = this;
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating PerVertexPhongShader");
    TentaGL.ShaderProgram.call(self, gl, vertSrc, fragSrc);
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
    self.setAttrGetter("vertexTang", TentaGL.Vertex.prototype.getTangental);
    
    self._opacityUni = self.getUniform("opacity");
    
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
    
    // Lights struct array
    self._lightsUni = []; 
    for(var i=0; i < TentaGL.PerVertexPhongShader.MAX_LIGHTS; i++) {
      var light = self._lightsUni[i] = {};
      var prefix = "lights[" + i + "]";
      
      light.type = self.getUniform(prefix + ".type");
      light.pos = self.getUniform(prefix + ".pos");
      light.dir = self.getUniform(prefix + ".dir");
      light.diff = self.getUniform(prefix + ".diff");
      light.spec = self.getUniform(prefix + ".spec");
      light.amb = self.getUniform(prefix + ".amb");
      light.attenA = self.getUniform(prefix + ".attenA");
      light.attenB = self.getUniform(prefix + ".attenB");
      light.attenC = self.getUniform(prefix + ".attenC");
      light.cutOffAngleCos = self.getUniform(prefix + ".cutOffAngleCos");
      light.spotExp = self.getUniform(prefix + ".spotExp");
    }
    
    self._numLightsUni = self.getUniform("numLights");
  });
};

TentaGL.PerVertexPhongShader.MAX_LIGHTS = 16;

TentaGL.PerVertexPhongShader.prototype = {
  
  constructor: TentaGL.PerVertexPhongShader,
  
  isaPerVertexPhongShader: true,
  
  
  /** 
   * Sets the uniform for the model-view transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} m
   */
  setMVTrans: function(gl, m) {
    this._mvUni.set(gl, m);
  },
  
  
  /** 
   * Sets the uniform for the view transform matrix. This is used to 
   * get the light vectors in view-space in the shader.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} m
   */
  setVTrans: function(gl, m) {
    this._vUni.set(gl, m);
  },
  
  
  //////// LightsShader implementations
  
  getMaxLights: function() {
    return TentaGL.PerVertexPhongShader.MAX_LIGHTS;
  }
};


/** 
 * Loads PerVertexPhongShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.PerVertexPhongShader.load = function(gl, name) {
  var program = new TentaGL.PerVertexPhongShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.PerVertexPhongShader, TentaGL.LightsShader);

