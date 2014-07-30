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
 * Abstraction for a layer of model-control update and view rendering logic 
 * for an Application. This can be thought of as a "level" in the computer 
 * game sense of the word, or as some logical interface in a more serious
 * application. It is also possible to nest levels within levels.
 * @constructor
 * @param {TentaGL.Application} app   The application this level is running in.
 *      Through the app, the developer can access various parts of the 
 *      application state, such as the GL context and mouse and keyboard input.
 */
TentaGL.Level = function(app) {
  this._app = app;
};

TentaGL.Level.prototype = {
  
  constructor:TentaGL.Level, 
  
  isaLevel: true,
  
  //////// Application state access
  
  /** 
   * Returns the Application this level is part of. 
   * @return {TentaGL.Application}
   */
  getApp:function() {
    return this._app;
  },
  
  /** 
   * Returns the app's Keyboard input object. 
   * @return {TentaGL.Keyboard}
   */
  keyboard:function() {
    return this._app.keyboard();
  },
  
  /** 
   * Returns the app's Mouse input object.
   * @return {TentaGL.Mouse}
   */
  mouse:function() {
    return this._app.mouse();
  },
  
  
  /** 
   * Returns the app's Picker object for mouse-over data.
   * @return {TentaGL.Picker}
   */
  picker:function() {
    return this._app.getPicker();
  },
  
  //////// Abstract level methods
  
  /** 
   * Cleans up the level's state when we are done with it. 
   * If GL memory resources were created only for this level, they should also
   * be freed here.
   * Override this.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {},
  
  
  /** 
   * Resets the level's state and loads any special resources used only by this
   * level. 
   * Override this.
   * @param {WebGLRenderingContext} gl
   */
  reset:function(gl) {},
  
  
  
  /** 
   * Performs an iteration through the level's update loop. 
   * Override this.
   * @param {WebGLRenderingContext} gl
   */
  update:function(gl) {},
  
  
  /** 
   * Performs an iteration through the level's render loop. 
   * Override this.
   * @param {WebGLRenderingContext} gl
   */
  render:function(gl) {}
};


