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
 * A structure for managing the lights in a scene.
 * @constructor
 * @param {uint} maxLights    The maximum number of lights allowed by shaders 
 *      using this manager. 
 */
TentaGL.LightManager = function(maxLights) {
  this._lights = [];
  this._maxLights = maxLights;
};


TentaGL.LightManager.prototype = {
  
  constructor: TentaGL.LightManager,
  
  isaLightManager: true, 
  
  
  /** 
   * Adds a Light to the manager. 
   * @param {TentaGL.Light} light
   */
  add: function(light) {
    if(this._lights.length == this._maxLights) {
      throw new Error("Too many lights.");
    }
    else {
      this._lights.push(light);
    }
  },
  
  
  /** 
   * Returns the nth light stored in this manager.
   * @param {uint} n
   * @return {TentaGL.Light}
   */
  get: function(n) {
    return this._lights[n];
  },
  
  
  /** 
   * Returns a list of all the lights in the manager.
   * @return {array: TentaGL.Light}
   */
  getAll: function() {
    var result = [];
    for(var i=0; i<this._lights.length; i++) {
      result.push(this._lights[i]);
    }
    return result;
  },
  
  
  /** 
   * Removes a light from the manager. 
   * @param {TentaGL.Light} light
   */
  remove: function(light) {
    var index = this._lights.indexOf(light);
    if(index < 0) {
      throw new Error("Could not remove light.");
    }
    else {
      this._lights.splice(index, 1);
    }
  },
  
  
  /** 
   * Clears all lights from the manager. 
   */
  removeAll: function() {
    this._lights = [];
  },
  
  
  /** 
   * Returns the number of lights stored in this manager.
   * @return {uint}
   */
  getCount: function() {
    return this._lights.length;
  },
  
  
  /** 
   * Returns the maximum number of lights allowed in this manager.
   * @return {uint}
   */
  getMaxCount: function() {
    return this._maxLights;
  },
  
  
  /** 
   * Sets the current shader program to use the lights from this manager.
   * @param {WebGLRenderingContext} gl
   */
  useMe: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    if(program.setLights) {
      program.setLights(gl, this.getAll());
    }
  },
  
  
  render: function(gl) {
    for(var i=0; i<this._lights.length; i++) {
      this._lights[i].render(gl);
    }
  }
};


