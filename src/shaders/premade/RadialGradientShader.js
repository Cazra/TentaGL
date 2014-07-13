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
 * transform to vertices in the scene and colors texels using a texture.
 * Lighting/Shading is not provided in this program.
 * @param {WebGLRenderingContext} gl
 */
TentaGL.RadialGradientShader = function(gl) {
  var shaderRoot = TentaGL.ShaderLib.getDefaultShaderPath(gl);
  
  var vertURL = shaderRoot + "gradientRadial.vert";
  var fragURL = shaderRoot + "gradientRadial.frag";
  var src = TentaGL.ShaderProgram.srcFromURL(gl, vertURL, fragURL);
  
  console.log("\nCreating linear gradient shader");
  TentaGL.ShaderProgram.call(this, gl, src[0], src[1]);
  
  this.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  this.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  this.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  
  this._mvpUni = this.getUniform("mvpTrans");
  this._normalUni = this.getUniform("normalTrans");
  
  this._startPtUni = this.getUniform("p");
  this._gradVectorUni = this.getUniform("u");
  this._colorsUni = this.getUniform("colors[0]");
  this._breakPtsUni = this.getUniform("breakPts[0]");
  this._breakPtCountUni = this.getUniform("breakPtCount");
};

TentaGL.RadialGradientShader.prototype = {
  
  constructor: TentaGL.RadialGradientShader,
  
  isaRadialGradientShader: true,
  
  
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
   * Sets the start point of the gradient from which the gradient vector 
   * is projected.
   * @param {vec2} pt     The point, in normalized texture coordinates.
   */
  setStartPoint: function(gl, pt) {
    this._startPtUni.set(gl, pt);
    
   // console.log(pt);
  },
  
  
  /** 
   * Sets the vector indicating the direction and length of the gradient. 
   * @param {vec2} v    The vector, in normalized texture coordinates.
   */
  setGradVector: function(gl, v) {
    this._gradVectorUni.set(gl, v);
    
  //  console.log(v);
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
      arr.push(colors[i].getRed());
      arr.push(colors[i].getGreen());
      arr.push(colors[i].getBlue());
      arr.push(colors[i].getAlpha());
    }
    
    this._colorsUni.set(gl, arr);
    
    // console.log(arr);
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
    
  //  console.log(pts, pts.length);
  }
};


/** 
 * Loads RadialGradientShader into the ShaderLib, with the specified name. 
 * @param {WebGLRenderingContext} gl
 * @param {name}  The name used to reference the shader program from the ShaderLib.
 * @return {TentaGL.ShaderProgram}
 */
TentaGL.RadialGradientShader.load = function(gl, name) {
  var program = new TentaGL.RadialGradientShader(gl);
  TentaGL.ShaderLib.add(gl, name, program);
  
  return program;
};


Util.Inheritance.inherit(TentaGL.RadialGradientShader, TentaGL.ShaderProgram);

