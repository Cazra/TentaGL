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
 * Interface for a node in a scene graph. All nodes in a scene graph have a set
 * of affine transforms which are implemented here. SceneNodes can also be made
 * visible or invisible.
 */
TentaGL.SceneNode = function(xyz) {
  if(xyz === undefined) {
    xyz = [0, 0, 0, 1];
  }
  this._xyz = vec4.fromValues(xyz[0], xyz[1], xyz[2], 1);
  
  this._scaleXYZ = [1, 1, 1];
  this._scaleUni = 1;
  
  this._angleY = 0;
  this._angleX = 0;
  this._angleZ = 0;
  
  this._quat = quat.create();
  this._quatIsID = true;
  
  this._transform = mat4.create();
  this._tranDiry = true;
  this._isVisible = true;
};


TentaGL.SceneNode.prototype = {
  
  constructor:TentaGL.SceneNode,
  
  
  //////// Visibility
  
  /** 
   * Returns true iff this node's visibility flag is true. 
   * @return {Boolean}
   */
  isVisible:function() {
    return this._isVisible;
  },
  
  
  /** 
   * Sets whether this node is visible. 
   */
  setVisible:function(visible) {
    this._isVisible = visible;
  },
  
  
  //////// Position
  
  /** 
   * Returns the Sprite's XYZ coordinates.
   * @return {vec4}
   */
  getXYZ:function() {
    return this._xyz;
  },
  
  /** 
   * Sets the Sprite's XYZ coordinates.
   * @param {vec3} xyz
   */
  setXYZ:function(xyz) {
    this._xyz[0] = xyz[0];
    this._xyz[1] = xyz[1];
    this._xyz[2] = xyz[2];
    this._tranDirty = true;
  },
  
  /**
   * Returns the Sprites X coordinate.
   * @return {Number}
   */
  getX:function() {
    return this._xyz[0];
  },
  
  /**
   * Returns the Sprites Y coordinate.
   * @return {Number}
   */
  getY:function() {
    return this._xyz[1];
  },
  
  /**
   * Returns the Sprites Z coordinate.
   * @return {Number}
   */
  getZ:function() {
    return this._xyz[2];
  },
  
  
  //////// Euclid angles
  
  
  /** 
   * Returns the angle of rotation of this sprite, in  radians, about its 
   * X axis.
   * @return {Number}
   */
  getAngleX:function() {
    return this._angleX;
  },
  
  /** 
   * Sets the angle of rotation of this sprite, in radians, about its X axis.
   * @param {Number} angle
   */
  setAngleX:function(angle) {
    this._angleX = angle;
    this._tranDirty = true;
  },
  
  /** 
   * Returns the angle of rotation of this sprite, in  radians, about its 
   * Y axis.
   * @return {Number}
   */
  getAngleY:function() {
    return this._angleY;
  },
  
  /** 
   * Sets the angle of rotation of this sprite, in radians, about its Y axis.
   * @param {Number} angle
   */
  setAngleY:function(angle) {
    this._angleY = angle;
    this._tranDirty = true;
  },
  
  /** 
   * Returns the angle of rotation of this sprite, in  radians, about its 
   * Z axis.
   * @return {Number}
   */
  getAngleZ:function() {
    return this._angleZ;
  },
  
  /** 
   * Sets the angle of rotation of this sprite, in radians, about its Z axis.
   * @param {Number} angle
   */
  setAngleZ:function(angle) {
    this._angleZ = angle;
    this._tranDirty = true;
  },
  
  
  //////// Quaterion TODO
  
  
  /** 
   * Returns the quaternion for this sprite. 
   * @return {quat}
   */
  getQuaternion:function() {
    return this._quat;
  },
  
  /** 
   * Sets the quaternion for this sprite. 
   * @param {quat} q
   */
  setQuaternion:function(q) {
    this._quat = q;
    this._tranDirty = true;
    
    // Check if the quaternion is now an identity quaternion.
    this._quatIsID = (q[0] == 0 && q[1] == 0 && q[2] == 0 && q[3] == 1);
  },
  
  
  
  //////// Scale
  
  /** 
   * Returns the sprite's scales along its X, Y, and Z axes.
   * @return {vec3}
   */
  getScaleXYZ:function() {
    return this._ScaleXYZ;
  },
  
  /** 
   * Sets the sprite's scales along its X, Y, and Z axes.
   * @param {vec3} xyz
   */
  setScaleXYZ:function(xyz) {
    this._scaleXYZ = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
    this._tranDirty = true;
  },
  
  /** 
   * Returns the X component of the sprite's scale.
   * @return {Number}
   */
  getScaleX:function() {
    return this._scaleXYZ[0];
  },
  
  /**
   * Returns the Y component of the sprite's scale.
   * @return {Number}
   */
  getScaleY:function() {
    return this._scaleXYZ[1];
  },
  
  /** 
   * Returns the Z component of the sprite's scale.
   * @return {Number}
   */
  getScaleZ:function() {
    return this._scaleXYZ[2];
  },
  
  /** 
   * Returns the uniform scale value of the sprite. 
   * In the sprite's scale transform, this multiplies the axial scale values
   * of the sprite.
   * @return {Number}
   */
  getScaleUni:function() {
    return this._scaleUni;
  },
  
  /** 
   * Sets the uniform scale value of the sprite.
   * In the sprite's scale transform, this multiplies the axial scale values
   * of the sprite.
   * @param {Number} coeff
   */
  setScaleUni:function(coeff) {
    this._scaleUni = coeff;
    this._tranDirty = true;
  },
  
  
  
  //////// Model transform
  
  
  /** 
   * Produces and returns the sprite's model transform.
   * @return {mat4}
   */
  getModelTransform:function() {
    if(this._tranDirty) {
      this._transform = this.getTRotYXZSTransform();
      this._tranDirty = false;
    }
    return this._transform;
  },
  
  
  getTRotYXZSTransform:function() {
    var tx = this.getX();
    var ty = this.getY();
    var tz = this.getZ();
    
    var ax = this.getAngleX();
    var ay = this.getAngleY();
    var az = this.getAngleZ();
    
    var sx = Math.sin(ax);
    var cx = Math.cos(ax);
    
    var sy = Math.sin(ay);
    var cy = Math.cos(ay);
    
    var sz = Math.sin(az);
    var cz = Math.cos(az);
    
    var sUni = this.getScaleUni();
    var scaleX = this.getScaleX()*sUni;
    var scaleY = this.getScaleY()*sUni;
    var scaleZ = this.getScaleZ()*sUni;
    
    var m = this._transform; //TentaGL.mat4Recyclable; //mat4.create();
    m[0] = scaleX*(cy*cz + sy*sx*sz);
    m[1] = scaleX*(cx*sz);
    m[2] = scaleX*(cy*sx*sz - sy*cz);
    m[3] = 0;
    
    m[4] = scaleY*(sy*sx*cz - cy*sz);
    m[5] = scaleY*(cx*cz);
    m[6] = scaleY*(sy*sz + cy*sx*cz);
    m[7] = 0;
    
    m[8] = scaleZ*(sy*cx);
    m[9] = scaleZ*(-sx);
    m[10] = scaleZ*(cy*cx);
    m[11] = 0;
    
    if(!this._quatIsID) {
      m[12] = 0;
      m[13] = 0;
      m[14] = 0;
      m[15] = 1;
      mat4.mul(m, mat4.fromQuat(TentaGL.mat4Recyclable, this.getQuaternion()), m);
    }
    
    m[12] = tx;
    m[13] = ty;
    m[14] = tz;
    m[15] = 1;
    
    return m;
  },

  
};

TentaGL.Inheritance.inherit(TentaGL.SceneNode.prototype, TentaGL.Renderable.prototype);


