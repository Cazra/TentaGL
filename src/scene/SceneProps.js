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
 * Encapsulates a set of scene environmental properties (lighting, fog, etc.).
 * These properties will automatically be loaded if the shader is changed if
 * they are applicable to the shader. By default, there are no lights and
 * fog is set to NONE.
 * @constructor
 */
TentaGL.SceneProps = function() {
  this._lights = new TentaGL.LightManager(0);
  this._fog = new TentaGL.Fog(TentaGL.Fog.NONE);
};


/** 
 * Uses the SceneProps previously used by the GL context. 
 * @param {WebGLRenderingContext} gl
 */
TentaGL.SceneProps.use = function(gl) {
  if(gl._sceneProps === undefined) {
    gl._sceneProps = new TentaGL.SceneProps();
  }
  gl._sceneProps.useMe(gl);
}


TentaGL.SceneProps.prototype = {
  
  constructor: TentaGL.SceneProps,
  
  isaSceneProps: true,
  
  
  /** 
   * Setter/getter for the scene's LightManager.
   * @param {TentaGL.LightManager} lights   Optional.
   * @return {TentaGL.LightManager}
   */
  lights: function(lights) {
    if(lights !== undefined) {
      this._lights = lights;
    }
    return this._lights;
  },
  
  
  /** 
   * Setter/getter for the scene's Fog.
   */
  fog: function(fog) {
    if(fog !== undefined) {
      this._fog = fog;
    }
    return this._fog;
  },
  
  
  /** 
   * (Re)loads these scene properties for the current shader. 
   * @param {WebGLRenderingContext} gl
   */
  useMe: function(gl) {
    gl._sceneProps = this;
    
    if(TentaGL.ShaderLib.current(gl) !== undefined) {
      this._lights.useMe(gl);
      this._fog.useMe(gl);
    }
  }
};

