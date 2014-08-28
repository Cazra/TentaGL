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
 * The base class for Animators, used to play animations.
 * @abstract
 * @constructor
 * @param {TentaGL.Animation} animation
 */
TentaGL.Animator = function(animation) {
  this._animation = animation;
  this._ellapsed = 0;
  
  this.
};

TentaGL.Animator.prototype = {
  
  constructor: TentaGL.Animator,
  
  isaAnimator: true,
  
  
  /** 
   * Starts playing the animation. 
   * @param {uint} startOffset    Optional. A starting time offset for the 
   *                              animation. Default 0.
   */
  start: function(startOffset) {
    if(startOffset === undefined) {
      startOffset = 0;
    }
    this._startTime = startOffset;
  },
  
  
  /** 
   * Advances the animation. 
   * @param {float} speed   Optional. The rate of play for the animation.
   *      The default speed is 1.
   *      If 0 < speed < 1, then the animation will be slowed down.
   *      If speed > 1, then the animation will be sped up.
   *      If speed = 0, then the animation is stopped.
   *      If speed < 0, then the animation will play in reverse, with -1 
   *      playing it in reverse at normal speed.
   * @return {TentaGL.Tween}
   */
  animate: function(speed) {
    
  };
};


