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
 * occurs during the animation's duration. A type of interpolation for tweens 
 * from between this frame to the next can also be defined. 
 * @abstract
 * @constructor
 * @param {float} time    Must be in the range [0,1].
 * @param {TentaGL.Math.Interpolation} interpolation   Optional. By default, there is no interpolation.
 */
TentaGL.Keyframe = function(time, interpolation) {
  if(interpolation === undefined) {
    interpolation = TentaGL.Math.Interpolation.none();
  }
  
  this._time = time;
  this._interpolation = interpolation;
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
   * Returns the type of interpolation used for tweens from this frame to the 
   * next. 
   * @return {enum: TentaGL.Tween}
   */
  getInterpolation: function() {
    return this._interpolation;
  }
};

