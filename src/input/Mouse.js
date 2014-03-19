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
 * Constructs a mouse input object for an Application. 
 * This keeps track of mouse detection, mouse presses and releases for the 
 * left, middle, and right buttons, and vertical and horizontal mouse wheel 
 * scroll detection.
 * @constructor
 * @param {DOM canvas element} canvas  The canvas element containing the application.
 */
TentaGL.Mouse = function(canvas) {
  
  this._xy = [0, 0];
  this._xyPage = [0, 0];
  this._mouseMovedSinceLast = false;
  this._mouseMoved = false;
  this._pressedSinceLast = [];
  this._releasedSinceLast = [];
  
  this._isPressed = [];
  this._justPressed = [];
  this._justReleased = [];
  
  this._clickCount = [];
  this._clickCount[TentaGL.Mouse.LEFT] = 0;
  this._clickCount[TentaGL.Mouse.MIDDLE] = 0;
  this._clickCount[TentaGL.Mouse.MIDDLE] = 0;
  this._lastClickTime = [];
  this._lastClickTime[TentaGL.Mouse.LEFT] = 0;
  this._lastClickTime[TentaGL.Mouse.MIDDLE] = 0;
  this._lastClickTime[TentaGL.Mouse.MIDDLE] = 0;
  this._multiClickTime = 400;
  
  this._wheelTicksXSinceLast = 0;
  this._wheelTicksYSinceLast = 0;
  this._wheelTicksX = 0;
  this._wheelTicksY = 0;
  
  var self = this; // closure magic!
  
  canvas.onmousemove = function(evt) {
    var xy = TentaGL.DOM.getAbsolutePosition(this);
    var rect = canvas.getBoundingClientRect();
    var left = TentaGL.Math.clamp(Math.floor(rect.left), 0, canvas.width);
    var top = TentaGL.Math.clamp(Math.floor(rect.top), 0, canvas.height);
    
    xy = [evt.clientX - left, evt.clientY - top];
    var xyPage = [evt.pageX, evt.pageY];
    
    self._xy = xy;
    self._xyPage = xyPage;
    self._mouseMovedSinceLast = true;
  };
  
  
  // Prevent right-click from opening the context menu.
  canvas.oncontextmenu = function(evt) {
    return false;
  };
  
  
  canvas.onmousedown = function(evt) {
  //  console.log(evt);
    self._pressedSinceLast[evt.which] = true;
    
    var now = Date.now();
    var dt = now - self._lastClickTime[evt.which];
    self._lastClickTime[evt.which] = now;
    
    if(dt < self._multiClickTime) {
      self._clickCount[evt.which]++;
    }
    else {
      self._clickCount[evt.which] = 1;
    }
  };
  
  canvas.onmouseup = function(evt) {
  //  console.log(evt);
    self._releasedSinceLast[evt.which] = true;
  };
  
  canvas.onmousewheel = function(evt) {
  //  console.log(evt);
    if(evt.wheelDeltaY < 0) {
      self._wheelTicksYSinceLast--;
    }
    else if(evt.wheelDeltaY > 0) {
      self._wheelTicksYSinceLast++;
    }
    
    if(evt.wheelDeltaX < 0) {
      self._wheelTicksXSinceLast--;
    }
    else if(evt.wheelDeltaX > 0) {
      self._wheelTicksXSinceLast++;
    }
    
    evt.preventDefault();
  };
};


// Mouse buttons constants for all browsers except IE.
TentaGL.Mouse.LEFT = 1;
TentaGL.Mouse.MIDDLE = 2;
TentaGL.Mouse.RIGHT = 3;


