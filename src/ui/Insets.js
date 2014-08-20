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
 * The size of the borders of some component. If only the top border size is
 * provided, the border size is assumed to be uniform.
 * @constructor
 * @param {number} top
 * @param {number} left     Optional.
 * @param {number} bottom   Optional.
 * @param {number} right    Optional.
 */
TentaGL.UI.Insets = function(top, left, bottom, right) {
  if(left === undefined) {
    left = top;
    bottom = top;
    right = top;
  }
  this._top = top;
  this._left = left;
  this._bottom = bottom;
  this._right = right;
};


TentaGL.UI.Insets.prototype = {
  
  constructor: TentaGL.UI.Insets,
  
  isaInsets: true,
  
  
  /** 
   * Returns a clone of this. 
   * @return {TentaGL.UI.Insets}
   */
  clone: function() {
    return new TentaGL.UI.Insets(this._top, this._left, this._bottom, this._right);
  },
  
  
  
  /** 
   * Setter/getter for the size of the top border. 
   * @param {uint} 
   */
  top: function(size) {
    if(size !== undefined) {
      this._top = size;
    }
    return this._top;
  },
  
  /** 
   * Setter/getter for the size of the left border. 
   * @param {uint} 
   */
  left: function(size) {
    if(size !== undefined) {
      this._left = size;
    }
    return this._left;
  },
  
  /** 
   * Setter/getter for the size of the bottom border. 
   * @param {uint} 
   */
  bottom: function(size) {
    if(size !== undefined) {
      this._bottom = size;
    }
    return this._bottom;
  },
  
  /** 
   * Setter/getter for the size of the right border. 
   * @param {uint} 
   */
  right: function(size) {
    if(size !== undefined) {
      this._right = size;
    }
    return this._right;
  }
};


