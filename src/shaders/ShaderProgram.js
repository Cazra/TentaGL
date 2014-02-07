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
 * Constructs a shader program and loads it into the WebGL context. 
 * If any compile errors occur while compiling the vertex or fragment shaders
 * or while linking the program, they are printed to the console 
 * and an Error is thrown.
 * @constructor
 * @param {WebGLRenderingContext} gl  The WebGL context.
 * @param {string} vertSrc  The source code string for the program's 
 *    vertex shader.
 * @param {string} fragSrc  The source code string for the program's
 *    fragment shader.
 */
TentaGL.ShaderProgram = function(gl, vertSrc, fragSrc) {
  var vert = this._compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  var frag = this._compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  
  this._glProg = this._linkProgram(gl, vert, frag);
  this.uniforms = this._initUniforms(gl);
  this.attributes = this._initAttributess(gl);
};

TentaGL.ShaderProgram.prototype = {
  
  constructor: TentaGL.ShaderProgram,
  
  /** 
   * Compiles a source code for either a vertex shader or fragment shader. 
   * @private
   * @param {WebGLRenderingContext} gl
   * @param {int} glType  Either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
   * @param {string} src  The source code for the shader.
   * @return {WebGLShader} The compiled shader.
   */
  _compileShader:function(gl, glType, src) {
    if(glType != gl.VERTEX_SHADER && glType != gl.FRAGMENT_SHADER) {
      var msg = "Invalid shader type constant: " + glType;
      throw Error(msg);
    }
    else {
      
      // Create a shader of the appropriate type.
      var shader = gl.createShader(glType);
      
      // Compile the shader source code.
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      
      // Alert the user of any compile errors for the shader.
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var msg = gl.getShaderInfoLog(shader);
        throw Error("Failed to compile shader " + id + ":\n" + msg);
      }
      
      return shader;
    }
  },
  
  
  /** 
   * Links the compiled vertex and fragment shaders into a shader program.
   * @private
   * @param {WebGLRenderingContext} gl
   * @param {WebGLShader} vert  The compiled vertex shader.
   * @param {WebGLShader} frag  The compiled fragment shader.
   * @return {WebGLProgram} The linked shader program.
   */
  _linkProgram:function(gl, vert, frag) {
    var program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw Error("Failed to link shader program.");
    }
    
    return program;
  },
  
  
  /** 
   * Returns the WebGLProgram for this ProgramShader used by the WebGL context.
   * @return {WebGLProgram}
   */
  getWebGLProgram:function() {
    return this._glProg;
  },
  
  
  /** Deletes this ProgramShader from the WebGL context. */
  deleteMe:function(gl) {
    gl.deleteProgram(this._glProg);
  },
  
  
  /** Sets the WebGL context to use this ShaderProgram. */
  useMe:function(gl) {
    gl.useProgram(this._glProg);
    
    // TODO: enable the vertex attributes defined for this ShaderProgram.
  },
  
  
  /** 
   * Returns the location of a vertex attribute variable in the WebGL context. 
   * @return {GLint}
   */
  getAttribLocation:function(gl, name) {
    return gl.getAttribLocation(this._glProg, name);
  },
  
  
  /** 
   * Returns the location of a uniform variable in the WebGL context. 
   * @return {WebGLUniformLocation}
   */
  getUniformLocation:function(gl, name) {
    return gl.getUniformLocation(this._glProg, name);
  },
  
  
  /**
   * Initializes and returns the uniform variables for the program, mapped by
   * name.
   * @param {WebGLRenderingContext} gl
   */
  _initUniforms:function(gl) {
    var uniMap = {};
    var numVars = gl.getProgramParameter(this._glProg, gl.ACTIVE_UNIFORMS);
    console.log("# Active Uniforms: " + numVars);
    
    for(var i = 0; i < numVars; i++) {
      var info = gl.getActiveUniform(this._glProg, i);
      var name = info.name;
      var location = gl.getUniformLocation(this._glProg, name);
      var uni = new TentaGL.Uniform(info, this._glProg, location);
      
      console.log("Uniform " + i + ": " + info.name + ", type " + TentaGL.glTypeName(info.type) + ", size " + info.size + ", byteSize " + uni.getSizeBytes() + ", unitSize " + uni.getSizeUnits());
      
      uniMap[name] = uni;
    }
    
    return uniMap;
  },
  
  
  /**
   * Initializes and returns the vertex attribute variables for the program,
   *  mapped by name.
   * @param {WebGLRenderingContext} gl
   */
  _initAttributess:function(gl) {
    var attrMap = {};
    var numVars = gl.getProgramParameter(this._glProg, gl.ACTIVE_ATTRIBUTES);
    console.log("# Active Attributes: " + numVars);
    
    for(var i = 0; i < numVars; i++) {
      var info = gl.getActiveAttrib(this._glProg, i);
      var name = info.name;
      var location = gl.getAttribLocation(this._glProg, name);
      var attr = new TentaGL.Uniform(info, this._glProg, location);
      
      console.log("Attribute " + i + ": " + info.name + ", type " + TentaGL.glTypeName(info.type) + ", size " + info.size + ", byteSize " + attr.getSizeBytes() + ", unitSize " + attr.getSizeUnits());
      
      attrMap[name] = attr;
    }
    
    return attrMap;
  }
};