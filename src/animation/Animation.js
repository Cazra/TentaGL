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
 * A base class for animations defined by an ordered list of keyframes and 
 * a time duration. 
 * @abstract
 * @constructor
 * @param {array: TentaGL.Keyframe} keyframes
 * @param {uint} duration       In milliseconds.
 * @param {boolean} loop        Optional. Default true.
 * @param {uint} loopStart      Optional. The starting time offset for the loop.
 *      When the animation finishes a loop, it goes back to this time offset.
 *      Default 0.
 */
TentaGL.Animation = function(keyframes, duration, loop, loopStart) {
  if(loop === undefined) {
    loop = true;
  }
  if(loopStart === undefined) {
    loopStart = 0;
  }
  
  this._keyframes = keyframes.slice(0);
  this._duration = duration;
  this._loop = loop;
  this._loopStart = loopStart;
};


TentaGL.Animation.prototype = {
  
  constructor: TentaGL.Animation,
  
  isaAnimation: true,
  
  /** 
   * Setter/getter for the animation's duration, in milliseconds.
   * @param {uint} duration   Optional.
   * @return {uint}
   */
  duration: function(duration) {
    if(duration !== undefined) {
      this._duration = duration;
    }
    return this._duration;
  },
  
  
  
  /** 
   * Setter/getter for whether the animation loops. 
   * @param {boolean} loop    Optional.
   * @return {boolean}
   */
  loop: function(loop) {
    if(loop !== undefined) {
      this._loop = loop;
    }
    return this._loop;
  },
  
  
  /** 
   * Setter/getter for the animation's loop start offset. When the animation
   * finishes a loop, it will go back to this time offset instead of back to 
   * the beginning. 
   * @param {uint} offset     Optional.
   * @return {uint}
   */
  loopStart: function(offset) {
    if(offset !== undefined) {
      this._loopStart = offset;
    }
    return this._loopStart;
  },
  
  
  /** 
   * Returns the nth keyframe in this animation. 
   * @param {uint} n
   * @return {TentaGL.Keyframe}
   */
  getKeyframe: function(n) {
    if(n < 0 || n >= this._keyframes.length) {
      throw new Error("Index out of bounds.");
    }
    return this._keyframes[n];
  },
  
  
  /** 
   * Returns a list of the animation's keyframes. 
   * @return {array: TentaGL.Keyframe}
   */
  getKeyframes: function() {
    return this._keyframes.slice(0);
  },
  
  
  
  /** 
   * Returns the tween defining an interpolation between two keyframes for
   * some point of time since the start of the animation.
   * @param {uint} time     Time ellapsed since the animation started.
   * @return {TentaGL.Tween} 
   */
  getTween: function(time) {
    time = time/this._duration;
    
    var start = this._keyframes[0];
    var end = this._keyframes[1];
    
    for(var i=1; i<this._keyframes.length; i++) {
      var curFrame = this._keyframes[i];
      if(time >= curFrame.getTime()) {
        start = curFrame;
        end = this._keyframes[i+1];
      }
    }
    
    var alpha;
    if(end ==== undefined) {
      alpha = 0;
    }
    else {
      alpha = (time - start.getTime())/(end.getTime() - startTime());
      alpha = start.getTimingFunction().ease(alpha);
    }
    
    return new TentaGL.Tween(start, end, alpha);
  },
  
  
  //////// abstract methods
  
  
  /** 
   * Returns an animator instance that can be used to play this animation. 
   * @param {uint} startOffset    Optional. A starting time offset for playing 
   *                              the animation. Default 0.
   * @return {TentaGL.Animator}
   */
  getAnimator: function(startOffset) {};
  
};

