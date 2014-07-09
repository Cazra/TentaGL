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
 * A material for gradients, both linear and radial. The graident initially has 
 * no break points. Add break points using the addBreakPt method.
 * @constructor
 * @param {vec2} startPt    The starting point for the gradient.
 * @param {vec2} vector     The vector giving the direction and length 
 *      (or radius) of the gradient.
 */
TentaGL.Gradient = function(startPt, vector) {
  this._pt = vec2.clone(startPt);
  this._vec = vec2.clone(vector);
  
  this._breakPts = [];
};

TentaGL.Gradient.prototype = {
  
  constructor: TentaGL.Gradient,
  
  isaGradient: true,
  
  
  /** 
   * Returns the gradient's start point. 
   * @return {vec2}
   */
  getStartPoint: function() {
    return this._pt;
  },
  
  
  /** 
   * Returns the gradient's vector.
   * @return {vec2}
   */
  getVector: function() {
    return this._vec;
  },
  
  
  /** 
   * For radial gradients, this returns the radius of the gradient.
   * @return {number}
   */
  getRadius: function() {
    return vec2.length(this._vec);
  },
  
  
  /** 
   * Adds a break point to the gradient. Break points can be added out of order.
   * They will be correctly inserted at the correct position in the list of 
   * breakpoints to maintain ascending order of break point values.
   * @param {float} breakPt   Should be in the range [0, 1].
   * @param {TentaGL.Color} color
   * @return {TentaGL.Gradient} this, for chaining.
   */
  addBreakPt: function(breakPt, color) {
    if(this._breakPts.length == 0) {
      this._breakPts[0] = [breakPt, color];
    }
    else {
      var insertIndex = 0;
      for(var i=0; i<this._breakPts.length; i++) {
        var curPt = this._breakPts[i];
        
        if(breakPt > curPt[0]) {
          insertIndex = i+1;
        }
      }
      
      this._breakPts.splice(insertIndex, 0, [breakPt, color]);
    }
    
    return this;
  },
  
  
  /** 
   * Returns the parametric value of the nth break point. 
   * @return {float}
   */
  getBreakPt: function(n) {
    return this._breakPts[n][0];
  },
  
  
  /** 
   * Returns a list of the parametric values for the break points. 
   * @return {array: float}
   */
  getBreakPts: function() {
    var result = [];
    for(var i=0; i < this._breakPts.length; i++) {
      result.push(this._breakPts[i][0]);
    }
    return result;
  },
  
  
  /** 
   * Returns the color of the nth break point.
   * @return {TentaGL.Color}
   */
  getColor: function(n) {
    return this._breakPts[n][1];
  },
  
  
  /** 
   * Returns a list of the colors for the break points.
   * @return {array: TentaGL.Color}
   */
  getColors: function() {
    var result = [];
    for(var i=0; i < this._breakPts.length; i++) {
      result.push(this._breakPts[i][1]);
    }
    return result;
  },
  
  
  
  /** 
   * Uses the gradient in the current shader.
   * @param {WebGLRenderingContext} gl
   */
  useMe: function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    
    if(program.setStartPoint) {
      program.setStartPoint(gl, this._pt);
      program.setGradVector(gl, this._vec);
      program.setColors(gl, this.getColors());
      program.setBreakPoints(gl, this.getBreakPts());
    }
  }
  
};

Util.Inheritance.inherit(TentaGL.Gradient, TentaGL.Material);
