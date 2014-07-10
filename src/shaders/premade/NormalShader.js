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
 * transform to vertices in the scene and colors texels using the
 * interpolated normal vector of their surface.
 * Normal vector components in the range [-1, 1] will be converted into a 
 * corresponding normalized color component in the range [0,1].
 * The color's alpha component will be derived from the texture passed to the
 * shader.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.NormalShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "normal.vert";
  var fragURL = shaderRoot + "normal.frag";
  var src = TentaGL.ShaderProgram.srcFromURL(gl, vertURL, fragURL);
  
  TentaGL.ShaderProgram.call(this, gl, src[0], src[1]);
  
  this.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  this.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  this.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  
  this._mvpUni = this.getUniform("mvpTrans");
  this._normalUni = this.getUniform("normalTrans");
  this._texUni = this.getUniform("tex");
};

TentaGL.NormalShader.prototype = {
  
  constructor: TentaGL.NormalShader,
  
  isaSimpleShader: true,
  
  
  /** 
   * Sets the value of the uniform variable for the model-view-projection 
   * transform matrix.
   * @param {WebGLRenderingContext} gl
   * @param {mat4} value
   */
  setMVPTrans: function(gl, value) {
    this._mvpUni.set(gl, value);
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
   * @param {int}
   */
  setTex: function(gl, value) {
    this._texUni.set(gl, [value]);
  }
};


/** 
 * Loads NormalShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.NormalShader.load = function(gl, name) {
  var program = new TentaGL.NormalShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.NormalShader, TentaGL.ShaderProgram);

