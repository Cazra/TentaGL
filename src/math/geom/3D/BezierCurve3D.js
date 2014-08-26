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
 * A 3D Bezier curve of arbitrary degree.
 * @constructor
 * @param {vec3} startPt
 * @param {array: vec3} controlPts
 * @param {vec3} endPt
 */
TentaGL.Math.BezierCurve3D = function(startPt, controlPts, endPt) {
  this._startPt = vec3.copy([], startPt);
  
  this._controlPts = [];
  for(var i=0; i < controlPts.length; i++) {
    this._controlPts[i] = vec3.copy([], controlPts[i]);
  }
  
  this._endPt = vec3.copy([], endPt);
};



TentaGL.Math.BezierCurve3D.prototype = {
  
  constructor: TentaGL.Math.BezierCurve3D,
  
  isaBezierCurve3D: true, 
  
  
  /** 
   * Setter/getter for the start point of the Bezier curve.
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  start: function(xyz) {
    if(xyz !== undefined) {
      this._startPt = xyz;
    }
    return this._startPt;
  },
  
  
  /** 
   * Setter/getter for the nth control point.
   * @param {uint} n
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  control: function(n, xyz) {
    if(n < 0 || n >= this._controlPts.length) {
      throw new Error("Control point index out of bounds.");
    }
    
    if(xyz !== undefined) {
      this._controlPts[n] = xyz;
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
   * @param {vec3} xyz   Optional.
   * @return {vec3}
   */
  end: function(xyz) {
    if(xyz !== undefined) {
      this._endPt = xyz;
    }
    return this._endPt;
  },
  
  
  
  /** 
   * Gets the point interpolated to some parametric value for the curve. 
   * @param {float} alpha
   * @return {vec3}
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
        
        var tween = vec3.add([], vec3.scale([], p1, 1-alpha), vec3.scale([], p2, alpha));
        
        newPts.push(tween);
      }
      
      return this._interpolate(alpha, newPts);
    }
  },
  
  
  /** 
   * Returns the alpha value of the closest point on this curve to some point, 
   * using numerical methods. 
   * @param {vec3} xyz
   * @param {float} tolerance   Optional. Default 0.0001.
   * @return {float}
   */
  closestAlpha: function(xyz, tolerance) {
    if(tolerance === undefined) {
      tolerance = 0.001;
    }
    
    var numPts = this.getDegree()*10;
    var pts = this._approxPts(numPts);
    
    var distStart = vec3.dist(pts[0], xyz);
    var distEnd = vec3.dist(pts[pts.length-1], xyz);
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
      
      var prevDist = vec3.dist(prev, xyz);
      var curDist = vec3.dist(cur, xyz);
      var nextDist = vec3.dist(next, xyz);
      
      if(curDist == Math.min(prevDist, curDist, nextDist)) {
        var curAlpha = i/(pts.length-1);
        var result;
        
        if(prevDist < nextDist) {
          var prevAlpha = (i-1)/(pts.length-1);
          result = this._closestAlphaRec(xyz, tolerance, [prevAlpha, curAlpha], [prev, cur], curDist);
        }
        else {
          var nextAlpha = (i+1)/(pts.length-1);
          result = this._closestAlphaRec(xyz, tolerance, [curAlpha, nextAlpha], [cur, next], curDist);
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
  _closestAlphaRec: function(xyz, tolerance, alphas, pts, lastDist) {
    var prevAlpha = alphas[0];
    var curAlpha = (alphas[0] + alphas[1])/2;
    var nextAlpha = alphas[1];
    
    var prev = pts[0];
    var cur = this.interpolate(curAlpha);
    var next = pts[1];
    
    var dist = vec3.dist(cur, xyz);
    var distPrev = vec3.dist(prev, xyz);
    var distNext = vec3.dist(next, xyz);
    
    if(Math.abs(dist - lastDist) <= tolerance) {
      return [curAlpha, dist];
    }
    else if(distPrev < distNext) {
      return this._closestAlphaRec(xyz, tolerance, [prevAlpha, curAlpha], [prev, cur], dist);
    }
    else {
      return this._closestAlphaRec(xyz, tolerance, [curAlpha, nextAlpha], [cur, next], dist);
    }
  },
  
  
  /** 
   * Returns the point on this curve closest to the given point, 
   * using numerical methods.
   * @param {vec3} xyz
   * @param {float} tolerance   Optional. Default 0.0001.
   * @return {vec3}
   */
  closestPt: function(xyz, tolerance) {
    var alpha = this.closestAlpha(xyz, tolerance);
    return this.interpolate(alpha);
  },
  
  
  /** 
   * Approximates the distance of a point to this curve, 
   * using numerical methods.
   * @param {vec3} xyz
   * @param {float} tolerance   Optional. Default 0.0001.
   * @return {number}
   */
  distToPt: function(xyz, tolerance) {
    var pt = this.closestPt(xyz, tolerance);
    return vec3.dist(pt, xyz);
  },
  
  
  
  /**  
   * Returns an approximation of the curve consisting of n points.
   * @param {uint} n
   * @return {array: vec3}
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
  
  
  //////// Shape3D implementations
  
  /** 
   * Returns whether the curve contains some point within a given 
   * tolerance for distance. 
   * @param {vec3} xyz
   * @param {float} tolerance   Optional. Default 0.0001.
   */
  containsPt: function(xyz, tolerance) {
    if(tolerance === undefined) {
      tolerance = 0.0001;
    }
    return (this.distToPt(xyz, tolerance) <= tolerance);
  },
  
  
  /** 
   * An approximation of the curve's bounding box is constructed from its 
   * start, end, and ctrl points. This box contains all points on the curve
   * since the curve is contained by the convex hull of its control points. 
   * However, this may not be the smallest bounding box.
   * @return {TentaGL.Math.Rect3D}
   */
  getBounds3D: function() {
    var left = Math.min(this._startPt[0], this._endPt[0]);
    var right = Math.max(this._startPt[0], this._endPt[0]);
    var bottom = Math.min(this._startPt[1], this._endPt[1]);
    var top = Math.max(this._startPt[1], this._endPt[1]);
    var back = Math.min(this._startPt[2], this._endPt[2]);
    var front = Math.max(this._startPt[2], this._endPt[2]);
    
    for(var i=0; i<this._controlPts; i++) {
      var ctrlPt = this._controlPts[i];
      
      left = Math.min(left, ctrlPt[0]);
      right = Math.max(right, ctrlPt[0]);
      bottom = Math.min(bottom, ctrlPt[1]);
      top = Math.max(top, ctrlPt[1]);
      back = Math.min(back, ctrlPt[2]);
      front = Math.max(front, ctrlPt[2]);
      
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
      (new TentaGL.Math.Line3D(pts[i], pts[i+1])).render(gl);
    }
  }
};


Util.Inheritance.inherit(TentaGL.Math.BezierCurve3D, TentaGL.Math.Shape3D);