TentaGL.Mouse.prototype = {
  constructor:TentaGL.Mouse, 
  
  /**
   * Polls for the current mouse state since the last time this was called.
   */
  poll:function() {
    
    this._justPressed = [];
    this._justReleased = [];
    
    this._wheelTicksX = this._wheelTicksXSinceLast;
    this._wheelTicksY = this._wheelTicksYSinceLast;
    this._wheelTicksXSinceLast = 0;
    this._wheelTicksYSinceLast = 0;
    
    this._mouseMoved = this._mouseMovedSinceLast;
    this._mouseMovedSinceLast = false;
    
    // Check for presses.
    for(var i in this._pressedSinceLast) {
      if(!this._isPressed[i]) {
        this._justPressed[i] = true;
      }
      this._isPressed[i] = true;
    }
    
    // Check for releases.
    for(var i in this._releasedSinceLast) {
      this._isPressed[i] = false;
      this._justReleased[i] = true;
    }
    
    
    this._pressedSinceLast = [];
    this._releasedSinceLast = [];
  }, 
  
  
  /**
   * Returns the XY position of the mouse relative to its container.
   */
  getXY:function() {
    return [this._xy[0], this._xy[1]];
  },
  
  /**
   * Returns the X position of the mouse relative to its container.
   */
  getX:function() {
    return this._xy[0];
  },
  
  /** 
   * Returns the Y position of the mouse relative to its container.
   */
  getY:function() {
    return this._xy[1];
  },
  
  
  /** Returns the XY position of the mouse in page coordinates. */
  getPageXY:function() {
    return [this._xyPage[0], this._xyPage[1]];
  },
  
  
  /** Returns the X position of the mouse in page coordinates. */
  getPageX:function() {
    return this._xyPage[0];
  },
  
  
  /** Returns the Y position of the mouse in page coordinates. */
  getPageY:function() {
    return this._xyPage[1];
  },
  
  
  /** 
   * Returns true if the mouse has moved since the last poll. 
   */
  hasMoved:function() {
    return this._mouseMoved;
  },
  
  /** 
   * Returns true if the left mouse button is currently being pressed.
   */
  isLeftPressed:function() {
    return this._isPressed[TentaGL.Mouse.LEFT] || false;
  },
  
  /** 
   * Returns true if the left mouse button was just pressed.
   */
  justLeftPressed:function() {
    return this._justPressed[TentaGL.Mouse.LEFT] || false;
  },
  
  /**
   * Returns true if the left mouse button was just released.
   */
  justLeftReleased:function() {
    return this._justReleased[TentaGL.Mouse.LEFT] || false;
  },
  
  /** 
   * Returns the number of clicks associated with the last series of left mouse 
   * presses. 
   */
  leftClickCount:function() {
    return this._clickCount[TentaGL.Mouse.LEFT];
  },
  
  
  /** 
   * Returns true if the middle mouse button is currently being pressed.
   */
  isMiddlePressed:function() {
    return this._isPressed[TentaGL.Mouse.MIDDLE] || false;
  },
  
  /** 
   * Returns true if the middle mouse button was just pressed.
   */
  justMiddlePressed:function() {
    return this._justPressed[TentaGL.Mouse.MIDDLE] || false;
  },
  
  /**
   * Returns true if the middle mouse button was just released.
   */
  justMiddleReleased:function() {
    return this._justReleased[TentaGL.Mouse.MIDDLE] || false;
  },
  
  /** 
   * Returns the number of clicks associated with the last series of middle  
   * mouse presses. 
   */
  middleClickCount:function() {
    return this._clickCount[TentaGL.Mouse.MIDDLE];
  },
  
  
  
  
  /** 
   * Returns true if the right mouse button is currently being pressed.
   */
  isRightPressed:function() {
    return this._isPressed[TentaGL.Mouse.RIGHT] || false;
  },
  
  /** 
   * Returns true if the right mouse button was just pressed.
   */
  justRightPressed:function() {
    return this._justPressed[TentaGL.Mouse.RIGHT] || false;
  },
  
  /**
   * Returns true if the right mouse button was just released.
   */
  justRightReleased:function() {
    return this._justReleased[TentaGL.Mouse.RIGHT] || false;
  },
  
  /** 
   * Returns the number of clicks associated with the last series of right  
   * mouse presses. 
   */
  rightClickCount:function() {
    return this._clickCount[TentaGL.Mouse.RIGHT];
  },
  
  
  /**  
   * Returns the number of times the mouse wheel has scrolled up since the 
   * last poll.
   */
  scrollUpAmount:function() {
    return Math.abs(Math.max(this._wheelTicksY, 0));
  },
  
  /**  
   * Returns the number of times the mouse wheel has scrolled down since the 
   * last poll.
   */
  scrollDownAmount:function() {
    return Math.abs(Math.min(this._wheelTicksY, 0));
  },
  
  /**  
   * Returns the number of times the mouse wheel has scrolled left since the 
   * last poll.
   */
  scrollLeftAmount:function() {
    return Math.abs(Math.min(this._wheelTicksX, 0));
  },
  
  /**  
   * Returns the number of times the mouse wheel has scrolled right since the 
   * last poll.
   */
  scrollRightAmount:function() {
    return Math.abs(Math.max(this._wheelTicksX, 0));
  },
};




