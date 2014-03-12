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
 * An RGBA filter that applies a convolution matrix to the pixels.
 * @constructor
 * @param {Array{Array{Number}}} matrix   A square 2D matrix of pixel weights.
 *      The matrix is expected to be in row-major order.
 */
TentaGL.RGBAFilter.Convolution = function(matrix) {
  var sideLen = matrix[0].length
  this._sideLen = sideLen;
  
  // normalize the matrix.
  var sum = 0;
  for(var i=0; i < sideLen; i++) {
    for(var j=0; j < sideLen; j++) {
      sum += matrix[i][j];
    }
  }
  console.log(sum);
  
  if(sum > 0) {
    for(var i=0; i < sideLen; i++) {
      for(var j=0; j < sideLen; j++) {
        matrix[i][j] /= sum;
      }
    }
  }
  console.log(matrix);
  
  this._matrix = matrix;
};


TentaGL.RGBAFilter.Convolution.prototype = {
  
  constructor:TentaGL.RGBAFilter.Convolution,
  
  /** 
   * Returns the convolution matrix for this filter. 
   * @return {Array{Array{Number}}}
   */
  getMatrix:function() {
    return this._matrix;
  },
  
  
  
  /**
   * Returns the side length of the convolution matrix for this filter.
   * @return {int}
   */
  getSideLength:function() {
    return this._sideLen;
  },
  
  
  /** See TentaGL.RGBAFilter.apply */
  filter:function(dstData, srcData, index, width, height) {
    var r = 0;
    var g = 0;
    var b = 0;
    var a = srcData[index+3];
    var sideLen = this._sideLen;
    
    var xy = TentaGL.PixelData.indexToXY(index, width);
    var x = xy[0];
    var y = xy[1];
    
    // Apply the filter.
    var offset = Math.floor(sideLen/2);
    for(var i=0;  i < sideLen; i++) {
      var y2 = y + i - offset;
      if(y2 >= height) {
          y2 = height-1;
        }
        if(y2 < 0) {
          y2 = 0;
        }
      
      for(var j=0; j < sideLen; j++) {
        var weight = this._matrix[i][j];
        
        var x2 = x + j - offset;
        if(x2 >= width) {
          x2 = width - 1;
        }
        if(x2 < 0) {
          x2 = 0;
        }
        
        var index2 = TentaGL.PixelData.xyToIndex(x2, y2, width);
        var a2 = srcData[index2+3]/255;
        
        r += srcData[index2]*weight*a2;
        g += srcData[index2+1]*weight*a2;
        b += srcData[index2+2]*weight*a2;
      }
    }
    
  //  console.log([r, g, b, a]);
    r = TentaGL.Math.clamp(r, -256, 255);
    if(r < 0) {
      r += 256;
    }
    
    g = TentaGL.Math.clamp(g, -256, 255);
    if(g < 0) {
      g += 256;
    }
    
    b = TentaGL.Math.clamp(b, -256, 255);
    if(b < 0) {
      b += 256;
    }
    
    this.setPixel(dstData, index, r, g, b, a);
  }
};


TentaGL.Inheritance.inherit(TentaGL.RGBAFilter.Convolution, TentaGL.RGBAFilter);


/** 
 * Produces a blur filter with the kernel:
 * [1,1,1]
 * [1,1,1]
 * [1,1,1]
 * @return {TentaGL.RGBAFilter.Convolution}
 */
TentaGL.RGBAFilter.Convolution.Blur3 = function() {
  return new TentaGL.RGBAFilter.Convolution([ [1,1,1],
                                              [1,1,1],
                                              [1,1,1]]);
};


/** 
 * Produces a blur filter with the kernel:
 * [1,2,1]
 * [2,4,2]
 * [1,2,1]
 * @return {TentaGL.RGBAFilter.Convolution}
 */
TentaGL.RGBAFilter.Convolution.GaussianBlur3 = function() {
  return new TentaGL.RGBAFilter.Convolution([ [1,2,1],
                                              [2,4,2],
                                              [1,2,1]]);
};


/** 
 * Produces a sharpen filter with the kernel:
 * [0,-1,0]
 * [-1,5,-1]
 * [0,-1,0]
 * @return {TentaGL.RGBAFilter.Convolution}
 */
TentaGL.RGBAFilter.Convolution.Sharpen3 = function() {
  return new TentaGL.RGBAFilter.Convolution([ [0,-1,0],
                                              [-1,5,-1],
                                              [0,-1,0]]);
};


/** 
 * Produces an edge detection filter with the kernel:
 * [1,0,-1]
 * [0,0,0]
 * [-1,0,1]
 * @return {TentaGL.RGBAFilter.Convolution}
 */
TentaGL.RGBAFilter.Convolution.EdgeDetect3 = function() {
  return new TentaGL.RGBAFilter.Convolution([ [1,0,-1],
                                              [0,0,0],
                                              [-1,0,1]]);
};


/** 
 * Produces a edge detection filter with the kernel:
 * [0,1,0]
 * [1,-4,1]
 * [0,1,0]
 * @return {TentaGL.RGBAFilter.Convolution}
 */
TentaGL.RGBAFilter.Convolution.EdgeDetect3_2 = function() {
  return new TentaGL.RGBAFilter.Convolution([ [0,1,0],
                                              [1,-4,1],
                                              [0,1,0]]);
};


/** 
 * Produces a edge detection filter with the kernel:
 * [-1,-1,-1]
 * [-1,8,-1]
 * [-1,-1,-1]
 * @return {TentaGL.RGBAFilter.Convolution}
 */
TentaGL.RGBAFilter.Convolution.EdgeDetect3_3 = function() {
  return new TentaGL.RGBAFilter.Convolution([ [-1,-1,-1],
                                              [-1,8,-1],
                                              [-1,-1,-1]]);
};
