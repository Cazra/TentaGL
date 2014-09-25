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
 * Interface for a 2D shape.
 */
TentaGL.Math.Shape2D = function() {};

TentaGL.Math.Shape2D.prototype = {
  
  constructor: TentaGL.Math.Shape2D,
  
  isaShape2D: true,
  
  /** 
   * Returns true iff the specified point is contained within this shape.
   * @param {vec2} pt
   * @param {float} tolerance   Optional.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {},
  
  /** 
   * Returns the smallest rectangle containing the shape. 
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {}
};

Util.Inheritance.inherit(TentaGL.Math.Shape2D, TentaGL.Math.Shape);

