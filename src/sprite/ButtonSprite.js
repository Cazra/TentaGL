

TentaGL.ButtonSprite = function(xyz) {
  TentaGL.Sprite.call(this, xyz);
  
  this._isPressed = false;
  this._mouseOverStart = -1;
};

TentaGL.ButtonSprite.prototype = {
  
  constructor: TentaGL.ButtonSprite,
  
  isaButtonSprite: true, 
  
  
  /** 
   * Updates the mouse interaction state for the button. 
   * @param {TentaGL.Picker} picker   Assumed to have been already updated for this frame.
   * @param {TentaGL.Mouse} mouse
   */
  update: function(picker, mouse) {
    if(picker.getSpriteAtMouse(mouse) == this) {
      if(this._mouseOverStart == -1) {
        this._mouseOverStart = Date.now();
      }
      
      if(mouse.isLeftPressed()) {
        this._isPressed = true;
      }
      else {
        if(this._isPressed) {
          this.onclick();
        }
        this._isPressed = false;
      }
    }
    else {
      this._mouseOverStart = -1;
      this._isPressed = false;
    }
  },
  
  
  /** 
   * Returns whether this button is currently being pressed. 
   * When implementing draw, you may want to draw the sprite differently 
   * depending on whether it is pressed.
   * @return {boolean}
   */
  isPressed: function() {
    return this._isPressed;
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
  
  
  ////// abstract methods
  
  
  /** 
   * Handler for when the button is clicked.
   * @param {TentaGL.Mouse} mouse   The mouse that triggered the click.
   */
  onClick: function(mouse) {}
  
  
};

Util.Inheritance.inherit(TentaGL.ButtonSprite, TentaGL.Sprite);


