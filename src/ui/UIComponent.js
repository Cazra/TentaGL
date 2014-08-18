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
 * A base class for objects used primarily as 2D UI components. 
 * Such UI components are responsive to mouse interaction and provide 
 * handlers for various mouse input related events.
 * @constructor
 */
TentaGL.UIComponent = function(xyz) {
  if(!xyz) {
    xyz = [0,0,0];
  }
  TentaGL.Sprite.call(this, xyz);
  
  
  this._parentComponent = undefined;
  
  this.enabled(true);
  this._resetMouseState();
};

TentaGL.UIComponent.prototype = {
  
  constructor: TentaGL.UIComponent, 
  
  isaUIComponent: true,
  
  
  //////// Interactions
  
  /** 
   * Resets the mouse state data for this component.
   */
  _resetMouseState: function() {
    this._isLeftPressed = false;
    this._isRightPressed = false;
    this._mouseOverStart = -1;
    this._tooltipPosition = undefined;
  },
  
  
  /** 
   * Updates the mouse interaction state for the button. 
   * Before this method is called, it is assumed that the picker has 
   * been updated for the current frame.
   * @param {TentaGL.Picker} picker   
   * @param {TentaGL.Mouse} mouse
   */
  updateMouseState: function(picker, mouse) {
    if(picker.getSpriteAtMouse(mouse) == this) {
      if(this._enabled) {
        if(this._mouseOverStart == -1) {
          this._mouseOverStart = Date.now();
          this.onMouseOver(mouse);
        }
        
        if(mouse.isLeftPressed()) {
          this._isLeftPressed = true;
        }
        else {
          if(this._isLeftPressed) {
            this.onClick(mouse);
          }
          this._isLeftPressed = false;
        }
        
        if(mouse.isRightPressed()) {
          this._isRightPressed = true;
        }
        else {
          if(this._isRightPressed) {
            this.onRightClick(mouse);
          }
          this._isRightPressed = false;
        }
      }
      
      this._tooltipPosition = mouse.getXY();
      vec2.add(this._tooltipPosition, this._tooltipPosition, [0, 16]);
    }
    else {
      if(this._mouseOverStart >= 0 && this._enabled) {
        this.onMouseExit(mouse);
      }
      this._resetMouseState();
    }
  },
  
  
  /** 
   * Returns whether this component is currently being pressed. 
   * When implementing draw, you may want to draw the sprite differently 
   * depending on whether it is pressed.
   * @return {boolean}
   */
  isPressed: function() {
    return this._isLeftPressed;
  },  
  
  
  /** 
   * Returns the amount of time in milliseconds that the component has been mouse-overed. 
   * If the component isn't currently mouse-overed, -1 is returned.
   * @return {int}
   */
  timeMouseOvered: function() {
    if(this._mouseOverStart == -1) {
      return -1;
    }
    else {
      return Date.now() - this._mouseOverStart;
    }
  },
  
  
  /** 
   * Returns whether the component is currently mouse-overed. 
   * @return {boolean}
   */
  isMouseOvered: function() {
    return (this._mouseOverStart >= 0);
  },
  
  
  
  /** 
   * Setter/getter for whether this component is enabled. 
   * Disabled buttons cannot be interacted with through events.
   * @param {boolean} enabled
   * @return {boolean}
   */
  enabled: function(enabled) {
    if(enabled !== undefined) {
      this._enabled = enabled;
    }
    return this._enabled;
  },
  
  
  /**  
   * Registers text to be displayed for this component as a tooltip.
   * @param {string} text
   * @param {TentaGL.Tooltip} tooltip   Optional. If not provided, TentaGL's default Tooltip will be used.
   */
  setTooltip: function(text, tooltip) {
    this._tooltip = tooltip;
    this._tooltipText = text;
  },
  
  
  ////// abstract methods
  
  
  /** 
   * Handler for when the component is left-clicked.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onClick: function(mouse) {},
  
  /** 
   * Handler for when the component is right-clicked.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onRightClick: function(mouse) {},
  
  /** 
   * Handler for when the mouse enters the component's area.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onMouseOver: function(mouse) {},
  
  /** 
   * Handler for when the mouse exits the component's area.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onMouseExit: function(mouse) {}
  
};

Util.Inheritance.inherit(TentaGL.UIComponent, TentaGL.Sprite);

