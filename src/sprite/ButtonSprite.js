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
 * A sprite within built-in mouse interaction logic. This allows the sprite
 * to function like buttons or other typical mouse-responsive UI components.
 * @constructor
 * @param {vec3} xyz
 */
TentaGL.ButtonSprite = function(xyz) {
  TentaGL.Sprite.call(this, xyz);
  this.resetMouseState();
};

TentaGL.ButtonSprite.prototype = {
  
  constructor: TentaGL.ButtonSprite,
  
  isaButtonSprite: true, 
  
  
  /** 
   * Resets the mouse state data for this button.
   */
  resetMouseState: function() {
    this._isLeftPressed = false;
    this._isRightPressed = false;
    this._mouseOverStart = -1;
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
    else {
      if(this._mouseOverStart >= 0) {
        this.onMouseExit(mouse);
      }
      this.resetMouseState();
    }
  },
  
  
  /** 
   * Returns whether this button is currently being pressed. 
   * When implementing draw, you may want to draw the sprite differently 
   * depending on whether it is pressed.
   * @return {boolean}
   */
  isPressed: function() {
    return this._isLeftPressed;
  },  
  
  
  /** 
   * Returns the amount of time in milliseconds that the button has been mouse-overed. 
   * If the button isn't currently mouse-overed, -1 is returned.
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
   * Returns whether the button is currently mouse-overed. 
   * @return {boolean}
   */
  isMouseOvered: function() {
    return (this._mouseOverStart >= 0);
  },
  
  
  ////// abstract methods
  
  
  /** 
   * Handler for when the button is left-clicked.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onClick: function(mouse) {},
  
  /** 
   * Handler for when the button is right-clicked.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onRightClick: function(mouse) {},
  
  /** 
   * Handler for when the mouse enters the sprite's area.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onMouseOver: function(mouse) {},
  
  /** 
   * Handler for when the mouse exits the sprite's area.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onMouseExit: function(mouse) {}
  
};

Util.Inheritance.inherit(TentaGL.ButtonSprite, TentaGL.Sprite);



/** 
 * Creates a simple, generic button sprite which renders using a specified model, 
 * material, material lighting properties, and shader. No behavior is defined
 * for any its handlers.
 * @param {vec3} xyz
 * @param {string} modelName
 * @param {string} materialName
 * @param {string} shaderName
 * @param {TentaGL.MaterialProps} matProps    Optional. If not provided, a default MaterialProps is created.
 * @return {TentaGL.Sprite}
 */
TentaGL.ButtonSprite.create = function(xyz, modelName, materialName, shaderName, matProps) {
  var sprite = new TentaGL.ButtonSprite(xyz);
  
  if(!matProps) {
    matProps = new TentaGL.MaterialProps();
  }
  
  sprite.draw = function(gl) {
    try {
      TentaGL.ShaderLib.use(gl, shaderName);
      TentaGL.MaterialLib.use(gl, materialName);
      matProps.useMe(gl);
      TentaGL.ModelLib.render(gl, modelName);
    }
    catch (e) {
      // console.log("sprite resource not ready: " + e.message);
    }
  };
  
  return sprite;
};

