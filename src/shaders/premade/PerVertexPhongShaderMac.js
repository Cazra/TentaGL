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
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
    self.setAttrGetter("vertexTang", TentaGL.Vertex.prototype.getTangental);
    
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
    self._lightUni = {}; 
    self._lightUni.type = self.getUniform("light.type");
    self._lightUni.pos = self.getUniform("light.pos");
    self._lightUni.dir = self.getUniform("light.dir");
    self._lightUni.diff = self.getUniform("light.diff");
    self._lightUni.spec = self.getUniform("light.spec");
    self._lightUni.amb = self.getUniform("light.amb");
    self._lightUni.attenA = self.getUniform("light.attenA");
    self._lightUni.attenB = self.getUniform("light.attenB");
    self._lightUni.attenC = self.getUniform("light.attenC");
    self._lightUni.cutOffAngleCos = self.getUniform("light.cutOffAngleCos");
    self._lightUni.spotExp = self.getUniform("light.spotExp");
  });
  
  /*
  var src = TentaGL.ShaderProgram.srcFromURL(gl, vertURL, fragURL);
  
  console.log("\nCreating PerVertexPhongShaderMac");
  TentaGL.ShaderProgram.call(this, gl, src[0], src[1]);
  
  this.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  this.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  this.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  this.setAttrGetter("vertexTang", TentaGL.Vertex.prototype.getTangental);
  
  this._mvpUni = this.getUniform("mvpTrans");
  this._mvUni = this.getUniform("mvTrans");
  this._vUni = this.getUniform("vTrans");
  this._normalUni = this.getUniform("normalTrans");
  
  this._colorUni = this.getUniform("solidColor");
  this._texUni = this.getUniform("tex");
  this._useTexUni = this.getUniform("useTex");
  
  // Material struct
  this._materialUni = {};
  this._materialUni.diff = this.getUniform("m.diff");
  this._materialUni.spec = this.getUniform("m.spec");
  this._materialUni.amb = this.getUniform("m.amb");
  this._materialUni.emis = this.getUniform("m.emis");
  this._materialUni.shininess = this.getUniform("m.shininess");
  
  // Light struct
  this._lightUni = {}; 
  this._lightUni.type = this.getUniform("light.type");
  this._lightUni.pos = this.getUniform("light.pos");
  this._lightUni.dir = this.getUniform("light.dir");
  this._lightUni.diff = this.getUniform("light.diff");
  this._lightUni.spec = this.getUniform("light.spec");
  this._lightUni.amb = this.getUniform("light.amb");
  this._lightUni.attenA = this.getUniform("light.attenA");
  this._lightUni.attenB = this.getUniform("light.attenB");
  this._lightUni.attenC = this.getUniform("light.attenC");
  this._lightUni.cutOffAngleCos = this.getUniform("light.cutOffAngleCos");
  this._lightUni.spotExp = this.getUniform("light.spotExp");
  */
};

TentaGL.PerVertexPhongShaderMac.LIGHT_AMB = 1;
TentaGL.PerVertexPhongShaderMac.LIGHT_PT = 2;
TentaGL.PerVertexPhongShaderMac.LIGHT_DIR = 3;
TentaGL.PerVertexPhongShaderMac.LIGHT_SPOT = 4;

