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
  
  var self = this;
  
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating PhongShader");
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
    self._bumpTexUni = self.getUniform("bumpTex");
    self._useBumpUni = self.getUniform("useBumpTex");
    
    // Material struct
    self._materialUni = {};
    self._materialUni.diff = self.getUniform("m.diff");
    self._materialUni.spec = self.getUniform("m.spec");
    self._materialUni.amb = self.getUniform("m.amb");
    self._materialUni.emis = self.getUniform("m.emis");
    self._materialUni.shininess = self.getUniform("m.shininess");
    
    // Lights struct array
    self._lightsUni = []; 
    for(var i=0; i < TentaGL.PhongShader.MAX_LIGHTS; i++) {
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

TentaGL.PhongShader.MAX_LIGHTS = 16;
TentaGL.PhongShader.LIGHT_AMB = 1;
TentaGL.PhongShader.LIGHT_PT = 2;
TentaGL.PhongShader.LIGHT_DIR = 3;
TentaGL.PhongShader.LIGHT_SPOT = 4;

TentaGL.PhongShader.prototype = {
  
  constructor: TentaGL.PhongShader,
  
  isaPhongShader: true,
  
  /** 
   * Sets the value of the opacity variable. This controls the uniform alpha
   * level for rendered objects.
   * @param {WebGLRenderingContext} gl
   * @param {float} o
   */
  setOpacity: function(gl, o) {
    this._opacityUni.set(gl, [o]);
  },
  
  
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
        lightUni.pos.set(gl, light.xyz());
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
        var atten = light.attenuation();
        lightUni.attenA.set(gl, [atten[0]]);
        lightUni.attenB.set(gl, [atten[1]]);
        lightUni.attenC.set(gl, [atten[2]]);
      }
      else {
        lightUni.attenA.set(gl, [0]);
        lightUni.attenB.set(gl, [0]);
        lightUni.attenC.set(gl, [0]);
      }
      
      // cutOffAngleCos, spotExp (float x2)
      if(light.isaSpotLight) {
        lightUni.cutOffAngleCos.set(gl, [Math.cos(light.getCutOffAngle())]);
        lightUni.spotExp.set(gl, [light.getSpotExponent()]);
      }
      else {
        lightUni.cutOffAngleCos.set(gl, [0]);
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
      
      lightUni.cutOffAngleCos.set(gl, [0]);
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

