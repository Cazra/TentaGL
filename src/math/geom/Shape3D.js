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
 * Interface for a 3D shape. 
 */
TentaGL.Math.Shape3D = function() {};

TentaGL.Math.Shape3D.prototype = {
  
  constructor: TentaGL.Math.Shape3D,
  
  isaShape3D: true,
  
  /** 
   * Returns true iff this shape contains the specified point, within some tolerance. 
   * @param {vec3} pt
   * @param {float} tolerance   Optional.
   * @return {boolean}
   */
  containsPt: function(pt, tolerance) {},
  
  /** 
   * Returns the smallest 3D box completely containing this shape.
   * @return {TentaGL.Math.Rect3D}
   */
  getBounds3D: function() {}
};

Util.Inheritance.inherit(TentaGL.Math.Shape3D, TentaGL.Math.Shape);
