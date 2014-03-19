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
 * An event associated with a TentaGL Application being resized. 
 * @constructor
 * @param {Object} source
 * @param {uint} w  The new width
 * @param {uint} h  The new height
 * @param {uint} oldW   The old width.
 * @param {uint} oldH   The old height.
 */
TentaGL.AppResizeEvent = function(source, w, h, oldW, oldH) {
  TentaGL.Event.call(this, source, 0);
  
  this._width = w;
  this._height = h;
  
  this._oldWidth = oldW;
  this._oldHeight = oldH;
};

TentaGL.AppResizeEvent.prototype = {
  
  constructor:TentaGL.AppResizeEvent,
  
  /** 
   * Returns the new width of the application. 
   * @return {uint}
   */
  getWidth:function() {
    return this._width;
  },
  
  /** 
   * Returns the new height of the application. 
   * @return {uint}
   */
  getHeight:function() {
    return this._height;
  },
  
  
  /** 
   * Returns the old width of the application. 
   * @return {uint}
   */
  getOldWidth:function() {
    return this._oldWidth;
  },
  
  
  /** 
   * Returns the old height of the application. 
   * @return {uint}
   */
  getOldHeight:function() {
    return this._oldHeight;
  }
};

TentaGL.Inheritance.inherit(TentaGL.AppResizeEvent, TentaGL.Event);

