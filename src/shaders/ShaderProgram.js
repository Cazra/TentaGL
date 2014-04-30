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
 * @param {string} id   A unique ID for this program in the ShaderLib.
 * @param {string} vertSrc  The source code string for the program's 
 *    vertex shader.
 * @param {string} fragSrc  The source code string for the program's
 *    fragment shader.
 */
TentaGL.ShaderProgram = function(gl, id, vertSrc, fragSrc) {
  var vert = this._compileShader(gl, GL_VERTEX_SHADER, vertSrc);
  var frag = this._compileShader(gl, GL_FRAGMENT_SHADER, fragSrc);
  
  this._id = id;
  this._glProg = this._linkProgram(gl, vert, frag);
  this._uniforms = this._initUniforms(gl);
  this._attributes = this._initAttributes(gl);
  
  this._showErrors = true;
};

TentaGL.ShaderProgram.prototype = {
  
  constructor: TentaGL.ShaderProgram,
  
  /** 
   * Returns the ID for this shader program.
   * @return {string}
   */
  getID:function() {
    return this._id;
  },
  
  
  /** 
   * Compiles a source code for either a vertex shader or fragment shader. 
   * @private
   * @param {WebGLRenderingContext} gl
   * @param {int} glType  Either GL_VERTEX_SHADER or GL_FRAGMENT_SHADER.
   * @param {string} src  The source code for the shader.
   * @return {WebGLShader} The compiled shader.
   */
  _compileShader:function(gl, glType, src) {
    if(glType != GL_VERTEX_SHADER && glType != GL_FRAGMENT_SHADER) {
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
      if(!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
        var msg = gl.getShaderInfoLog(shader);
        var typeStr = "";
        if(glType == GL_VERTEX_SHADER) {
          typeStr = "vertex";
        }
        else if(glType == GL_FRAGMENT_SHADER) {
          typeStr = "fragment";
        }
        throw Error("Failed to compile " + typeStr + " shader :\n" + msg);
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
    
    if(!gl.getProgramParameter(program, GL_LINK_STATUS)) {
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
  clean:function(gl) {
    gl.deleteProgram(this._glProg);
  },
  
  
  /** Sets the WebGL context to use this ShaderProgram. */
  useMe:function(gl) {
    // Disable the variables of the program previously being used. 
    var previous = TentaGL.ShaderLib.current(gl);
    if(previous !== undefined) {
      previous._disableAllAttrs(gl);
    }
    
    gl.useProgram(this._glProg);
    
    // Enable the vertex attributes defined for this ShaderProgram.
    this._enableAllAttrs(gl);
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
   * @private
   * @param {WebGLRenderingContext} gl
   */
  _initUniforms:function(gl) {
    var uniMap = {};
    var numVars = gl.getProgramParameter(this._glProg, GL_ACTIVE_UNIFORMS);
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
   * @private
   * @param {WebGLRenderingContext} gl
   */
  _initAttributes:function(gl) {
    var attrMap = {};
    var numVars = gl.getProgramParameter(this._glProg, GL_ACTIVE_ATTRIBUTES);
    console.log("# Active Attributes: " + numVars);
    
    for(var i = 0; i < numVars; i++) {
      var info = gl.getActiveAttrib(this._glProg, i);
      var name = info.name;
      var location = gl.getAttribLocation(this._glProg, name);
      var attr = new TentaGL.Attribute(info, this._glProg, location);
      
      console.log("Attribute " + i + ": " + info.name + ", type " + TentaGL.glTypeName(info.type) + ", size " + info.size + ", byteSize " + attr.getSizeBytes() + ", unitSize " + attr.getSizeUnits());
      
      attrMap[name] = attr;
    }
    
    return attrMap;
  },
  
  
  /** 
   * Returns true if this program has a uniform variable with the given name. 
   * @param {string} name
   * @return {Boolean}
   */
  hasUniform:function(name) {
    if(this._uniforms[name]) {
      return true;
    }
    else {
      return false;
    }
  },
  
  
  /** 
   * Returns a Uniform variable for the program, given its name.
   * @param {string} name
   * @return {TentaGL.Uniform}
   */
  getUniform:function(name) {
    if(!this._uniforms[name] && this._showErrors) {
      console.log("Uniform variable " + name + " doesn't exist.");
    //  throw Error();
    }
    return this._uniforms[name];
  },
  
  /**
   * Returns an Attribute variable for the program, given its name.
   * @param {string} name
   * @return {TentaGL.Attribute}
   */
  getAttribute:function(name) {
    return this._attributes[name];
  },
  
  
  /** 
   * Returns a list of this program's uniform variables. 
   * @return {Array: TentaGL.Uniform}
   */
  getUniforms:function() {
    var result = [];
    for(var i in this._uniforms) {
      result.push(this._uniforms[i]);
    }
    return result;
  },
  
  /** 
   * Returns a list of this program's attribute variables.
   * @return {Array: TentaGL.Attribute}
   */
  getAttributes:function() {
    var result = [];
    for(var i in this._attributes) {
      result.push(this._attributes[i]);
    }
    return result;
  },
  
  
  /** 
   * Returns a list of this program's uniform variable names.
   * @return {Array: string}
   */
  getUniNames:function() {
    var result = [];
    for(var i in this._uniforms) {
      result.push(i);
    }
    return result;
  },
  
  /** 
   * Returns a list of this program's attribute variable names.
   * @return {Array: string}
   */
  getAttrNames:function() {
    var result = [];
    for(var i in this._attributes) {
      result.push(i);
    }
    return result;
  },
  
  /** 
   * Returns the value of a Uniform variable.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @return {any} see getUniform at http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14.10
   */
  getUniValue:function(gl, name) {
    var uniform = this._uniforms[name];
    return uniform.get(gl);
  },
  
  /** 
   * Sets the value of a Uniform variable.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @param {typed array} valueArray   A typed array of the appropriate type and 
   *      length for the variable.
   */
  setUniValue:function(gl, name, valueArray) {
    var uniform = this.getUniform(name);
    if(uniform) {
      uniform.set(gl, valueArray);
    }
  },
  
  
  /** 
   * Sets a vertex Attribute to read from the currently bound array buffer with
   * the specified stride and offset.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @param {GLint} bufferStride    The byte offset between consecutive 
   *      attributes of this type in the bound buffer. If 0, then the attributes
   *      are understood to be sequential.
   * @param {GLint} bufferOffset    The offset of the first attribute of this 
   *      type in the bound buffer.
   */
  bindAttr:function(gl, name, bufferStride, bufferOffset) {
    var attribute = this._attributes[name];
    attribute.set(gl, bufferStride, bufferOffset);
  },
  
  
  /** 
   * Sets which method in TentaGL.Vertex's prototype is used to get the data
   * for the specified attribute.
   * @param {string} name   The attribute's name.
   * @param {Function} getterFunc   Vertex's getter function returning the 
   *      typed array corresponding to the attribute.
   */
  setAttrGetter:function(name, getterFunc) {
    this._attributes[name].setGetter(getterFunc);
  },
  
  
  /** 
   * Returns the total byte stride needed for a tightly packed buffer to  
   * contain the data for all this program's attribute data.
   * @return {int}
   */
  getAttrStride:function() {
    if(this._totalStride === undefined) {
      this._totalStride = 0;
      for(var attrName in this._attributes) {
        var attr = this._attributes[attrName];
        this._totalStride += attr.getSizeBytes();
      }
    }
    return this._totalStride;
  },
  
  
  
  /** 
   * Enables all vertex attributes for this program.
   * @param {WebGLRenderingContext} gl
   */
  _enableAllAttrs:function(gl) {
    for(var name in this._attributes) {
      var attr = this._attributes[name];
      gl.enableVertexAttribArray(attr.getLocation());
    }
  },
  
  
  /** 
   * Disables all vertex attributes for this program.
   * @param {WebGLRenderingContext} gl
   */
  _disableAllAttrs:function(gl) {
    for(var name in this._attributes) {
      var attr = this._attributes[name];
      gl.disableVertexAttribArray(attr.getLocation());
    }
  },
  
  
  //////// TentaGL supported uniforms
  
  //// MVPTrans
  
  /** 
   * Sets the value of the mat4 uniform variable bound to store the model-view-
   * projection transformation matrix.
   * An error is thrown if a uniform hasn't been bound to the sprites' model 
   * transform matrices.
   * @param {WebGLRenderingContext} gl
   * @param {typed array} value   A typed array of the appropriate type and 
   *      length for the variable.
   */
  setMVPTransUniValue:function(gl, value) {
    if(this._mvpUni) {
      this._mvpUni.set(gl, value);
    }
  },
  
  /** 
   * Binds the mat4 uniform variable with the specified name in this  
   * ShaderProgram to store the model-view-projection transformation matrix.
   * An error is thrown if the specified uniform doesn't exist in this program.
   * @param {string} uniName
   */
  bindMVPTransUni:function(uniName) {
    this._mvpUni = this.getUniform(uniName);
  },
  
  
  //// NormalTrans
  
  /** 
   * Sets the value of the mat3 uniform variable bound to store the  
   * normal transformation matrix.
   * An error is thrown if a uniform hasn't been bound to the sprites' model 
   * transform matrices.
   * @param {WebGLRenderingContext} gl
   * @param {typed array} value   A typed array of the appropriate type and 
   *      length for the variable.
   */
  setNormalTransUniValue:function(gl, value) {
    if(this._normalUni) {
      this._normalUni.set(gl, value);
    }
  },
  
  /** 
   * Binds the mat3 uniform variable with the specified name in this  
   * ShaderProgram to store the normal transformation matrix.
   * An error is thrown if the specified uniform doesn't exist in this program.
   * @param {string} uniName
   */
  bindNormalTransUni:function(uniName) {
    this._normalUni = this.getUniform(uniName);
  },
  
  
  //// Colors
  
  /** 
   * Sets the value of the vec4 uniform variable used to store the RGBA 
   * values of a color material. 
   * @param {WebGLRenderingContext} gl
   * @param {typed array} value   A typed array of the appropriate type and 
   *      length for the variable.
   */
  setColorUniValue:function(gl, value) {
    if(this._colorUni) {
      this._colorUni.set(gl, value);
    }
  },
  
  
  /** 
   * Binds the vec4 uniform variable used to store the RGBA values of a color
   * material.
   * @param {string} uniName
   */
  bindColorUni:function(uniName) {
    this._colorUni = this.getUniform(uniName);
  },
  
  
  //// Texture0
  
  
  /** 
   * Sets the value of the sampler2D uniform variable bound to store the 
   * texture0 start offset. In most cases, just give it the value 0.
   * @param {WebGLRenderingContext} gl
   * @param {int} value
   */
  setTex0UniValue:function(gl, value) {
    if(this._tex0Uni) {
      this._tex0Uni.set(gl, value);
    }
  },
  
  
  /** 
   * Binds the sampler2D uniform variable with the specified name in this
   * ShaderProgram to store the start offset for texture0.
   * @param {string} uniName
   */
  bindTex0Uni:function(uniName) {
    this._tex0Uni = this.getUniform(uniName);
  },
  
  
  
  
  
  
  //// Opacity
  
  /** 
   * Sets the value of the float uniform variable bound to store opacity.
   * An error is thrown if a uniform hasn't been bound to the sprites' model 
   * transform matrices.
   * @param {WebGLRenderingContext} gl
   * @param {typed array} value   A typed array of the appropriate type and 
   *      length for the variable.
   */
  setOpacityUniValue:function(gl, value) {
    if(this._opacityUni) {
      this._opacityUni.set(gl, value);
    }
  },
  
  
  /** 
   * Binds the float uniform variable with the specified name in this
   * ShaderProgram to store the opacity.
   * An error is thrown if the specified uniform doesn't exist in this program.
   * @param {string} uniName
   */
  bindOpacityUni:function(uniName) {
    this._opacityUni = this.getUniform(uniName);
  },
  
  //// Picking
  
  /** 
   * Sets the value of the float uniform variable bound to store opacity.
   * An error is thrown if a uniform hasn't been bound to the sprites' model 
   * transform matrices.
   * @param {WebGLRenderingContext} gl
   * @param {typed array} value   A typed array of the appropriate type and 
   *      length for the variable.
   */
  setPickIDUniValue:function(gl, value) {
    if(this._pickIDUni) {
      this._pickIDUni.set(gl, value);
    }
  },
  
  
  /** 
   * Binds the float uniform variable with the specified name in this
   * ShaderProgram to store the opacity.
   * An error is thrown if the specified uniform doesn't exist in this program.
   * @param {string} uniName
   */
  bindPickIDUni:function(uniName) {
    this._pickIDUni = this.getUniform(uniName);
  },
};

