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
 * A Bezier curve of arbitrary degree.
 * @constructor
 * @param {vec2} startPt
 * @param {array: vec2} controlPts
 * @param {vec2} endPt
 */
TentaGL.Math.BezierCurve2D = function(startPt, controlPts, endPt) {
  this._startPt = vec2.copy([], startPt);
  
  this._controlPts = [];
  for(var i=0; i < controlPts.length; i++) {
    this._controlPts[i] = vec2.copy([], controlPts[i]);
  }
  
  this._endPt = vec2.copy([], endPt);
};


TentaGL.Math.BezierCurve2D.prototype = {
  
  constructor: TentaGL.Math.BezierCurve2D,
  
  isaBezierCurve2D: true, 
  
  /** 
   * Setter/getter for the start point of the Bezier curve.
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  start: function(xy) {
    if(xy !== undefined) {
      this._startPt = xy;
    }
    return this._startPt;
  },
  
  
  /** 
   * Setter/getter for the nth control point.
   * @param {uint} n
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  control: function(n, xy) {
    if(n < 0 || n >= this._controlPts.length) {
      throw new Error("Control point index out of bounds.");
    }
    
    if(xy !== undefined) {
      this._controlPts[n] = xy;
    }
    return this._controlPts[n];
  },
  
  
  /** 
   * Returns the degree (number of control points) for the curve. 
   * @return {uint}
   */
  getDegree: function() {
    return this._controlPts.length+1;
  },
  
  
  end: function(xy) {
    if(xy !== undefined) {
      this._endPt = xy;
    }
    return this._endPt;
  },
  
  
  /** 
   * Gets the point interpolated to some parametric value for the curve. 
   * @param {float} alpha
   * @return {vec2}
   */
  interpolate: function(alpha) {
    var pts = [];
    pts.push(this._startPt);
    pts = pts.concat(this._controlPts);
    pts.push(this._endPt);
    return this._interpolate(alpha, pts);
  },
  
  
  /** 
   * Recursively interpolates a point on the curve. 
   */
  _interpolate: function(alpha, points) {
    if(points.length == 1) {
      return points[0];
    }
    else {
      var newPts = [];
      
      for(var i=0; i < points.length - 1; i++) {
        var p1 = points[i];
        var p2 = points[i+1];
        
        var tween = vec2.add([], vec2.scale([], p1, 1-alpha), vec2.scale([], p2, alpha));
        
        newPts.push(tween);
      }
      
      return this._interpolate(alpha, newPts);
    }
  },
  
  
  
  //////// Shape2D implementations
  
  containsPt: function(xy) {
    return undefined;
  },
  
  
  /** 
   * An approximation of the curve's bounding box is constructed from its 
   * start, end, and ctrl points. This box contains all points on the curve
   * since the curve is contained by the convex hull of its control points. 
   * However, this may not be the smallest bounding box.
   * @return {TentaGL.Math.Rect2D}
   */
  getBounds2D: function() {
    var left = Math.min(this._startPt[0], this._endPt[0]);
    var right = Math.max(this._startPt[0], this._endPt[0]);
    var bottom = Math.min(this._startPt[1], this._endPt[1]);
    var top = Math.max(this._startPt[1], this._endPt[1]);
    
    for(var i=0; i<this._controlPts; i++) {
      var ctrlPt = this._controlPts[i];
      
      left = Math.min(left, ctrlPt[0]);
      right = Math.max(right, ctrlPt[0]);
      bottom = Math.min(bottom, ctrlPt[1]);
      top = Math.max(top, ctrlPt[1]);
    }
  },
  
  
  /** 
   * Renders an approximation of the curve from a number of interpolated points. 
   * 
   */
  render: function(gl, materialName, numPts) {
    if(materialName) {
      TentaGL.MaterialLib.use(gl, materialName);
    }
    
    if(numPts === undefined) {
      numPts = this.getDegree()*10;
    }
    if(numPts < 2) {
      numPts = 2;
    }
    
    // Create the interpolated points.
    var pts = [];
    pts.push(this.start());
    var alphaInc = 1/(numPts - 1);
    for(var alpha=alphaInc; alpha < 1; alpha += alphaInc) {
      pts.push(this.interpolate(alpha));
    }
    pts.push(this.end());
    
    // Use the points to render a series of lines.
    for(var i=0; i < pts.length - 1; i++ ) {
      (new TentaGL.Math.Line2D(pts[i], pts[i+1])).render(gl);
    }
  }
  
};


Util.Inheritance.inherit(TentaGL.Math.BezierCurve2D, TentaGL.Math.Shape2D);
