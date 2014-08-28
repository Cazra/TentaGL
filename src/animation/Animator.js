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
 * An object used to play an animation.
 * @constructor
 * @param {TentaGL.Animation} animation
 */
TentaGL.Animator = function(animation) {
  this._animation = animation;
  this._timer = new TentaGL.Timer();
};

TentaGL.Animator.prototype = {
  
  constructor: TentaGL.Animator,
  
  isaAnimator: true,
  
  
  /** 
   * Starts playing the animation from the beginning. 
   * @param {uint} startOffset    Optional. A starting time offset for the 
   *                              animation. Default 0.
   */
  start: function(startOffset) {
    this._timer.start(startOffset);
  },
  
  
  /** 
   * Pauses the animation. 
   */
  pause: function() {
    if(this._timer.isRunning()) {
      this._timer.pause();
    }
  },
  
  
  /** 
   * Resumes playing the animation.
   */
  resume: function() {
    if(this._timer.isPaused()) {
      this._timer.resume();
    }
  },
  
  
  /** 
   * Setter/getter for the rate of play for the animation. 
   * @param {float} speed   Optional. The rate of play for the animation.
   *      The default speed is 1.
   *      If 0 < speed < 1, then the animation will be slowed down.
   *      If speed > 1, then the animation will be sped up.
   *      If speed = 0, then the animation is stopped.
   *      If speed < 0, then the animation will play in reverse, with -1 
   *      playing it in reverse at normal speed.
   * @return {float}
   */
  speed: function(speed) {
    return this._timer.speed(speed);
  },
  
  
  
  /** 
   * Returns the current value of the animation's properties. 
   * The type of this value depends upon the Animator implementation. 
   * If the animation was paused, then it is resumed.
   * @return {object}
   */
  animate: function() {
    this.resume();
    
    var time = this._timer.timeElapsed();
    var tween = this._animation.getTween(time);
    return this.getTweenValue(tween);
  },
  
  
  
  //////// Abstract methods
  
  
  /** 
   * Returns the interpolated value for a tween. 
   * If the tween's end keyframe is undefined, 
   * return the value of its start keyframe.
   * @param {TentaGL.Tween} tween
   * @return {object}
   */
  getTweenValue: function(tween) {}
  
  
};


