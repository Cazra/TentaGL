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
 * A phong lighting shader that also supports bump mapping.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.PhongShaderMac = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "phongMac.vert";
  var fragURL = shaderRoot + "phongMac.frag";
  var src = TentaGL.ShaderProgram.srcFromURL(gl, vertURL, fragURL);
  
  console.log("\nCreating PhongShaderMac");
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
  this._bumpTexUni = this.getUniform("bumpTex");
  this._useBumpUni = this.getUniform("useBumpTex");
  
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
};

TentaGL.PhongShaderMac.LIGHT_AMB = 1;
TentaGL.PhongShaderMac.LIGHT_PT = 2;
TentaGL.PhongShaderMac.LIGHT_DIR = 3;
TentaGL.PhongShaderMac.LIGHT_SPOT = 4;

TentaGL.PhongShaderMac.prototype = {
  
  constructor: TentaGL.PhongShaderMac,
  
  isaPhongShaderMac: true,
  
  
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
    this._useBumpUni.set(gl, [0]);
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
    this._useBumpUni.set(gl, [0]);
  },
  
  
  /** 
   * Sets the uniform variable for the bump texture offset. 
   * @param {WebGLRenderingContext} gl
   * @param {int} value   If >= 0, set as the offset and turn bump mapping on. 
   *      Else, turn bump mapping off.
   */
  setBump: function(gl, value) {
    this._bumpTexUni.set(gl, [value]);
    this._useBumpUni.set(gl, [1]);
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
      this._lightUni.type.set(gl, [TentaGL.PhongShaderMac.LIGHT_AMB]);
    }
    if(light.isaPointLight) {
      this._lightUni.type.set(gl, [TentaGL.PhongShaderMac.LIGHT_PT]);
    }
    if(light.isaDirectionalLight) {
      this._lightUni.type.set(gl, [TentaGL.PhongShaderMac.LIGHT_DIR]);
    }
    if(light.isaSpotLight) {
      this._lightUni.type.set(gl, [TentaGL.PhongShaderMac.LIGHT_SPOT]);
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
 * Loads PhongShaderMac into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.PhongShaderMac.load = function(gl, name) {
  var program = new TentaGL.PhongShaderMac(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.PhongShaderMac, TentaGL.ShaderProgram);

