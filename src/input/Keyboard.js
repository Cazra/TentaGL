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
 * Constructs a Keyboard input object for an Application.
 * @constructor
 * @param {DOM div element} container  The div element containing the WebGL Canvas. For 
 *      the div to be able to receive focus, set its "tabindex" attribute to 
 *      not -1.
 */
TentaGL.Keyboard = function(container) {
  this._isPressed = [];
  this._justPressed = [];
  this._justReleased = [];
  this._repPressed = [];
  
  this._pressedSinceLast = [];
  this._releasedSinceLast = [];
  
  var self = this; // Closure magic!
  
  var keyDownHandler = function(evt) {
  //  console.log("key down: " + evt.keyCode);
    self._pressedSinceLast[evt.keyCode] = true;
    evt.preventDefault();
  };
  
  var keyUpHandler = function(evt) {
  // console.log("key up: " + evt.keyCode);
    self._releasedSinceLast[evt.keyCode] = true;
    evt.preventDefault();
  };
  
  container.addEventListener("keydown", keyDownHandler, false);
  container.addEventListener("keyup", keyUpHandler, false);
};



TentaGL.Keyboard.prototype = {
  constructor:TentaGL.Keyboard,
  
  /** Polls for updated keyboard input state. */
  poll:function() {
    this._justPressed = [];
    this._justReleased = [];
    this._repPressed = [];
    
    // Check for keys pressed.
    for(var keyCode in this._pressedSinceLast) {
      if(!this._isPressed[keyCode]) {
        this._justPressed[keyCode] = true;
      }
      this._isPressed[keyCode] = true;
      this._repPressed[keyCode] = true;
    }
    
    // Check for keys released.
    for(var keyCode in this._releasedSinceLast) {
      this._justReleased[keyCode] = true;
      this._isPressed[keyCode] = false;
    }
    
    this._pressedSinceLast = [];
    this._releasedSinceLast = [];
  },
  
  
  
  /** Returns whether a key is currently pressed. */
  isPressed:function(keyCode) {
    return (this._isPressed[keyCode] || false);
  },
  
  /** Returns whether a key was just pressed. */
  justPressed:function(keyCode) {
    return (this._justPressed[keyCode] || false);
  },
  
  /** Returns whether a key was just released. */
  justReleased:function(keyCode) {
    return (this._justReleased[keyCode] || false);
  },
  
  /** Returns whether a key was just pressed or is repeat-pressing. */
  isPressedRepeating:function(keyCode) {
    return (this._repPressed[keyCode] || false);
  }
};



/** A global collection of constants for keyboard keycodes. */
var KeyCode = {
  BACK_SPACE : 8,
  TAB : 9,
  ENTER : 13,
  SHIFT : 16,
  CTRL : 17,
  ALT : 18,
  PAUSE: 19,
  CAPS_LOCK : 20,
  ESCAPE : 27,
  SPACE : 32,
  PAGE_UP : 33,
  PAGE_DOWN : 34,
  END : 35,
  HOME : 36,
  LEFT : 37,
  UP : 38,
  RIGHT : 39,
  DOWN : 40,
  INSERT : 45,
  DELETE : 46,
  NUM0 : 48,
  NUM1 : 49,
  NUM2 : 50,
  NUM3 : 51,
  NUM4 : 52,
  NUM5 : 53,
  NUM6 : 54,
  NUM7 : 55,
  NUM8 : 56,
  NUM9 : 57,
  A : 65,
  B : 66,
  C : 67,
  D : 68,
  E : 69,
  F : 70,
  G : 71,
  H : 72,
  I : 73,
  J : 74,
  K : 75,
  L : 76,
  M : 77,
  N : 78,
  O : 79,
  P : 80,
  Q : 81,
  R : 82,
  S : 83,
  T : 84,
  U : 85,
  V : 86,
  W : 87,
  X : 88,
  Y : 89,
  Z : 90,
  NUMPAD0 : 96,
  NUMPAD1 : 97,
  NUMPAD2 : 98,
  NUMPAD3 : 99,
  NUMPAD4 : 100,
  NUMPAD5 : 101,
  NUMPAD6 : 102,
  NUMPAD7 : 103,
  NUMPAD8 : 104,
  NUMPAD9 : 105,
  MULTIPLY : 106,
  ADD : 107,
  SUBTRACT : 109,
  DECIMAL : 110,
  DIVIDE : 111,
  F1 : 112,
  F2 : 113,
  F3 : 114,
  F4 : 115,
  F5 : 116,
  F6 : 117,
  F7 : 118,
  F8 : 119,
  F9 : 120,
  F10 : 121,
  F11 : 122,
  F12 : 123,
  NUM_LOCK: 144,
  SCROLL_LOCK : 145,
  SEMICOLON : 186,
  EQUALS : 187,
  COMMA : 188,
  MINUS : 189,
  PERIOD : 190,
  SLASH : 191,
  BACK_QUOTE : 192,
  BRACELEFT : 219,
  BACK_SLASH : 220,
  BRACERIGHT : 221,
  QUOTE : 222
};




