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
TentaGL.PhongShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "phong.vert";
  var fragURL = shaderRoot + "phong.frag";
  var src = TentaGL.ShaderProgram.srcFromURL(gl, vertURL, fragURL);
  
  console.log("\nCreating PhongShader");
  TentaGL.ShaderProgram.call(this, gl, src[0], src[1]);
  
  this.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  this.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  this.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  this.setAttrGetter("vertexTang", TentaGL.Vertex.prototype.getTangental);
  
  this._mvpUni = this.getUniform("mvpTrans");
  this._mvUni = this.getUniform("mvTrans");
  this._vUni = this.getUniform("vTrans");
  this._normalUni = this.getUniform("normalTrans");
  
  this._texUni = this.getUniform("tex");
  this._bumpTexUni = this.getUniform("bumpTex");
  this._useBumpUni = this.getUniform("useBumpTex");
  
  // Material struct
  this._materialUni = {};
  this._materialUni.diff = this.getUniform("m.diff");
  this._materialUni.spec = this.getUniform("m.spec");
  this._materialUni.amb = this.getUniform("m.amb");
  this._materialUni.emis = this.getUniform("m.emis");
  this._materialUni.shininess = this.getUniform("m.shininess");
  
  // Lights struct array
  this._lightsUni = []; 
  for(var i=0; i < TentaGL.PhongShader.MAX_LIGHTS; i++) {
    var light = this._lightsUni[i] = {};
    var prefix = "lights[" + i + "]";
    
    light.type = this.getUniform(prefix + ".type");
    light.pos = this.getUniform(prefix + ".pos");
    light.dir = this.getUniform(prefix + ".dir");
    light.diff = this.getUniform(prefix + ".diff");
    light.spec = this.getUniform(prefix + ".spec");
    light.amb = this.getUniform(prefix + ".amb");
    light.attenA = this.getUniform(prefix + ".attenA");
    light.attenB = this.getUniform(prefix + ".attenB");
    light.attenC = this.getUniform(prefix + ".attenC");
    light.cutOffAngle = this.getUniform(prefix + ".cutOffAngle");
    light.spotExp = this.getUniform(prefix + ".spotExp");
  }
  
  this._numLightsUni = this.getUniform("numLights");
};

TentaGL.PhongShader.MAX_LIGHTS = 16;
TentaGL.PhongShader.LIGHT_AMB = 1;
TentaGL.PhongShader.LIGHT_PT = 2;
TentaGL.PhongShader.LIGHT_DIR = 3;
TentaGL.PhongShader.LIGHT_SPOT = 4;

TentaGL.PhongShader.prototype = {
  
  constructor: TentaGL.PhongShader,
  
  isaPhongShader: true,
  
  
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
   * Sets the value of the uniform variable for the primary texture offset 
   * and unsets the bump texture offset. If you want to use bump mapping, 
   * call setTex first, followed by setBump.
   * @param {WebGLRenderingContext} gl
   * @param {int} value
   */
  setTex: function(gl, value) {
    this._texUni.set(gl, [value]);
    this._useBumpUni.set(gl, [0]);
  },
  
  
  /** 
   * Sets or unsets the uniform variable for the bump texture offset. 
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
    var numLights = Math.min(lights.length, TentaGL.PhongShader.MAX_LIGHTS); // See MAX_LIGHTS constant in shader.
    this._numLightsUni.set(gl, [lights.length]);
    
    for(var i=0; i < numLights; i++) {
      var light = lights[i];
      var lightUni = this._lightsUni[i];
      
      // type (int)
      if(light.isaAmbientLight) {
        lightUni.type.set(gl, [TentaGL.PhongShader.LIGHT_AMB]);
      }
      if(light.isaPointLight) {
        lightUni.type.set(gl, [TentaGL.PhongShader.LIGHT_PT]);
      }
      if(light.isaDirectionalLight) {
        lightUni.type.set(gl, [TentaGL.PhongShader.LIGHT_DIR]);
      }
      if(light.isaSpotLight) {
        lightUni.type.set(gl, [TentaGL.PhongShader.LIGHT_SPOT]);
      }
      
      // pos (vec4)
      if(light.isaPointLight) {
        lightUni.pos.set(gl, light.getXYZ());
      }
      else {
        lightUni.pos.set(gl, [0, 0, 0, 0]);
      }
      
      // dir (vec3)
      if(light.isaDirectionalLight) {
        lightUni.dir.set(gl, light.getDirection());
      }
      else {
        lightUni.dir.set(gl, [0,0,0]);
      }
      
      // diff, spec, amb (vec4 x3) 
      lightUni.diff.set(gl, light.getDiffuse().getRGBA());
      lightUni.spec.set(gl, light.getSpecular().getRGBA());
      lightUni.amb.set(gl, light.getAmbient().getRGBA());
      
      // attenA, attenB, atten C (float x3)
      if(light.isaPointLight) {
        var atten = light.getAttenuation();
        lightUni.attenA.set(gl, [atten[0]]);
        lightUni.attenB.set(gl, [atten[1]]);
        lightUni.attenC.set(gl, [atten[2]]);
      }
      else {
        lightUni.attenA.set(gl, [0]);
        lightUni.attenB.set(gl, [0]);
        lightUni.attenC.set(gl, [0]);
      }
      
      // cutOffAngle, spotExp (float x2)
      if(light.isaSpotLight) {
        lightUni.cutOffAngle.set(gl, [light.getCutOffAngle()]);
        lightUni.spotExp.set(gl, [light.getSpotExponent()]);
      }
      else {
        lightUni.cutOffAngle.set(gl, [0]);
        lightUni.spotExp.set(gl, [0]);
      }
    }
    
    // 0-out unused lights.
    for(var i=numLights; i< TentaGL.PhongShader.MAX_LIGHTS; i++) {
      var lightUni = this._lightsUni[i];
      
      lightUni.type.set(gl, [0]);
      lightUni.pos.set(gl, [0, 0, 0, 0]);
      lightUni.dir.set(gl, [0,0,0]);
      
      lightUni.diff.set(gl, [0, 0, 0, 0]);
      lightUni.spec.set(gl, [0, 0, 0, 0]);
      lightUni.amb.set(gl, [0, 0, 0, 0]);
      
      lightUni.attenA.set(gl, [0]);
      lightUni.attenB.set(gl, [0]);
      lightUni.attenC.set(gl, [0]);
      
      lightUni.cutOffAngle.set(gl, [0]);
      lightUni.spotExp.set(gl, [0]);
    }
  }
};


/** 
 * Loads PhongShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.PhongShader.load = function(gl, name) {
  var program = new TentaGL.PhongShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.PhongShader, TentaGL.ShaderProgram);

