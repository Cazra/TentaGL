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
 * A composite sprite consisting of an icon and a label. 
 * @constructor
 * @param {vec3} xyz
 * @param {string} iconTexName    The name of the Material to use for the icon.
 * @param {string} labelText      The text to be displayed as the label.
 * @param {string} labelBGTexName   The name of the texture used for the frame around the label.
 * @param {TentaGL.BlitteredFont} blitFont  The blittered font used to render the text.
 */
TentaGL.LabelledIconSprite = function(xyz, iconTexName, labelText, labelBGTexName, blitFont) {
  TentaGL.CompositeSprite.call(this, xyz);
  
  this._createIcon(iconTexName);
  this._createLabel(labelText, labelBGTexName, blitFont);
};


TentaGL.LabelledIconSprite.prototype = {
  
  constructor:TentaGL.LabelledIconSprite,
  
  isaLabelledIconSprite:true,
  
  /** 
   * Creates the sprite for the icon.
   * @private 
   */
  _createIcon:function(iconTexName) {
    this._icon = new TentaGL.ImageIconSprite([0, 0, 0], iconTexName);
    this._icon.setAlignment(TentaGL.Align.CENTER, TentaGL.Align.CENTER);
    
    this.addComponent(this._icon);
  },
  
  
  /** 
   * Creates the sprites for the label and its frame.
   * @param {string} labelText      The text to be displayed as the label.
   * @param {string} labelBGTexName   The name of the texture used for the frame around the label.
   * @param {TentaGL.BlitteredFont} blitFont  The blittered font used to render the text.
   */
  _createLabel:function(labelText, labelBGTexName, blitFont) {
    // Create the label sprite.
    this._label = new TentaGL.TextIconSprite([0, 0.3, 0.001], labelText, blitFont, 0.5);
    this._label.setAlignment(TentaGL.Align.CENTER, TentaGL.Align.BOTTOM);
    this.addComponent(this._label);
    
    // Create the label background.
    this._labelBG = new TentaGL.ImageIconSprite([0, 0.3, 0.0005], labelBGTexName);
    this._labelBG.setAlignment(TentaGL.Align.CENTER, TentaGL.Align.BOTTOM);
    this._fitLabelBG();
    this.addComponent(this._labelBG);
  },
  
  
  _fitLabelBG: function() {
    this._labelBG.setScaleXYZ([
      this._label.getIconWidth()/this._labelBG.getIconWidth()+0.1, 
      this._label.getIconHeight()/this._labelBG.getIconHeight(), 
      1
    ]);
  },
  
  //////// Icon
  
  /** 
   * Returns the name of the texture material used for the icon. 
   * @return {string}
   */
  getIcon:function() {
    return this._icon.getTextureName();
  },
  
  
  /** 
   * Sets the texture displayed by the icon to the one with the specified name. 
   * @param {string} name
   */
  setIcon:function(name) {
    this._icon.setTextureName(name);
  },
  
  
  //////// Label
  
  
  /** 
   * Returns the label's text. 
   * @return {string}
   */
  getText:function() {
    return this._label.getText();
  },
  
  /** 
   * Sets the label's text.
   * @param {string} text
   */
  setText:function(text) {
    this._label.setText(text);
    this._fitLabelBG();
  },
  
  
  /** 
   * Returns the name of material used for the label background.
   * @return {string}
   */
  getLabelBG:function() {
    return this._labelBG.getTextureName();
  },
  
  
  /** 
   * Sets the material used for the label background.
   * 
   */
  setLabelBG:function(name) {
    this._labelBG.setTextureName(name);
  },
  
  
  //////// Metrics
  
  
  /** 
   * Returns the pixel width of the icon's texture.
   * @return {int}
   */
  getIconWidth:function() {
    return this._icon.getIconWidth();
  },
  
  /** 
   * Returns the pixel height of the icon's texture.
   * @return {int}
   */
  getIconHeight:function() {
    return this._icon.getIconHeight();
  },
  
  
  //////// Events
  
  /** 
   * The LabelledIconSprite listens for PickEvents from its components 
   * and republishes them as its own. 
   * @param {TentaGL.PickEvent} event
   */
  handlePickEvent:function(event) {
    var src = event.getSource();
    if(src == this._label || src == this._labelBG || src == this._icon) {
      this.firePickEvent(event.getContext());
    }
  },
  
  
  
  //////// Rendering
  
  
  /** 
   * Renders this sprite, temporarily concatenating its model transform to the 
   * current Model-view transform of the scene. 
   * @param {WebGLRenderingContext} gl
   */
  render:function(gl) {
    if(!this.isVisible() || !TentaGL.SceneNode.filter(this)) {
      return;
    }
    TentaGL.ViewTrans.push(gl);
    
    var camera = TentaGL.ViewTrans.getCamera(gl);
    var camEye = camera.getEye();
    this.billboardWorldPlane(vec3.negate(vec3.create(), camera.getLook()), camera.getUp())
    
    this._fitLabelBG();
    
    TentaGL.ViewTrans.mul(gl, this.getModelTransform());
    this.draw(gl);
    
    TentaGL.ViewTrans.pop(gl);
  }
};

Util.Inheritance.inherit(TentaGL.LabelledIconSprite, TentaGL.CompositeSprite);
Util.Inheritance.inherit(TentaGL.LabelledIconSprite, TentaGL.PickEventListener);

