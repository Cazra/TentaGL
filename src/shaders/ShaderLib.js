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
 * An API for managing the set of shader programs loaded in a gl context.
 */
TentaGL.ShaderLib = {
  
  
  /** 
   * Removes all loaded shader programs the shader library for a gl context. 
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    for(var i in gl._shaderLib) {
      gl._shaderLib[i].clean(gl);
    }
    gl._shaderLib = {};
    gl._shaderStack = [];
  },
  
  
  /** 
   * Cleans the library and preloads the following built-in shader programs:  
   * "pickShader" - Program used by TentaGL.Picker which colors each sprite
   *                a unique solid color which can then be read back for
   *                mouse-overs.   
   */
  reset:function(gl) {
    this.clean(gl);
    TentaGL.DefaultShader.load(gl, TentaGL.DefaultShader.SHADER_ID);
    TentaGL.PickShader.load(gl, TentaGL.Picker.SHADER_ID);
    
    this.use(gl, TentaGL.DefaultShader.SHADER_ID);
  },
  
  
  
  /** 
   * Returns the default root directory for loading premade ShaderPrograms.
   * By default, this is "./shaders/".
   * @param {WebGLRenderingContext} gl
   */
  getDefaultShaderPath: function(gl) {
    if(!gl._shaderDir) {
      gl._shaderDir = "./shaders/";
    }
    return gl._shaderDir;
  },
  
  
  /** 
   * Sets the default root directory for loading premade ShaderPrograms.
   * @param {WebGLRenderingContext} gl
   * @param {string} dirPath
   */
  setDefaultShaderPath: function(gl, dirPath) {
    gl._shaderDir = dirPath;
  },
  
  
  /** 
   * Adds a program to the shader library of a gl context. 
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @param {TentaGL.ShaderProgram} program
   * @return {TentaGL.ShaderProgram}  The ShaderProgram that was added.
   */
  add: function(gl, name, program) {
    gl._shaderLib[name] = program;
    return program;
  },
  
  
  /** 
   * Deletes the shader program with the specified name from a gl context.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   */
  remove:function(gl, name) {
    var program = gl._shaderLib[name];
    program.clean(gl);
    
    // Remove the program from the library's associative arrays.
    delete gl._shaderLib[name];
  },
  
  /** 
   * Sets the WebGL context to use the specified shader program. 
   * @return {TentaGL.ShaderProgram} The shader program now being used.
   */
  use:function(gl, name) {
    if(TentaGL.Picker.isPicking(gl) || TentaGL.Outliner.isOutlining(gl) || gl._shaderLibCurrentName === name) {
      return;
    }
    
    var program = gl._shaderLib[name];
    program.useMe(gl);
    
    if(program.setOpacity) {
      program.setOpacity(gl, 1);
    }
    
    gl._shaderLibCurrentProgram = program;
    gl._shaderLibCurrentName = name;
    TentaGL.MaterialLib.useNone(gl);
    
    TentaGL.SceneProps.use(gl);
    
    return program;
  },
  
  /** 
   * Returns the ShaderProgram currently being used by the WebGL context. 
   * @return {TentaGL.ShaderProgram}
   */
  current:function(gl) {
    return gl._shaderLibCurrentProgram;
  },
  
  
  /** Returns the ID of the ShaderProgram currently being used. */
  currentName: function(gl) {
    return gl._shaderLibCurrentName;
  },
  
  
  /** 
   * Pushes the current shader program onto the top of the shader stack. 
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    gl._shaderStack.push(gl._shaderLibCurrentName);
  },
  
  /** 
   * Pops the top shader program from the shader stack and uses it as the
   * current shader program.
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var name = gl._shaderStack.pop();
    this.use(gl, name);
  }
};



