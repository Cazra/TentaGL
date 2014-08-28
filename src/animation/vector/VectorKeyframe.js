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
 * A keyframe with a vector of arbitrary dimension.
 * @param {array: number} vector
 * @param {float} time    Must be in the range [0,1].
 * @param {TentaGL.TimingFunction} timeFunc   Optional. By default, it 
 *      will use the linear timing function for transitions.
 */
TentaGL.VectorKeyframe = function(vector, time, timeFunc) {
  TentaGL.Keyframe.call(this, time, timeFunc);
  this._vector = vector.slice(0);
};


TentaGL.VectorKeyframe.prototype = {
  
  cosntructor: TentaGL.VectorKeyframe,
  
  isaVectorKeyframe: true,
  
  
  /** 
   * Returns the keyframe's vector as a 2D vector 
   * (Components past the first 2 are dropped).
   * @return {vec2}
   */
  getVec2: function() {
    return this._vector.slice(0,2);
  },
  
  
  /** 
   * Returns the keyframe's vector as a 3D vector 
   * (Components past the first 3 are dropped).
   * @return {vec3}
   */
  getVec3: function() {
    return this._vector.slice(0,3);
  },
  
  
  /** 
   * Returns the keyframe's vector as a 4D vector 
   * (Components past the first 4 are dropped).
   * @return {vec4}
   */
  getVec4: function() {
    return this._vector.slice(0,4);
  },
  
  
  //////// Keyframe implementation
  
  /** 
   * Returns the vector for this keyframe.
   * @return {array: number}
   */
  getValue: function() {
    return this._vector.slice(0);
  }

};

Util.Inheritance.inherit(TentaGL.VectorKeyframe, TentaGL.Keyframe);

