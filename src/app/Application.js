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
 * Constructor for a TentaGL application. 
 * @constructor
 * @param {DOM div element} container   An empty div element to contain the
 *      application and its Canvas.
 */
TentaGL.Application = function(container, attrs) {
  console.log("TentaGL version " + this.versionMajor + "." + this.versionMinor);
  
  this._container = container;
  this._gl = TentaGL.createGL(container, attrs);
  this._canvas = this._gl.canvas;
  
  
};


TentaGL.Application.prototype = {
  
  construct:TentaGL.Application, 
  
  /** Starts the application loop. */
  start:function() {
    this._lastTimestamp = Date.now();
    initResources();
    run(this._lastTimestamp);
  },
  
  /** 
   * Runs an iteration of the application loop and then schedules the next 
   * iteration so that the application tries to run at 60 frames per second. 
   */
  run:function(timestamp) {
    console.log("running. Time since last frame: " + (timestamp - this._lastTimestamp));
    
    this.update();
    
    this._lastTimestamp = timestamp;
    requestAnimationFrame(this.run);
  },
  
  
  /** 
   * Runs an iteration of the application loop and renders the application. 
   * Override this. 
   */
  update:function() {},
  
  
  /** Initializes the application's shaders, materials, and models. */
  initResources:function() {
    this.initShaders();
    this.initMaterials();
    this.initModels();
  },
  
  /** 
   * Initializes shaders for the application. 
   * Override this. 
   */
  initShaders:function() {},
  
  /** 
   * Initializes materials for the application. 
   * Override this. 
   */
  initMaterials:function() {},
  
  /** 
   * Initializes models for the application. 
   * Override this. 
   */
  initModels:function() {},
  
  
  /** 
   * Returns the div element containing the application.
   * @return {DOM div element}
   */
  getContainer:function() {
    return this._container;
  },
  
  /** 
   * Returns the WebGLContext for this application. 
   * @return {WebGLContext}
   */
  getGL:function() {
    return this._gl;
  },
  
  /** 
   * Returns the Canvas for this applicaiton.
   * @return {DOM Canvas element}
   */
  getCanvas:function() {
    return this._canvas;
  },
  
  /** 
   * Returns the width of the application container.
   * @return {Number}
   */
  getWidth:function() {
    return this._container.offsetWidth;
  },
  
  /**
   * Returns the height of the application container.  
   * @return {Number}
   */
  getHeight:function() {
    return this._container.offsetHeight;
  },
  
  /**
   * Returns the aspect ratio of the application containter.
   * @return {Number}
   */
  getAspectRatio:function() {
    return this.getWidth()/this.getHeight();
  }
};



