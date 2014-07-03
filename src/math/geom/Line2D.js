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
 * A finite line in 2D space.
 * @param {vec3} p1
 * @param {vec3} p2
 */
TentaGL.Math.Line2D = function(p1, p2) {
  this._p1 = vec3.clone(p1);
  this._p2 = vec3.clone(p2);
  this._length = vec3.dist(p1, p2);
};

TentaGL.Math.Line2D.prototype = {
  
  constructor: TentaGL.Math.Line2D,
  
  isaLine2D: true,
  
  
  /** 
   * Returns the first point of the line. 
   * @return {vec3}
   */
  getPt1: function() {
    return this._p1;
  },
  
  
  /** 
   * Returns the second point of the line.
   * @return {vec3}
   */
  getPt2: function() {
    return this._p2;
  },
  
  
  /** 
   * Returns the length of this line. 
   */
  getLength: function() {
    return this._length;
  },
  
  
};


