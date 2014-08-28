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
 * Base class for keyframes in animations. A keyframe is defined by
 * some set of animation properties (an image, vector, color, angle, point, 
 * etc.) and a parameterized value in the range [0, 1] for when the keyframe 
 * occurs during the animation's duration. 
 * @abstract
 * @constructor
 * @param {float} time    Must be in the range [0,1].
 * @param {TentaGL.TimingFunction} timeFunc   Optional. By default, it 
 *      will use the linear timing function for transitions.
 */
TentaGL.Keyframe = function(time, timeFunc) {
  if(timeFunc === undefined) {
    timeFunc = TentaGL.TimingFunction.linear();
  }
  
  this._time = time;
  this._timeFunc = timeFunc;
};

TentaGL.Keyframe.prototype = {
  
  constructor: TentaGL.Keyframe,
  
  /** 
   * Returns the paramterized time value for the keyframe. 
   * @return {float}
   */
  getTime: function() {
    return this._time;
  },
  
  
  /** 
   * Returns the timing function used to compute tweens for the animation's 
   * transition from this frame to the next.
   * @return {TentaGL.TimingFunction}
   */
  getTimingFunction: function() {
    return this._timeFunc;
  }
};

