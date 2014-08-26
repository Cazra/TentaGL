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
 * A ShaderProgram for rendering linear and radial gradients.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.GradientShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "simple.vert";
  var fragURL = shaderRoot + "gradient.frag";
  
  var self = this;
  TentaGL.ShaderLoader.load(vertURL, fragURL, function(vertSrc, fragSrc) {
    console.log("\nCreating gradient shader");
    TentaGL.ShaderProgram.call(self, gl, vertSrc, fragSrc);
    
    self.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.xyz);
    self.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.normal);
    self.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.texST);
    
    self._fogEqUni = self.getUniform("fogEquation");
    self._fogColorUni = self.getUniform("fogColor");
    self._fogDensityUni = self.getUniform("fogDensity");
    
    self._mvpUni = self.getUniform("mvpTrans");
    self._normalUni = self.getUniform("normalTrans");
    
    self._gradTypeUni = self.getUniform("gradientType");
    self._startPtUni = self.getUniform("p");
    self._gradVectorUni = self.getUniform("u");
    self._colorsUni = self.getUniform("colors[0]");
    self._breakPtsUni = self.getUniform("breakPts[0]");
    self._breakPtCountUni = self.getUniform("breakPtCount");
  });
};

TentaGL.GradientShader.prototype = {
  
  constructor: TentaGL.GradientShader,
  
  isaGradientShader: true,
  
  
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
   * Sets the type of gradient to use: linear or radial.
   * @param {WebGLRenderingContext} gl
   * @param {enum: TentaGL.Gradient}
   */
  setGradientType: function(gl, type) {
    this._gradTypeUni.set(gl, [type]);
  },
  
  
  /** 
   * Sets the start point of the gradient from which the gradient vector 
   * is projected.
   * @param {vec2} pt     The point, in normalized texture coordinates.
   */
  setStartPoint: function(gl, pt) {
    this._startPtUni.set(gl, pt);
  },
  
  
  /** 
   * Sets the vector indicating the direction and length of the gradient. 
   * @param {vec2} v    The vector, in normalized texture coordinates.
   */
  setGradVector: function(gl, v) {
    this._gradVectorUni.set(gl, v);
  },
  
  
  /** 
   * Sets the uniform variable for the array of gradient colors corresponding 
   * to each break point. 
   * The shader supports colors for up to 16 break points.
   * @param {WebGLRenderingContext} gl
   * @param {array: TentaGL.Color} colors
   */
  setColors: function(gl, colors) {
    var arr = [];
    
    for(var i=0; i<colors.length; i++) {
      arr.push(colors[i].r());
      arr.push(colors[i].g());
      arr.push(colors[i].b());
      arr.push(colors[i].a());
    }
    
    this._colorsUni.set(gl, arr);
  },
  
  
  /** 
   * Sets the parametric values for the break points along the gradient vector. 
   * The shader supports up to 16 break points.
   * Each of these values should be in the range [0, 1].
   * @param {WebGLRenderingContext} gl
   * @param {array: float} pts
   */
  setBreakPoints: function(gl, pts) {
    this._breakPtsUni.set(gl, pts);
    this._breakPtCountUni.set(gl, [pts.length]);
  }
  
};


/** 
 * Loads GradientShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.GradientShader.load = function(gl, name) {
  var program = new TentaGL.GradientShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.GradientShader, TentaGL.FogShader);

