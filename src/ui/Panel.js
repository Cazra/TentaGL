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
 * A simple Container implementation.
 * @constructor
 * @param {vec3} xyz    Optional. Default to [0,0,0].
 * @param {TentaGL.UI.Layout} layout
 */
TentaGL.UI.Panel = function(xyz, layout) {
  TentaGL.Container.call(this, xyz);
};


TentaGL.UI.Panel.prototype = {
  
  constructor: TentaGL.UI.Panel,
  
  isaPanel: true,
  
  
  getDimensions: function() {
    if(this.count() > 0) {
      var innerBox;
      var children = this.getComponents();
      for(var i=0; i < children.length; i++) {
        innerBox = children[i].getBounds2D().commonRect(innerBox);
      }
      return [innerBox.width(), innerBox.height()];
    }
    else {
      return [0,0];
    }
  },
  
  
  
  draw: function(gl) {
    // TODO: draw background.
    
    TentaGL.UI.Container.prototype.draw.call(this, gl);
  }
};

Util.Inheritance.inherit(TentaGL.UI.Panel, TentaGL.UI.Container);

