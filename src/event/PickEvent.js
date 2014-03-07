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
 * An event for a Sprite being picked by the Picker 
 * in some context.
 * @constructor
 * @param {TentaGL.Sprite} source  The Sprite that was picked and generated this event.
 * @param {Object} context    The context in which event was generated. (e.g. the mouse)
 */
TentaGL.PickEvent = function(source, context) {
  this._source = source;
  this._context = context;
};

TentaGL.PickEvent.prototype = {
  
  constructor:TentaGL.PickEvent,
  
  
  /** 
   * Returns the source of the event. 
   * @return {TentaGL.Sprite}
   */
  getSource:function() {
    return this._source;
  },
  
  
  /** Returns the context in which the event was generated. */
  getContext:function() {
    return this._context;
  }
};


