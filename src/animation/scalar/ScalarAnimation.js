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
 * An animation of some scalar property.
 * @constructor
 * @param {array: TentaGL.ScalarKeyframe} keyframes
 * @param {uint} duration       In milliseconds.
 * @param {boolean} loop        Optional. Default true.
 * @param {uint} loopStart      Optional. The starting time offset for the loop.
 *      When the animation finishes a loop, it goes back to this time offset.
 *      Default 0.
 */
TentaGL.ScalarAnimation = function(keyframes, duration, loop, loopStart) {
  for(var i=0; i<keyframes.length; i++) {
    if(!keyframes[i].isaScalarKeyframe) {
      throw new Error("Invalid Keyframe type.");
    }
  }
  TentaGL.Animation.call(this, keyframes.slice(0), duration, loop, loopStart);
};

TentaGL.ScalarAnimation.prototype = {
  
  constructor: TentaGL.ScalarAnimation,
  
  isaScalarAnimation: true,
  
  //////// Animation implementation
  
  getAnimator: function() {
    return new TentaGL.ScalarAnimator(this);
  }
};

Util.Inheritance.inherit(TentaGL.ScalarAnimation, TentaGL.Animation);
