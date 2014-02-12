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
 * In raidians, 1 TAU is equivalent to a 360 degree rotation. 
 * I simply find this more convenient than 2*PI for many applications.
 */
TentaGL.TAU = 2*Math.PI;

/** Math utilities. Algebraic!! */
TentaGL.Math = {

  /** 
   * Converts cartesian XYZ coordinates to polar [radius, thetaY, thetaX] coordinates, 
   * with thetaX and thetaY given in radians. Note that in our polar coordinate 
   * system, we rotate around the Y axis first, then the X axis.
   * @param {vec3} xyz  The cartesian coordinates
   * @return {vec3} The polar coordinates
   */
  toPolar:function(xyz) {
    var v = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
    var radius = vec3.length(v);
    
    v = vec3.normalize(v, v);
    
    var thetaX = Math.asin(this.clamp(v[1], -1, 1));
    var thetaY;
    if(xyz[0] == 0) {
      if(xyz[2] > 0) {
        thetaY = TentaGL.TAU*0.75;
      }
      else {
        thetaY = TentaGL.TAU*0.25;
      }
    }
    else {
      thetaY = Math.atan(-z/x);
      if(x < 0) {
        thetaY += TentaGL.TAU/2;
      }
    }
    
    return vec3.fromValues(radius, thetaY, thetaX);
  },
  
  
  /** 
   * Convertex polar coordinates [radius, thetaY, thetaX] with thetaX and thetaY
   * given in radians to cartesian XYZ coordinates.
   * @param {vec3} ryx  The polar coordinates.
   * @return {vec3} The cartesian coordinates
   */
  toCartesian:function(ryx) {
    var x = ryx[0]*Math.cos(ryx[1])*Math.cos(ryx[2]);
    var y = ryx[0]*Math.sin(ryx[2]);
    var z = 0 - ryx[0]*Math.sin(ryx[1])*Math.cos(ryx[2]);
    
    return vec3.fromValues(x, y, z);
  },
  
  
  
  /** 
   * Clamps the specified value to the range [min, max]. 
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   */
  clamp:function(value, min, max) {
    return Math.min(max, Math.max(value, min));
  }
};
