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
 * A timer that must be manually updated each frame.
 * @constructor
 * @param {uint} frameRate    Optional. The frames per second rate for the timer.
 *                            Default 60.
 * @param {uint} startTime    Optional. The start timestamp. If provided, the  *                            timer begins in a running state.
 */
TentaGL.FrameTimer = function(frameRate, startTime) {
  TentaGL.Timer.call(this, startTime);
  this._frameRate = frameRate;
  this._millis = 0;
};

TentaGL.FrameTimer.prototype = {
  
  constructor: TentaGL.FrameTimer,
  
  isaFrameTimer: true,
  
  
  getTime: function() {
    return this._millis;
  },
  
  
  /** 
   * Counts one frame for this timer, converting the frame to milliseconds 
   * based on the timer's frame rate. 
   */
  tick: function() {
    this._millis += 1/this._frameRate;
  }
  
};


Util.Inheritance.inherit(TentaGL.FrameTimer, TentaGL.Timer);