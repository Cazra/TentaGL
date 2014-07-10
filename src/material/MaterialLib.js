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
 * A library of loaded Materials.
 * All materials stored in the library must implement the Material interface.
 */
TentaGL.MaterialLib = {
  
  /** Dictionary of Materials, each keyed by a unique string name. */
  _materials:{},
  
  
  /** 
   * Removes all Materials from the library and the GL context.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    for(var i in gl._materialLib) {
      gl._materialLib[i].clean(gl);
    }
    gl._materialLib = {};
  },
  
  
  reset:function(gl) {
    this.clean(gl);
  },
  
  
  
  /** 
   * Retrieves a Material by name. An Error is thrown if the material doesn't 
   * exist in the library. 
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @return {TentaGL.Material}
   */
  get:function(gl, name) {
    var material = gl._materialLib[name];
    if(material === undefined) {
      throw new Error("Material " + name + " doesn't exist.");
    }
    
    return material;
  },
  
  
  /** 
   * Returns true iff this library contains a Material with the specified name. 
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @return {Boolean}
   */
  has:function(gl, name) {
    return (gl._materialLib[name] !== undefined);
  },
  
  
  /** 
   * Adds a new Material to the library, keyed with the specified name.
   * @param {string} name
   * @param {TentaGL.Material} material
   * @return {TentaGL.Material} The material added to the library.
   */
  add:function(gl, name, material) {
    if(gl._materialLib[name] !== undefined) {
      throw new Error("Material " + name + " already exists.");
    }
    if(!material.isaMaterial) {
      throw new Error("Object for " + name + " isn't a material!");
    }
    
    gl._materialLib[name] = material;
    console.log("Added material " + name);
    
    return material;
  },
  
  /** 
   * Removes the specified Material from the library and cleans up any GL 
   * resources associated with it.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   */
  remove:function(gl, name) {
    var material = gl._materialLib[name];
    if(material === undefined) {
      throw new Error("Material " + name + " doesn't exist.");
    }
    
    material.clean(gl);
    delete gl._materialLib[name];
  },
  
  
  /** 
   * Sets the current shader program to use the specified material.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   */
  use:function(gl, name) {
    if(gl._materialLibCurrentName === name) {
      return;
    }
    
    var material = gl._materialLib[name];
    if(material === undefined) {
      throw new Error("Material " + name + " doesn't exist.");
    }
    
    material.useMe(gl);
    gl._materialLibCurrentName = name;
  },
  
  
  /** Sets the library to not currently be using a material. */
  useNone:function(gl) {
    gl._materialLibCurrentName = undefined;
  }
  
};


