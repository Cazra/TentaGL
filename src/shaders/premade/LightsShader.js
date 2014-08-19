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
 * A base class for ShaderPrograms that implement lighting, such as any of the 
 * Phong shader implementations. 
 * @abstract
 */
TentaGL.LightsShader = function() {};

TentaGL.LightsShader.LIGHT_AMB = 1;
TentaGL.LightsShader.LIGHT_PT = 2;
TentaGL.LightsShader.LIGHT_DIR = 3;
TentaGL.LightsShader.LIGHT_SPOT = 4;

TentaGL.LightsShader.prototype = {

  constructor: TentaGL.LightsShader,
  
  isaLightsShader: true,
  
  /** 
   * Sets the material light properties struct.
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.Material.LightProps} matProps
   */
  setMaterialProps: function(gl, matProps) {
    this._materialUni.diff.set(gl, matProps.diffuse().getRGBA());
    this._materialUni.spec.set(gl, matProps.specular().getRGBA());
    this._materialUni.amb.set(gl, matProps.ambient().getRGBA());
    this._materialUni.emis.set(gl, matProps.emission().getRGBA());
    this._materialUni.shininess.set(gl, [matProps.shininess()]);
  },
  
  
  /** 
   * Sets the shader's uniform array of light structs.
   * @param {WebGLRenderingContext} gl
   * @param {array: TentaGL.Light}
   */
  setLights: function(gl, lights, maxLights) {
    var maxLights = this.getMaxLights();
    
    var numLights = Math.min(lights.length, maxLights);
    this._numLightsUni.set(gl, [lights.length]);
    
    for(var i=0; i < numLights; i++) {
      var light = lights[i];
      var lightUni = this._lightsUni[i];
      
      // type (int)
      if(light.isaAmbientLight) {
        lightUni.type.set(gl, [TentaGL.LightsShader.LIGHT_AMB]);
      }
      if(light.isaPointLight) {
        lightUni.type.set(gl, [TentaGL.LightsShader.LIGHT_PT]);
      }
      if(light.isaDirectionalLight) {
        lightUni.type.set(gl, [TentaGL.LightsShader.LIGHT_DIR]);
      }
      if(light.isaSpotLight) {
        lightUni.type.set(gl, [TentaGL.LightsShader.LIGHT_SPOT]);
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
        lightUni.dir.set(gl, light.direction());
      }
      else {
        lightUni.dir.set(gl, [0,0,0]);
      }
      
      // diff, spec, amb (vec4 x3) 
      lightUni.diff.set(gl, light.diffuse().getRGBA());
      lightUni.spec.set(gl, light.specular().getRGBA());
      lightUni.amb.set(gl, light.ambient().getRGBA());
      
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
        lightUni.cutOffAngleCos.set(gl, [Math.cos(light.cutOffAngle())]);
        lightUni.spotExp.set(gl, [light.spotExponent()]);
      }
      else {
        lightUni.cutOffAngleCos.set(gl, [0]);
        lightUni.spotExp.set(gl, [0]);
      }
    }
    
    // 0-out unused lights.
    for(var i=numLights; i< maxLights; i++) {
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
  },
  
  
  //////// Abstract methods
  
  /** 
   * Returns the maximum number of lights allowed by this particular shader. 
   * @return {uint}
   */
  getMaxLights: function() {}
  
};


Util.Inheritance.inherit(TentaGL.LightsShader, TentaGL.SimpleShader);

