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
 * A keyframe with some non-continuous property value, 
 * e.g. an enumeration, string, or boolean value.
 * @constructor
 * @param {object} value
 * @param {float} time    Must be in the range [0,1].
 */
TentaGL.DiscreteKeyframe = function(value, time) {
  TentaGL.Keyframe.call(this, time);
  this._value = value;
};

TentaGL.DiscreteKeyframe.prototype = {
  
  constructor: TentaGL.DiscreteKeyframe,
  
  isaDiscreteKeyframe: true,
  
  /** 
   * Returns the scalar value of the keyframe. 
   * @return {number}
   */
  getValue: function() {
    return this._value;
  }
};


Util.Inheritance.inherit(TentaGL.DiscreteKeyframe, TentaGL.Keyframe);

