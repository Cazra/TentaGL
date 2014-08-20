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
 * Used to display a tooltip for some component.
 * @constructor
 * @param {TentaGL.BlitteredFont} blitFont
 * @param {string} bgMaterialName   The name of the material used to render the background of the tooltip.
 * @param {uint} padding
 * @param {uint} charHeight   The height to render characters in the blittered font.
 */
TentaGL.UI.Tooltip = function(blitFont, bgMaterialName, padding, delay, charHeight) {
  this._bgMatName = bgMaterialName;
  this._blitFont = blitFont;
  if(charHeight === undefined) {
    charHeight = blitFont.getLineHeight();
  }
  this._charHeight = charHeight;
  
  this.xy([0, 0]);
  this.text("");
  this.padding(padding);
  this.delay(delay);
};


TentaGL.UI.Tooltip.prototype = {
  
  constructor: TentaGL.UI.Tooltip,
  
  isaTooltip: true,
  
  /** 
   * Detaches the tooltip from its current component.
   */
  reset: function() {
    this._component = undefined;
  },
  
  
  /** 
   * Setter/getter for the tooltip's position in the viewport. 
   * @param {vec2} xy   Optional.
   * @return {vec2}
   */
  xy: function(xy) {
    if(xy !== undefined) {
      this._xy = xy;
    }
    return this._xy;
  },
  
  
  /** 
   * Setter/getter for the text displayed by the tooltip. 
   * @param {string} text   Optional.
   * @return {string}
   */
  text: function(text) {
    if(text === undefined) {
      text = "";
    }
    this._text = text;
    this._dims = this._blitFont.getStringDimensions(text, this._charHeight);
  },
  
  
  /** 
   * Setter/getter for the component currently assigned to the Tooltip.
   * @param {TentaGL.UI.Component} component   Optional.
   * @return {TentaGL.UI.Component}
   */
  component: function(component) {
    if(component !== undefined) {
      this._component = component;
    }
    return this._component;
  },
  
  
  /** 
   * Returns the dimensions of the tooltips with its current text.
   * @return {[width: number, height: number]}
   */
  getDimensions: function() {
    var w = this._dims[0] + this._pad*2;
    var h = this._dims[1] + this._pad*2;
    
    return [w,h];
  },
  
  
  /** 
   * Setter/getter for the tooltip's padding between its text and its border. 
   * @param {uint} padding    Optional.
   * @return {uint}
   */
  padding: function(padding) {
    if(padding !== undefined) {
      this._pad = padding;
    }
    return this._pad;
  },
  
  
  /** 
   * Setter/getter for the tooltip's delay, in milliseconds. The user must 
   * mouse-over a component for this long for the tooltip to be displayed.
   * @param {uint} delay    Optional.
   * @return {uint}
   */
  delay: function(delay) {
    if(delay !== undefined) {
      this._delay = delay;
    }
    return this._delay;
  },
  
  
  /** 
   * Renders the tooltip. 
   * @param {WebGLRenderingContext} gl
   */
  render: function(gl) {
    if(this._component === undefined) {
      return;
    }
    TentaGL.ViewTrans.push(gl);
    
    TentaGL.ViewTrans.translate(gl, this._xy);
    
    var dims = this.getDimensions();
    
    TentaGL.MaterialLib.use(gl, this._bgMatName);
    
    TentaGL.ViewTrans.push(gl);
    TentaGL.ViewTrans.scale(gl, dims);
    TentaGL.ModelLib.render(gl, "unitSprite");
    TentaGL.ViewTrans.pop(gl);
    
    this._blitFont.renderString(gl, this._text, [this._pad, this._pad], true, this._charHeight);
    
    TentaGL.ViewTrans.pop(gl);
  }
};

Util.Inheritance.inherit(TentaGL.UI.Tooltip, TentaGL.Renderable);
