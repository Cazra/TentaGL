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
 * All materials stored in the library must implement the following methods:
 * clean(gl) : void
 * useMe(gl) : void
 * isLoaded() : Boolean
 */
TentaGL.MaterialLib = {
  
  /** Dictionary of Materials, each keyed by a unique string name. */
  _materials:{},
  
  /** 
   * Retrieves a Material by name. An Error is thrown if the material doesn't 
   * exist in the library. 
   * @param {string} name
   * @return {TentaGL.Material}
   */
  get:function(name) {
    var material = this._materials[name];
    if(material === undefined) {
      throw Error("Material " + name + " doesn't exist.");
    }
    
    return material;
  },
  
  /** 
   * Adds a new Material to the library, keyed with the specified name.
   * @param {string} name
   * @param {TentaGL.Material} material
   * @return {TentaGL.Material} The material added to the library.
   */
  add:function(name, material) {
    if(this._materials[name] !== undefined) {
      throw Error("Material " + name + " already exists.");
    }
    this._materials[name] = material;
    return material;
  },
  
  /** 
   * Removes the specified Material from the library and cleans up any GL 
   * resources associated with it.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   */
  remove:function(gl, name) {
    var material = this._materials[name];
    if(material === undefined) {
      throw Error("Material " + name + " doesn't exist.");
    }
    
    material.clean(gl);
    delete this._materials[name];
  },
  
  
  /** 
   * Sets the current shader program to use the specified material.
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   */
  use:function(gl, name) {
    var material = this._materials[name];
    if(material === undefined) {
      throw Error("Material " + name + " doesn't exist.");
    }
    
    material.useMe(gl);
  },
  
  
  /** Returns true iff all the Materials in the library are loaded. */
  allLoaded:function() {
    for(var name in this._materials) {
      if(!this._materials[name].isLoaded()) {
        return false;
      }
    }
    return true;
  }
  
  
};


