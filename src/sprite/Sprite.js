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
 * Constructs a sprite (some transformable entity existing at a point in 
 * 3D space) at the specified world coordinates.
 * Most sprite properties are only useful if the ShaderProgram provides uniform
 * variables to use them. 
 *
 * However, TentaGL requires shaders to mind a mvpTrans uniform and a 
 * normalTrans uniform. This should be done through the ShaderProgram's 
 * bindMVPTransUni and bindNormalTransUni methods after the 
 * ShaderProgram is created, but before any sprites are rendered.
 * @constructor
 * @param {vec3} xyz  Optional. If the sprite's world coordinates aren't 
 *      provided, they will be set to [0, 0, 0]. 
 */
TentaGL.Sprite = function(xyz) {
  TentaGL.SceneNode.call(this, xyz);
  
  this._anchorXYZ = vec4.fromValues(0, 0, 0, 1);
  this._pickEventListeners = [];
};


TentaGL.Sprite.prototype = {
  
  constructor:TentaGL.Sprite,
  
  isaSprite:true,
  
  //////// Anchor point
  
  /** 
   * Returns the homogeneous xyz coordinates of the sprite's anchor point. 
   * The anchor point is the position of the sprite's origin point in relation
   * to its model's origin point.
   * @return {vec4}
   */
  getAnchorXYZ:function() {
    return this._anchorXYZ;
  },
  
  /** 
   * Sets the anchor point for the sprite.
   * The anchor point is the position of the sprite's origin point in relation
   * to its model's origin point.
   * @param {vec3} xyz
   */
  setAnchorXYZ:function(xyz) {
    this._anchorXYZ = vec4.fromValues(xyz[0], xyz[1], xyz[2], 1);
  },
  
  /** 
   * Returns the x coordinate of the sprite's anchor point. 
   * @return {Number}
   */
  getAnchorX:function() {
    return this._anchorXYZ[0];
  },
  
  /** 
   * Returns the y coordinate of the sprite's anchor point. 
   * @return {Number}
   */
  getAnchorY:function() {
    return this._anchorXYZ[1];
  },
  
  /** 
   * Returns the z coordinate of the sprite's anchor point. 
   * @return {Number}
   */
  getAnchorZ:function() {
    return this._anchorXYZ[2];
  },
  
  
  //////// Events
  
  /** 
   * Publishes a PickEvent to this sprite's PickEventListeners in relevance 
   * to some context.
   * @param {Object} context
   */
  firePickEvent:function(context) {
    var event = new TentaGL.PickEvent(this, context);
    
    for(var i in this._pickEventListeners) {
      this._pickEventListeners[i].handlePickEvent(event);
    }
  },
  
  
  /** 
   * Subscribes a PickEventListener to this Sprite.  
   * @param {TentaGL.PickEventListener} listener
   */
  addPickEventListener:function(listener) {
    this._pickEventListeners.push(listener);
  },
  
  
  /** 
   * Removes a PickEventListener from this Sprite's subscribers.
   * @param {TentaGL.PickEventListener} listener
   */
  removePickEventListener:function(listener) {
    var index = this._pickEventListeners.indexOf(node);
    if(index == -1) {
      return false;
    }
    else {
      this._pickEventListeners.splice(index, 1);
      return true;
    }
  },
  
  
  //////// Transform
  
  
  /** The model transform for sprites also needs to take into account anchor points. */
  getTRSTransform:function() {
    var tx = this.getX();
    var ty = this.getY();
    var tz = this.getZ();
    
    var ax = 0-this.getAnchorX();
    var ay = 0-this.getAnchorY();
    var az = 0-this.getAnchorZ();
    
    var sUni = this.getScaleUni();
    var scaleX = this.getScaleX()*sUni;
    var scaleY = this.getScaleY()*sUni;
    var scaleZ = this.getScaleZ()*sUni;
    
    var m = this._transform; 
    mat4.fromQuat(m, this.getQuat());
    m[0] *= scaleX;
    m[1] *= scaleX;
    m[2] *= scaleX;
    
    m[4] *= scaleY;
    m[5] *= scaleY;
    m[6] *= scaleY;
    
    m[8] *= scaleZ;
    m[9] *= scaleZ;
    m[10] *= scaleZ;
    
    m[12] = ax*m[0] + ay*m[4] + az*m[8] + tx;
    m[13] = ax*m[1] + ay*m[5] + az*m[9] + ty;
    m[14] = ax*m[2] + ay*m[6] + az*m[10] + tz;
    m[15] = 1;
    
    return m;
  },
  
  //////// Rendering

  
  /** 
   * Sets the materials for and draws the Models making up this sprite. 
   * Override this. 
   */
  draw:function(gl) {}
};

Util.Inheritance.inherit(TentaGL.Sprite, TentaGL.SceneNode);