TentaGL.PerVertexPhongShaderMac.prototype = {
  
  constructor: TentaGL.PerVertexPhongShader,
  
  isaPerVertexPhongShaderMac: true,
  
  
  /** 
   * Sets the value of the uniform variable for the model-view-projection 
   * transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} m
   */
  setMVPTrans: function(gl, m) {
    this._mvpUni.set(gl, m);
  },
  
  
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
  
  
  /** 
   * Sets the value of the uniform variable for the normal model-view transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat3} value
   */
  setNormalTrans: function(gl, value) {
    this._normalUni.set(gl, value);
  },
  
  
  /** 
   * Sets the uniform variables for using a solid color instead of using a 
   * texture for color. Solid colors are compatible with bump maps! Just call 
   * setBump after setColor, since setColor unsets the useBumpTex uniform.
   * @param {WebGLRenderingContext} gl
   * @param {vec4} rgba
   */
  setColor: function(gl, rgba) {
    this._colorUni.set(gl, rgba);
    this._useTexUni.set(gl, [0]);
  },
  
  
  /** 
   * Sets the value of the uniform variable for the primary texture offset 
   * and unsets the bump texture offset. If you want to use bump mapping, 
   * call setTex first, followed by setBump.
   * @param {WebGLRenderingContext} gl
   * @param {int} value
   */
  setTex: function(gl, value) {
    this._texUni.set(gl, [value]);
    this._useTexUni.set(gl, [1]);
  },
  
  /** 
   * Sets the material light properties struct.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Material.LightProps} matProps
   */
  setMaterialProps: function(gl, matProps) {
    this._materialUni.diff.set(gl, matProps.getDiffuse().getRGBA());
    this._materialUni.spec.set(gl, matProps.getSpecular().getRGBA());
    this._materialUni.amb.set(gl, matProps.getAmbient().getRGBA());
    this._materialUni.emis.set(gl, matProps.getEmission().getRGBA());
    this._materialUni.shininess.set(gl, [matProps.getShininess()]);
  },
  
  
  /** 
   * Sets the lights uniform variable array. 
   */
  setLights: function(gl, lights) {
    var light = lights[0];
    
    // type (int)
    if(light.isaAmbientLight) {
      this._lightUni.type.set(gl, [TentaGL.PerVertexPhongShader.LIGHT_AMB]);
    }
    if(light.isaPointLight) {
      this._lightUni.type.set(gl, [TentaGL.PerVertexPhongShader.LIGHT_PT]);
    }
    if(light.isaDirectionalLight) {
      this._lightUni.type.set(gl, [TentaGL.PerVertexPhongShader.LIGHT_DIR]);
    }
    if(light.isaSpotLight) {
      this._lightUni.type.set(gl, [TentaGL.PerVertexPhongShader.LIGHT_SPOT]);
    }
    
    // pos (vec4)
    if(light.isaPointLight) {
      this._lightUni.pos.set(gl, light.getXYZ());
    }
    else {
      this._lightUni.pos.set(gl, [0, 0, 0, 0]);
    }
    
    // dir (vec3)
    if(light.isaDirectionalLight) {
      this._lightUni.dir.set(gl, light.getDirection());
    }
    else {
      this._lightUni.dir.set(gl, [0,0,0]);
    }
    
    // diff, spec, amb (vec4 x3) 
    this._lightUni.diff.set(gl, light.getDiffuse().getRGBA());
    this._lightUni.spec.set(gl, light.getSpecular().getRGBA());
    this._lightUni.amb.set(gl, light.getAmbient().getRGBA());
    
    // attenA, attenB, atten C (float x3)
    if(light.isaPointLight) {
      var atten = light.getAttenuation();
      this._lightUni.attenA.set(gl, [atten[0]]);
      this._lightUni.attenB.set(gl, [atten[1]]);
      this._lightUni.attenC.set(gl, [atten[2]]);
    }
    else {
      this._lightUni.attenA.set(gl, [0]);
      this._lightUni.attenB.set(gl, [0]);
      this._lightUni.attenC.set(gl, [0]);
    }
    
    // cutOffAngleCos, spotExp (float x2)
    if(light.isaSpotLight) {
      this._lightUni.cutOffAngleCos.set(gl, [Math.cos(light.getCutOffAngle())]);
      this._lightUni.spotExp.set(gl, [light.getSpotExponent()]);
    }
    else {
      this._lightUni.cutOffAngleCos.set(gl, [0]);
      this._lightUni.spotExp.set(gl, [0]);
    }
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


Util.Inheritance.inherit(TentaGL.PerVertexPhongShaderMac, TentaGL.ShaderProgram);

