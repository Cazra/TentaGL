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
 * The default shader, used when no other shader is used. It is a simple
 * pass-through shader that applies no transforms and colors all fragments 
 * white.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.DefaultShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "default.vert";
  var fragURL = shaderRoot + "default.frag";
  var src = TentaGL.ShaderProgram.srcFromURL(gl, vertURL, fragURL);
  
  console.log("\nCreating DefaultShader");
  TentaGL.ShaderProgram.call(this, gl, src[0], src[1]);
  
  this.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
};

TentaGL.DefaultShader.SHADER_ID = "_default";

TentaGL.DefaultShader.prototype = {
  
  constructor: TentaGL.DefaultShader,
  
  isaDefaultShader: true
};


/** 
 * Loads DefaultShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.DefaultShader.load = function(gl, name) {
  var program = new TentaGL.DefaultShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.DefaultShader, TentaGL.ShaderProgram);

