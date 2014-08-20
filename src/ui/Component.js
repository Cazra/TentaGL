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
 * @abstract
 * @param {vec3} xyz
 */
TentaGL.UI.Component = function(xyz) {
  if(!xyz) {
    xyz = [0,0,0];
  }
  TentaGL.Sprite.call(this, xyz);
  
  this._parentContainer = undefined;
  this.enabled(true);
  this._resetMouseState();
};

TentaGL.UI.Component.prototype = {
  
  constructor: TentaGL.UI.Component, 
  
  isaComponent: true,
  
  
  /** 
   * Returns this component's parent container (if it has one). 
   * Returns undefined if this has no parent container.
   * @return {TentaGL.UI.Container}
   */
  getParentContainer: function() {
    return this._parentContainer;
  },
  
  
  //////// Metrics
  
  /** 
   * Setter/getter for the preferred minimum size of the component, used to 
   * help with layout and rendering computations.
   * @param {[width: number, height: number]} dims
   * @return {[width: number, height: number]}
   */
  minimumSize: function(dims) {
    if(dims !== undefined) {
      this._minSize = dims;
    }
    return this._minSize;
  },
  
  /** 
   * Setter/getter for the preferred size of the component, used to 
   * help with layout and rendering computations. The actual computed size 
   * should be returned by the component's implementation of getDimensions.
   * @param {[width: number, height: number]} dims
   * @return {[width: number, height: number]}
   */
  preferredSize: function(dims) {
    if(dims !== undefined) {
      this._prefSize = dims;
    }
    return this._prefSize;
  },
  
  /** 
   * Setter/getter for the preferred maximum size of the component, used to 
   * help with layout and rendering computations.
   * @param {[width: number, height: number]} dims
   * @return {[width: number, height: number]}
   */
  maximumSize: function(dims) {
    if(dims !== undefined) {
      this._maxSize = dims;
    }
    return this._maxSize;
  },
  
  
  //////// Look & Feel
  
  /** 
   * Setter/getter for the blittered font used to render text contents of this
   * component. If set to undefined, it will inherit the font of its parent.
   * @param {TentaGL.BlitteredFont} blitFont    Optional.
   * @return {TentaGL.BlitteredFont}
   */
  font: function(blitFont) {
    if(font !== undefined) {
      this._font = blitFont;
    }
    
    if(this._font) {
      return this._front;
    }
    else if(this._parentContainer) {
      return this._parentContainer.font();
    }
    else {
      return undefined;
    }
  },
  
  
  /** 
   * Setter/getter for the component's mouse cursor style. 
   * @param {string} cursor   Optional. Any valid CSS cursor style value. 
   * @return {string}
   */
  cursor: function(cursor) {
    if(cursor !== undefined) {
      this._cursorStyle = cursor;
    }
    return this._cursorStyle;
  },
  
  
  //////// Interactions
  
  /** 
   * Resets the mouse state data for this component.
   */
  _resetMouseState: function() {
    this._isLeftPressed = false;
    this._isRightPressed = false;
    this._mouseOverStart = -1;
    this._tooltipPos = undefined;
    
    if(this._tooltip && this._tooltip.component() == this) {
      this._tooltip.reset();
      console.log("stop tooltip");
    }
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
        
        mouse.getCanvas().style.cursor = this._cursorStyle;
      }
      
      // Update the tooltip if we've hovered long enough.
      if(this._tooltip && this.timeMouseOvered() >= this._tooltip.delay()) {
        this._tooltip.component(this);
        this._tooltip.xy(vec2.add([], mouse.getXY(), [0, 16]));
        this._tooltip.text(this._tooltipText);
        
        console.log(this._tooltip);
      }
    }
    else {
      if(this._mouseOverStart >= 0 && this._enabled) {
        this.onMouseExit(mouse);
      }
      console.log("no longer mouseover.");
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
   * @param {TentaGL.UI.Tooltip} tooltip
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

Util.Inheritance.inherit(TentaGL.UI.Component, TentaGL.Sprite);

