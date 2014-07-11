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
  
  /*
  this._mvpUni = this.getUniform("mvpTrans");
  this._vpUni = this.getUniform("vpTrans");
  this._normalUni = this.getUniform("normalTrans");
  this._texUni = this.getUniform("tex");
  
  this._bumpTexUni = this.getUniform("bumpTex");
  this._useBumpUni = this.getUniform("useBumpTex");
  
  this._numLightsUni = this.getUniform("numLights");
  this._lightsUni = this.getUniform("lights");
  */
};

TentaGL.PhongShader.prototype = {
  
  constructor: TentaGL.PhongShader,
  
  isaPhongShader: true,
  
  
  /** 
   * Sets the value of the uniform variable for the model-view-projection 
   * transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} value
   */
  setMVPTrans: function(gl, m) {
    this._mvpUni.set(gl, m);
  },
  
  
  setVPTrans: function(gl, m) {
    this._vpUni.set(gl, m);
  },
  
  
  /** 
   * Sets the value of the uniform variable for the normal transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat3} value
   */
  setNormalTrans: function(gl, value) {
    this._normalUni.set(gl, value);
  },
  
  
  /** 
   * Sets the value of the uniform variable for the primary texture offset. 
   * @param {WebGLRenderingContext} gl
   * @param {int} value
   */
  setTex: function(gl, value) {
    this._texUni.set(gl, [value]);
  },
  
  
  /** 
   * Sets or unsets the uniform variable for the bump texture offset. 
   * @param {WebGLRenderingContext} gl
   * @param {int} value   If >= 0, set as the offset and turn bump mapping on. 
   *      Else, turn bump mapping off.
   */
  setBump: function(gl, value) {
    if(value >= 0) {
      this._bumpTexUni.set(gl, [value]);
      this._useBumpUni.set(gl, [1]);
    }
    else {
      this._useBumpUni.set(gl, [0]);
    }
  },
  
  
  /** 
   * Sets the lights uniform variable array. 
   */
  setLights: function(gl, lights) {
    
  },
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

