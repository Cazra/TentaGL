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
 * A TentaGL application. This helps set up many things expected from 
 * applications produced with TentaGL so that the user only needs to implement
 * their own application logic for the functions that initialize their 
 * app's data and run an iteration of its update loop.
 * @constructor
 * @param {DOM div element} container   An empty div element to contain the
 *      application and its Canvas.
 */
TentaGL.Application = function(container, attrs) {
  console.log("TentaGL version " + TentaGL.versionMajor + "." + TentaGL.versionMinor);
  
  this._container = container;
  var canvas = TentaGL.createCanvas(container);
  
  try {
    this._gl = TentaGL.createGL(canvas, attrs);
    
    this._canvas = this._gl.canvas;
  
    this._keyboard = new TentaGL.Keyboard(container);
    this._mouse = new TentaGL.Mouse(canvas);
    this._picker = new TentaGL.Picker(this);
    this._levelManager = new TentaGL.LevelManager();
    
    container.onresize = function() {
      console.log(container.offsetWidth, container.offsetHeight);
    };
    
    this._resizeListeners = [];
  }
  catch(err) {
    var divText = "WebGL is not enabled in your browser.<br/><br/>";
    
    if(Util.Browser.chrome()) {
      divText += "To enable WebGL in Chrome, go to chrome://flags, scroll to the Disable WebGL flag, and click disable.";
    }
    else if(Util.Browser.firefox()) {
      divText += "To enable WebGL in Firefox, go to about:config, scroll to the webgl.disabled preference, set it to false.";
    }
    else if(Util.Browser.safari()) {
      divText += "To enable WebGL in Safari, go to the Develop menu and check Enable WebGL.";
    }
    else if(Util.Browser.ie()) {
      divText += "Sorry, but TentaGL does not support Internet Explorer.";
    }
    else {
      divText += "I'd try to help you enable WebGL, but I can't tell what browser you're using. :(";
    }
    
    container.innerHTML = divText;
    container.style.border = "solid black 2px";
    container.style.padding = "16px";
  }
};


