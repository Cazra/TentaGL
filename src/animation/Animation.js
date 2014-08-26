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
 * An object describing an animation of 2D images bound by some 
 * time interval, [0, t).
 * @constructor
 * @param {array: TentaGL.Keyframe} keyframes
 * @param {uint} duration        In milliseconds.
 * @param {boolean} loop     Optional. Default true.
 */
TentaGL.Animation = function(keyframes, duration, loop) {
  if(loop === undefined) {
    loop = true;
  }
  
  this._keyframes = keyframes.slice(0);
  this._duration = duration;
  this._loop = loop;
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
   * Returns a list of the animation's keyframes. 
   * @return {array: TentaGL.Keyframe}
   */
  getKeyframes: function() {
    return this._keyframes.slice(0);
  }
  
};

