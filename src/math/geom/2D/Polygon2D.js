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
 * A 2D polygon. 
 * @param {array: vec2}
 */
TentaGL.Math.Polygon2D = function(pts) {
  this._pts = pts.slice(0);
  
  // TODO: Create triangulation.
};


TentaGL.Math.Polygon2D.prototype = {
  
  constructor: TentaGL.Math.Polygon2D, 
  
  isaPolygon2D: true,
  
  
  /** 
   * Setter/getter for the nth point in the polygon. 
   * @param {uint} n
   * @param {vec2} pt   Optional.
   * @return {vec2}
   */
  point: function(n, pt) {
    if(n < 0 || n >= this._pts.length) {
      throw new Error("Index out of bounds.");
    }
    
    if(pt !== undefined) {
      this._pts[n] = pt;
    }
    return this._pts[n];
  },
  
  
  /** 
   * Returns a list of the polygon's points. 
   * @return {array: vec2}
   */
  getPoints: function() {
    return this._pts.slice(0);
  },
  
  
  /** 
   * Returns the number of points in this polygon. 
   * @return {uint}
   */
  pointCount: function() {
    return this._pts.length;
  },
  
  
  _index: function(n) {
    return Math.wrap(n, 0, this._pts.length-1);
  },
  
  
  /** 
   * Returns whether point n is convex.
   * @param {uint} n
   * @return {boolean}
   */
  ptIsConvex: function(n) {
    // TODO
  }
  
  
  
  
  
};

