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
 * Base class for objects defining interpolations between two scalar values. 
 * These function very much like timing functions in CSS.
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function
 * @abstract
 */
TentaGL.TimingFunction = function() {};

TentaGL.TimingFunction.prototype = {
  
  constructor: TentaGL.TimingFunction, 
  
  isaTimingFunction: true,
  
  //////// Abstract methods
  
  /** 
   * The easing function, which returns a parameterized value defining how 
   * the transition between the start and end values accelerates as a 
   * function of time.
   * @param {float} time    The parameterized time value, 
   *                        typically in the range [0,1].
   * @return {float}
   */
  ease: function(time) {}
};



//////// Factory methods: Stepped interpolations

/** 
 * Returns an interpolation that abruptly goes from 
 * start to end when time >= 1. 
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.floor = function() {
  if(TentaGL.TimingFunction._floor === undefined) {
    var func = TentaGL.TimingFunction._floor = new TentaGL.TimingFunction();
    
    func.ease = function(time) {
      return Math.floor(time);
    };
  }
  return TentaGL.TimingFunction._floor;
};


/** 
 * Returns a stepped floor interpolation.
 * @param {uint} numSteps   The number of steps in the interpolation.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.steppedFloor = function(numSteps) {
  var inc = 1/numSteps;
  
  var func = new TentaGL.TimingFunction();
  func.ease = function(time) {
    return inc * Math.floor(time/inc);
  };
  
  return func;
};



/** 
 * Returns an interpolation that abruptly goes from 
 * start to end when time > 0. 
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.ceil = function() {
  if(TentaGL.TimingFunction._ceil === undefined) {
    var func = TentaGL.TimingFunction._ceil = new TentaGL.TimingFunction();
    
    func.ease = function(time) {
      return Math.ceil(time);
    };
  }
  return TentaGL.TimingFunction._ceil;
};


/** 
 * Returns a stepped ceiling interpolation.
 * @param {uint} numSteps   The number of steps in the interpolation.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.steppedCeil = function(numSteps) {
  var inc = 1/numSteps;
  
  var func = new TentaGL.TimingFunction();
  func.ease = function(time) {
    return inc * Math.ceil(time/inc);
  };
  
  return func;
};




//////// Factory methods: Continuous interpolations

/** 
 * Returns a linear interpolation.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.linear = function() {
  if(TentaGL.TimingFunction._linear === undefined) {
    var func = TentaGL.TimingFunction._linear = new TentaGL.TimingFunction();
    
    func.ease = function(time) {
      return time;
    };
  }
  return TentaGL.TimingFunction._linear;
};


/** 
 * Returns an interpolation between two values defined by a cubic bezier curve  
 * in their interpolation space. Coordinates for the control points must be
 * within the range [0,1]. 
 * @param {vec2} ctrlPt1    The first control point.
 * @param {vec2} ctrlPt2    The second control point.
 * @param {float} tol       Optional. Tolerance for approximating the mapping 
 *                          of time to its cubic bezier parametric value.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.cubicBezier = function(ctrlPt1, ctrlPt2, tol) {
  if(ctrlPt1[0] < 0 || ctrlPt1[0] > 1 || ctrlPt1[1] < 0 || ctrlPt1[1] > 1 ||
     ctrlPt2[0] < 0 || ctrlPt2[0] > 1 || ctrlPt2[1] < 0 || ctrlPt2[1] > 1) {
    throw new Error("Invalid control points.");
  }
  
  if(tol === undefined) {
    tol = 0.001;
  }
  
  var bezier = new TentaGL.Math.BezierCurve2D([0,0], [ctrlPt1, ctrlPt2], [1,1]);
  
  var func = new TentaGL.TimingFunction();
  func.ease = function(time) {
    var alpha;
    if(time <= 0) {
      alpha = 0;
    }
    else if(time >= 1) {
      alpha = 1;
    }
    else {
      alpha = TentaGL.TimingFunction._bezierFindAlpha(bezier, time, 0, 1, tol);
    }
    
    return bezier.interpolate(alpha)[1];
  };
  
  return func;
};


/** Attempts to find alpha for some Bezier curve, given x. */
TentaGL.TimingFunction._bezierFindAlpha = function(bezier, x, min, max, tol) {
  var alpha = (min+max)/2;
  intX = bezier.interpolate(alpha)[0];
  
  if(Math.abs(intX - x) <= tol) {
    return alpha;
  }
  else if( max - min < tol) {
    return undefined;
  }
  else if(intX > x) {
    return TentaGL.TimingFunction._bezierFindAlpha(bezier, x, min, alpha, tol);
  }
  else {
    return TentaGL.TimingFunction._bezierFindAlpha(bezier, x, alpha, max, tol);
  }
};


/** 
 * Returns an interpolation similar to easeInOut, except it accelerates more 
 * sharply at the beginning and starts slowing down near the middle.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.ease = function() {
  if(TentaGL.TimingFunction._ease === undefined) {
    TentaGL.TimingFunction._ease = TentaGL.TimingFunction.cubicBezier([0.25, 0.1], [0.25, 1.0]);
  }
  return TentaGL.TimingFunction._ease;
};

/** 
 * Returns an interpolation that starts slowly and accelerates towards the end.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.easeIn = function() {
  if(TentaGL.TimingFunction._easeIn === undefined) {
    TentaGL.TimingFunction._easeIn = TentaGL.TimingFunction.cubicBezier([0.42, 0.0], [1.0, 1.0]);
  }
  return TentaGL.TimingFunction._easeIn;
};


/** 
 * Returns an interpolation that starts quickly and decelerates towards the end.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.easeOut = function() {
  if(TentaGL.TimingFunction._easeOut === undefined) {
    TentaGL.TimingFunction._easeOut = TentaGL.TimingFunction.cubicBezier([0.0, 0.0], [0.58, 1.0]);
  }
  return TentaGL.TimingFunction._easeOut;
};


/** 
 * Returns an interpolation that behaves like easeIn towards the beginning and 
 * like easeOut towards the end.
 * @return {TentaGL.TimingFunction}
 */
TentaGL.TimingFunction.easeInOut = function() {
  if(TentaGL.TimingFunction._easeInOut === undefined) {
    TentaGL.TimingFunction._easeInOut = TentaGL.TimingFunction.cubicBezier([0.42, 0.0], [0.58, 1.0]);
  }
  return TentaGL.TimingFunction._easeInOut;
};



