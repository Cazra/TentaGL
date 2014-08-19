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

TentaGL.PhongShader.prototype = {
  
  constructor: TentaGL.PhongShader,
  
  isaPhongShader: true,
  
  
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
  
  
  //////// LightsShader implementations
  
  getMaxLights: function() {
    return TentaGL.PhongShader.MAX_LIGHTS;
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


Util.Inheritance.inherit(TentaGL.PhongShader, TentaGL.LightsShader);

