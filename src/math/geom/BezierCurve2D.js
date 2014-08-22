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
  
  
  /** 
   * Setter/getter for the end point of the curve. 
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
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
  
  
  /** 
   * Returns the alpha value of the closest point on this curve to some point, 
   * using numerical methods. 
   * @param {vec2} xy
   * @param {float} tolerance   Optional. Default 0.0001.
   * @return {float}
   */
  closestAlpha: function(xy, tolerance) {
    if(tolerance === undefined) {
      tolerance = 0.001;
    }
    
    var numPts = this.getDegree()*10;
    var pts = this._approxPts(numPts);
    
    var distStart = vec2.dist(pts[0], xy);
    var distEnd = vec2.dist(pts[pts.length-1], xy);
    var nearestDist = Math.min(distStart, distEnd);
    
    var nearestAlpha;
    if(nearestDist == distStart) {
      nearestAlpha = 0;
    }
    else {
      nearestAlpha = 1;
    }
    
    for(var i=1; i<pts.length-1; i++) {
      var prev = pts[i-1];
      var cur = pts[i];
      var next = pts[i+1];
      
      var prevDist = vec2.dist(prev, xy);
      var curDist = vec2.dist(cur, xy);
      var nextDist = vec2.dist(next, xy);
      
      if(curDist == Math.min(prevDist, curDist, nextDist)) {
        var curAlpha = i/(pts.length-1);
        var result;
        
        if(prevDist < nextDist) {
          var prevAlpha = (i-1)/(pts.length-1);
          result = this._closestAlphaRec(xy, tolerance, [prevAlpha, curAlpha], [prev, cur], curDist);
        }
        else {
          var nextAlpha = (i+1)/(pts.length-1);
          result = this._closestAlphaRec(xy, tolerance, [curAlpha, nextAlpha], [cur, next], curDist);
        }
        
        if(result[1] < nearestDist) {
          nearestDist = result[1];
          nearestAlpha = result[0];
        }
      }
    }
    
    return nearestAlpha;
  },
  
  
  /** 
   * Recursively approach the closest point between two alpha values 
   * using shooting method. 
   */
  _closestAlphaRec: function(xy, tolerance, alphas, pts, lastDist) {
    var prevAlpha = alphas[0];
    var curAlpha = (alphas[0] + alphas[1])/2;
    var nextAlpha = alphas[1];
    
    var prev = pts[0];
    var cur = this.interpolate(curAlpha);
    var next = pts[1];
    
    var dist = vec2.dist(cur, xy);
    var distPrev = vec2.dist(prev, xy);
    var distNext = vec2.dist(next, xy);
    
    if(Math.abs(dist - lastDist) <= tolerance) {
      return [curAlpha, dist];
    }
    else if(distPrev < distNext) {
      return this._closestAlphaRec(xy, tolerance, [prevAlpha, curAlpha], [prev, cur], dist);
    }
    else {
      return this._closestAlphaRec(xy, tolerance, [curAlpha, nextAlpha], [cur, next], dist);
    }
  },
  
  
  /** 
   * Returns the point on this curve closest to the given point, 
   * using numerical methods.
   * @param {vec2} xy
   * @param {float} tolerance   Optional. Default 0.0001.
   * @return {vec2}
   */
  closestPt: function(xy, tolerance) {
    var alpha = this.closestAlpha(xy, tolerance);
    return this.interpolate(alpha);
  },
  
  
  /** 
   * Approximates the distance of a point to this curve, 
   * using numerical methods.
   * @param {vec2} xy
   * @param {float} tolerance   Optional. Default 0.0001.
   * @return {number}
   */
  distToPt: function(xy, tolerance) {
    var pt = this.closestPt(xy, tolerance);
    return vec2.dist(pt, xy);
  },
  
  
  
  /**  
   * Returns an approximation of the curve consisting of n points.
   * @param {uint} n
   * @return {array: vec2}
   */
  _approxPts: function(n) {
    var pts = [];
    pts.push(this.start());
    var alphaInc = 1/(n - 1);
    for(var alpha=alphaInc; alpha < 1; alpha += alphaInc) {
      pts.push(this.interpolate(alpha));
    }
    pts.push(this.end());
    
    return pts;
  },
  
  
  //////// Shape2D implementations
  
  /** 
   * Returns whether the curve contains some point within a given 
   * tolerance for distance. 
   * @param {vec2} xy
   * @param {float} tolerance   Optional. Default 0.0001.
   */
  containsPt: function(xy, tolerance) {
    if(tolerance === undefined) {
      tolerance = 0.0001;
    }
    return (this.distToPt(xy, tolerance) <= tolerance);
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
    var pts = this._approxPts(numPts);
    
    // Use the points to render a series of lines.
    for(var i=0; i < pts.length - 1; i++ ) {
      (new TentaGL.Math.Line2D(pts[i], pts[i+1])).render(gl);
    }
  }
  
};


Util.Inheritance.inherit(TentaGL.Math.BezierCurve2D, TentaGL.Math.Shape2D);
