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
 * An animator for ScalarAnimations. 
 * @constructor
 * @param {TentaGL.ScalarAnimation} animation
 */
TentaGL.ScalarAnimator = function(animation) {
  if(!animation.isaScalarAnimation) {
    throw new Error("Invalid Animation type.");
  }
  TentaGL.Animator.call(this, animation);
};


TentaGL.ScalarAnimator.prototype = {
  
  constructor: TentaGL.ScalarAnimator,
  
  isaScalarAnimator: true, 
  
  
  //////// Animator implementations
  
  /** 
   * Returns the tweened scalar value.
   * @param {TentaGL.Tween}
   * @return {number}
   */
  getTweenValue: function(tween) {
    if(tween.getEndFrame()) {
      var start = tween.getStartFrame().getValue();
      var end = tween.getEndFrame().getValue();
      var alpha = tween.getAlpha();
      
      return TentaGL.Math.mix(start, end, alpha);
    }
    else {
      return tween.getStartFrame().getValue();
    }
  }
};


Util.Inheritance.inherit(TentaGL.ScalarAnimator, TentaGL.Animator);