TentaGL.Application.prototype = {
  
  construct:TentaGL.Application, 
  
  /** Starts the application loop. */
  start:function() {
    this.initResources();
    this.run(0);
  },
  
  /** Cleans and initializes the application's shaders, materials, and models. */
  initResources:function() {
    var gl = this.getGL();
    
    TentaGL.ShaderLib.reset(gl);
    TentaGL.ModelLib.reset(gl);
    TentaGL.MaterialLib.reset(gl);
    
    this.initShaders(gl);
    this.initMaterials(gl);
    this.initModels(gl);
    
    this.reset(gl);
  },
  
  
  /** 
   * Runs an iteration of the application loop and then schedules the next 
   * iteration so that the application tries to run at 60 frames per second. 
   */
  run:function(timestamp) {
    this._isRunning = true;
    
    // Check for any scheduled conditions that would exit the update loop.
    if(this._tryEndApp() || this._tryResetApp() || this.isPaused()) {
      return;
    }
    
    
    // Initialize timing on the first frame.
    if(!this._lastTimestamp) {
      this._lastTimestamp = timestamp;
      this._lastFPSTimestamp = timestamp;
      this._fpsCount = 0;
    }
    
    // FPS counter
    if(timestamp - this._lastFPSTimestamp > 1000) {
      console.log("running. FPS: " + this._fpsCount);
      this._lastFPSTimestamp = timestamp;
      this._fpsCount = 0;
    }
    
    // Reset the GL states for this iteration.
    var gl = this.getGL();
    TentaGL.ViewTrans.reset(gl);
    TentaGL.SceneNode.resetRenderFilter();
    
    // Poll the input devices.
    this._keyboard.poll();
    this._mouse.poll();
    
    // Run an iteration of the application logic.
    this.update(gl);
    
    this._lastTimestamp = timestamp;
    this._fpsCount++;
    
    this._nextFrameID = requestAnimationFrame(this.run.bind(this));
  },
  
  
  /** 
   * Checks if the application is scheduled to end. 
   * @return {boolean} true iff it is scheduled to end.
   */
  _tryEndApp: function() {
    if(this._endFlag) {
      console.log("Ending application");
      
      this._endFlag = false;
      this._isRunning = false;
      
      return true;
    }
    else {
      return false;
    }
  },
  
  /** 
   * Checks if the application is scheduled to hard-reset. 
   * @return {boolean} true iff it is scheduled to hard-reset.
   */
  _tryResetApp: function() {
    if(this._hardResetFlag) {
      console.log("Reseting application");
      
      this._hardResetFlag = false;
      this.start();
      
      return true;
    }
    else {
      return false;
    }
  },
  
  /** 
   * Checks if the application is hard-paused.
   * @return {boolean} true iff it is hard-paused.
   */
  isPaused: function() {
    return this._isPaused;
  },
  
  
  
  /** Returns true if the application is currently running. */
  isRunning:function() {
    return this._isRunning;
  },
  
  
  
  /** 
   * Schedules this application to end at the start of the next frame. 
   */
  end:function() {
    this._endFlag = true;
  },
  
  
  /**
   * Schedules this application to end and then restart at the start of the next frame.
   */
  hardReset:function() {
    this._hardResetFlag = true;
  },
  
  
  /** 
   * Sets whether the application is hard-paused. While the application is 
   * hard-paused, it will not execute any iterations of the update loop until 
   * it is unpaused.
   * @param {boolean} paused
   */
  setPaused:function(paused) {
    if(paused) {
      this._isPaused = true;
    }
    else if(this._isPaused) {
      this._isPaused = false;
      
      if(this._isRunning) {
        this.run(0);
      }
    }
  },
  
  
  //////// Level manager
  
  /** 
   * Schedules a new level to begin running next frame. 
   * @param {TentaGL.Level} level
   */
  setLevel: function(level) {
    this._levelManager.set(level);
  },
  
  
  /** 
   * Returns the level currently running in this application.
   * @return {TentaGL.Level} level
   */
  getLevel: function() {
    return this._levelManager.get();
  },
  
  
  /** 
   * Returns the application's LevelManager. 
   * @return {TentaGL.LevelManager}
   */
  getLevelManager: function() {
    return this._levelManager;
  },
  
  
  //////// DOM and context
  
  /** 
   * Returns the div element containing the application.
   * @return {DOM div element}
   */
  getContainer:function() {
    return this._container;
  },
  
    
  /** 
   * Returns the Canvas for this applicaiton.
   * @return {DOM Canvas element}
   */
  getCanvas:function() {
    return this._canvas;
  },
  
  
  /** 
   * Returns the WebGLContext for this application. 
   * @return {WebGLContext}
   */
  getGL:function() {
    return this._gl;
  },
  
  //////// Picker
  
  
  /** 
   * Returns the applicaiton's picker.
   * @return {TentaGL.Picker}
   */
  getPicker:function() {
    return this._picker;
  },
  
  
  
  //////// Dimensions
  
  
  /** 
   * Returns the width of the application container.
   * @return {Number}
   */
  getWidth:function() {
    return this._canvas.offsetWidth;
  },
  
  /**
   * Returns the height of the application container.  
   * @return {Number}
   */
  getHeight:function() {
    return this._canvas.offsetHeight;
  },
  
  /**
   * Returns the aspect ratio of the application containter.
   * @return {Number}
   */
  getAspectRatio:function() {
    return this.getWidth()/this.getHeight();
  },
  
  
  /** 
   * Resizes the TentaGL application. 
   * This changes the size of the canvas and div elements containing it.
   * When the application is resized, it fires an AppResizeEvent to any 
   * AppResizeListeners subscribed to it.
   * @param {uint} w  The new width.
   * @param {uint} h  The new height.
   */
  resize:function(w, h) {
    var canvas = this.getCanvas();
    var container = this.getContainer();
    
    var oldWidth = this.getWidth();
    var oldHeight = this.getHeight();
    
    canvas.width = w;
    canvas.height = h;
    TentaGL.Viewport.xywh(this.getGL(), [0,0,w,h]);
    
    container.style.width = w;
    container.style.height = h;
    
    var event = new TentaGL.AppResizeEvent(this, w, h, oldWidth, oldHeight);
    for(var i in this._resizeListeners) {
      this._resizeListeners[i].handleAppResizeEvent(event);
    }
  },
  
  
  /** 
   * Subscribes an AppResizeListener to this application.
   * @param {AppResizeListener} listener
   */
  addAppResizeListener:function(listener) {
    this._resizeListeners.push(listener);
  },
  
  
  /** 
   * Unsubscribes an AppResizeListener from this application.
   * @param {AppResizeListener} listener
   */
  removeAppResizeListener:function(listener) {
    var index = this._resizeListeners.indexOf(listener);
    if(index == -1) {
      throw new Error("Failed to unsubscribe AppResizeListener.");
    }
    else {
      this._resizeListeners.splice(index, 1);
    }
  },
  
  
  //////// Access to input device interfaces.
  
  /** 
   * Returns the keyboard input object for the application.
   * @return {TentaGL.Keyboard}
   */
  keyboard:function() {
    return this._keyboard;
  },
  
  
  /**
   * Returns the mouse input object for the application.
   * @return {TentaGL.Mouse}
   */
  mouse:function() {
    return this._mouse;
  },
  
  
  //////// Things the user is expected to override.
  
  /** 
   * Initializes shaders for the application. 
   * Override this. 
   */
  initShaders:function(gl) {},
  
  /** 
   * Initializes materials for the application. 
   * Override this. 
   */
  initMaterials:function(gl) {},
  
  /** 
   * Initializes models for the application. 
   * Override this. 
   */
  initModels:function(gl) {},
  
  /** 
   * Sets any other initial state of the application after other resources 
   * have been initialized. 
   * Override this.
   */
  reset:function(gl) {},
  
  /** 
   * Runs an iteration of the application loop and renders the application. 
   * Override this. 
   */
  update:function(gl) {}
  
  
  
};



