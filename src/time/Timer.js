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
 * A timer, with capabilities for stopwatch and countdown modes. 
 * @constructor
 * @param {uint} startTime    Optional. The start timestamp. 
 *      If provided, the timer begins in a running state.
 */
TentaGL.Timer = function(startTime) {
  this._startTime = startTime;
  this._accumulated = 0;
  this._countdown = undefined;
  
  if(startTime !== undefined) {
    this._state = TentaGL.Timer.RUNNING;
  }
  else {
    this._state = TentaGL.Timer.STOPPED;
  }
};

TentaGL.Timer.STOPPED = 1;
TentaGL.Timer.RUNNING = 2;
TentaGL.Timer.PAUSED = 3;

TentaGL.Timer.millisToHHmmssS = function(millis) {
  var tenths = Math.floor(millis/100);
  var seconds = Math.floor(millis/1000);
  var minutes = Math.floor(seconds/60);
  var hours = Math.floor(minutes/60);
  
  var tenthsStr = "" + (tenths % 10);
  
  var secondsStr = "" + (seconds % 60);
  if(secondsStr.length < 2) {
    secondsStr = "0" + secondsStr;
  }
  
  var minutesStr = "" + (minutes % 60);
  if(minutesStr.length < 2) {
    minutesStr = "0" + minutesStr;
  }
  
  
  var result = "";
  if(hours >= 1) {
    result += hours + ":";
  }
  if(minutes >= 1) {
    result += minutesStr + ":";
  }
  result += secondsStr + "." + tenthsStr;
  
  return result;
};

TentaGL.Timer.prototype = {
  
  constructor: TentaGL.Timer,
  
  isaTimer: true,
  
  
  //////// State
  
  /** 
   * Returns true iff the timer is in a running state. 
   * @return {boolean}
   */
  isRunning: function() {
    return (this._state == TentaGL.Timer.RUNNING);
  },
  
  /** 
   * Returns true iff the timer is in a paused state.
   * @return {boolean}
   */
  isPaused: function() {
    return (this._state == TentaGL.Timer.PAUSED);
  },
  
  /** 
   * Returns true iff the timer is in a stopped state.
   */
  isStopped: function() {
    return (this._state == TentaGL.Timer.STOPPED);
  },
  
  
  //////// Basic timer functions
  
  
  /** 
   * Resets and starts the timer. The timestamp for the start time is returned.
   * @return {uint}
   */
  start: function() {
    this._startTime = Date.now();
    this._accumulated = 0;
    
    this._state = TentaGL.Timer.RUNNING;
    
    return this._startTime;
  },
  
  
  /** 
   * Pauses the timer, allowing it to be resumed later.
   */
  pause: function() {
    if(this._state == TentaGL.Timer.RUNNING) {
      var curTime = Date.now();
      this._accumulated += curTime - this._startTime;
      
      this._state = TentaGL.Timer.PAUSED;
    }
    else {
      throw new Error("Cannot pause a Timer that isn't running.");
    }
  },
  
  /** 
   * Resumes the timer from a paused state.
   */
  resume: function() {
    if(this._state == TentaGL.Timer.PAUSED) {
      this._startTime = Date.now();
      this._state = TentaGL.Timer.RUNNING;
    }
    else {
      throw new Error("Cannot resume a Timer not in a paused state.");
    }
  },
  
  /** 
   * Stops the timer. It cannot be resumed after it is stopped.
   */
  stop: function() {
    var curTime = Date.now();
    this._accumulated += curTime - this._startTime;
    
    this._state = TentaGL.Timer.STOPPED;
    
  },
  
  
  ////// Stopwatch
  
  
  /** 
   * Returns the amount of time that has elapsed, in milliseconds.
   * @return {uint}   
   */
  timeElapsed: function() {
    var result = this._accumulated;
    if(this._state == TentaGL.Timer.RUNNING) {
      var curTime = Date.now();
      result += curTime - this._startTime;
    }
    return result;
  },
  
  
  /** 
   * Returns the current time elapsed in the format "HH:mm:ss.S".
   * @return {string}
   */
  timeElapsedHHmmssS: function() {
    return TentaGL.Timer.millisToHHmmssS(this.timeElapsed());
  },
  
  
  ////// Countdown
  
  
  /** 
   * Sets the starting countdown value, in milliseconds. 
   * Time elapsed in compared to this value to determine time remaining.
   * @param {uint} end
   */
  setCountdown: function(start) {
    this._countdown = start;
  },
  
  /** 
   * Returns the time remaining for the countdown, in milliseconds.
   * @return {uint}
   */
  timeLeft: function() {
    var result = this._countdown - this.timeElapsed();
    result = Math.max(0, result);
    return result;
  },
  
  
  timeLeftHHmmssS: function() {
    return TentaGL.Timer.millisToHHmmssS(this.timeLeft());
  }
  
};
