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
 * A simple shader for rendering infinite planes.
 * Because texture coordinates cannot be computed for the geometry defining the
 * plane, we instead define the texture coordinates in the shader as a 
 * linear function of the world coordinates.
 * The user provides the coefficients for the functions.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.PlaneSimpleShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "planeSimple.vert";
  var fragURL = shaderRoot + "planeSimple.frag";
  
  var self = this;
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating PlaneSimpleShader");
    TentaGL.ShaderProgram.call(self, gl, vertSrc, fragSrc);
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
    
    self._opacityUni = self.getUniform("opacity");
    
    self._mvpUni = self.getUniform("mvpTrans");
    self._normalUni = self.getUniform("normalTrans");
    
    self._colorUni = self.getUniform("solidColor");
    self._texUni = self.getUniform("tex");
    self._useTexUni = self.getUniform("useTex");
    
    self._sFuncUni = self.getUniform("sFunc");
    self._tFuncUni = self.getUniform("tFunc");
  });
};

TentaGL.PlaneSimpleShader.prototype = {
  
  constructor: TentaGL.PlaneSimpleShader,
  
  isaPlaneSimpleShader: true
};


/** 
 * Loads PlaneSimpleShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.PlaneSimpleShader.load = function(gl, name) {
  var program = new TentaGL.PlaneSimpleShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.PlaneSimpleShader, TentaGL.SimpleShader);
Util.Inheritance.inherit(TentaGL.PlaneSimpleShader, TentaGL.PlaneShader);

