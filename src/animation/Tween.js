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
 * An interpolation between two keyframes in an animation.
 * @constructor
 * @param {TentaGL.Keyframe} startFrame
 * @param {TentaGL.Keyframe} endFrame
 * @param {float} alpha         Must be in range [0,1].
 */
TentaGL.Tween = function(startFrame, endFrame, alpha) {
  this._start = startFrame;
  this._end = endFrame;
  this._alpha = alpha;
};


TentaGL.Tween.prototype = {
  
  constructor: TentaGL.Tween,
  
  isaTween: true,
  
  
  /** 
   * Returns the start keyframe.
   * @return {TentaGL.Keyframe}
   */
  getStartFrame: function() {
    return this._start;
  },
  
  
  /** 
   * Returns the end keyframe.
   * @return {TentaGL.Keyframe}
   */
  getEndFrame: function() {
    return  this._end;
  },
  
  
  /** 
   * Returns the parameterized value for transitioning between the frames.
   * @return {float}
   */
  getAlpha: function() {;
    return this._alpha;
  }
  
  
};

