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
 * A singleton containing a library of loaded shader programs. 
 * This is essentially just a fancy associative array, so once a program has
 * been added to it with ShaderLib.add, the program can be accessed with 
 * ShaderLib["myProgramName"]. The programs can be accessed either by their
 * name or by their WebGLProgram object.
 */
TentaGL.ShaderLib = {
  
  
  /** The collection of loaded shader programs. */
  _programs: {},
  
  
  /** 
   * If true, then the ShaderLib cannot change what program is used by 
   * the GL context. See the lock() and unlock() methods.
   */
  _locked: false,
  
  
  /** Removes all loaded shader programs from the library and GL context. */
  clean:function(gl) {
    for(var i in this._programs) {
      this._programs[i].clean(gl);
    }
    this._programs = {};
  },
  
  
  /** 
   * Cleans the library and preloads the following built-in shader programs:  
   * "pickShader" - Program used by TentaGL.Picker which colors each sprite
   *                a unique solid color which can then be read back for
   *                mouse-overs.   
   */
  reset:function(gl) {
    this.clean(gl);
    TentaGL.Picker.loadShaderProgram(gl);
  },
  
  
  /** 
   * Attempts to load a new shader program into the shaderLib. If there are any
   * errors compiling the shader program, those errors are printed to the 
   * console and an Error is thrown.
   * @param {WebGLRenderingContext} gl  The WebGL context.
   * @param {string} name  The name used to access the shader program in 
   *    the library.
   * @param {string} vertSrc  The source code string for the program's 
   *    vertex shader.
   * @param {string} fragSrc  The source code string for the program's
   *    fragment shader.
   * @return {TentaGL.ShaderProgram} The created ShaderProgram.
   */
  add:function(gl, name, vertSrc, fragSrc) {
    var program = new TentaGL.ShaderProgram(gl, name, vertSrc, fragSrc);
    var glProg = program.getWebGLProgram();
    
    this[name] = program;
    this[glProg] = program;
    
    return program;
  }, 
  
  
  /** 
   * Deletes the shader program with the specified name from the 
   * ShaderLib and WebGL context. 
   */
  remove:function(gl, name) {
    var program = this[name];
    var glProg = program.getWebGLProgram();
    
    // Delete it from the WebGL context.
    program.deleteMe(gl);
    
    // Remove the program from the library's associative arrays.
    delete this[name];
    delete this[glProg];
  },
  
  /** 
   * Sets the WebGL context to use the specified shader program. 
   * @return {TentaGL.ShaderProgram} The shader program now being used.
   */
  use:function(gl, name) {
    if(this._locked || this._currentName === name) {
      return;
    }
    
    var program = this[name];
    program.useMe(gl);
    
    this._currentProgram = program;
    this._currentName = name;
    TentaGL.MaterialLib.useNone();
    
    return program;
  },
  
  /** 
   * Returns the ShaderProgram currently being used by the WebGL context. 
   * @return {TentaGL.ShaderProgram}
   */
  current:function(gl) {
    return this._currentProgram;
  },
  
  
  /** 
   * Locks the ShaderLib so that it can't change which shader program is being 
   * used by the GL context. 
   */
  lock:function() {
    this._locked = true;
  },
  
  /** 
   * Unlocks the ShaderLib so that it can once again be able to change
   * which shader program is being used by the GL context.
   */
  unlock:function() {
    this._locked = false;
  }
};



