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
  
  this._quat = quat.create();
  this._quatIsID = true;
  
  this._objLook = vec3.fromValues(0,0,1);
  this._objUp = vec3.fromValues(0,1,0);
  
  this._transform = mat4.create();
  this._tranDiry = true;
  this._isVisible = true;
  
  this._parent = undefined;
};


TentaGL.SceneNode.prototype = {
  
  constructor:TentaGL.SceneNode,
  
  
  //////// Scene Graph hierarchy
  
  /**
   * Returns the parent of this node in the scene graph. If this node has no
   * parent, it returns undefined.
   * @return {TentaGL.SceneNode}
   */
  getParent:function() {
    return this._parent;
  },
  
  /** 
   * Sets the parent of this node in the scene graph. Although it is possible
   * for a node to be a child for several nodes, a node can only have 1 parent.
   * This can produce unpredictable results when calling methods to get the 
   * node's world transforms which require a traversal up the node's 
   * ancestors.
   * @param {TentaGL.SceneNode}
   */
  setParent:function(node) {
    this._parent = node;
  },
  
  
  /** 
   * Returns whether this node has a parent node in the scene graph. 
   * @return {Boolean}
   */
  hasParent:function() {
    if(this._parent) {
      return true;
    }
    else {
      return false;
    }
  },
  
  
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
   * Returns the Sprite's XYZ position in local coordinates.
   * @return {vec4}
   */
  getXYZ:function() {
    return this._xyz;
  },
  
  
  getWorldXYZ:function() {
    var wTran = this.getWorldTransform();
    var x = wTran[12];
    var y = wTran[13];
    var z = wTran[14];
    return vec4.fromValues(x, y, z, 1);
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
   * Sets the orientation to be equivalent to the following matrix product: 
   * rotateX*rotateY*rotateZ
   * @param {length-3 array} xyz
   */
  setEuclidXYZ:function(xyz) {
    var q = quat.create();
    quat.rotateX(q, q, xyz[0]);
    quat.rotateY(q, q, xyz[1]);
    quat.rotateZ(q, q, xyz[2]);
    
    this.setQuaternion(q);
  },
  
  /** 
   * Sets the orientation to be equivalent to the following matrix product: 
   * rotateX*rotateZ*rotateY
   * @param {length-3 array} xyz
   */
  setEuclicXZY:function(xyz) {
    var q = quat.create();
    quat.rotateX(q, q, xyz[0]);
    quat.rotateZ(q, q, xyz[2]);
    quat.rotateY(q, q, xyz[1]);
    
    this.setQuaternion(q);
  },
  
  /** 
   * Sets the orientation to be equivalent to the following matrix product: 
   * rotateY*rotateX*rotateZ
   * @param {length-3 array} xyz
   */
  setEuclicYXZ:function(xyz) {
    var q = quat.create();
    quat.rotateY(q, q, xyz[1]);
    quat.rotateX(q, q, xyz[0]);
    quat.rotateZ(q, q, xyz[2]);
    
    this.setQuaternion(q);
  },
  
  /** 
   * Sets the orientation to be equivalent to the following matrix product: 
   * rotateY*rotateZ*rotateX
   * @param {length-3 array} xyz
   */
  setEuclidYZX:function(xyz) {
    var q = quat.create();
    quat.rotateY(q, q, xyz[1]);
    quat.rotateZ(q, q, xyz[2]);
    quat.rotateX(q, q, xyz[0]);
    
    this.setQuaternion(q);
  },
  
  /** 
   * Sets the orientation to be equivalent to the following matrix product: 
   * rotateZ*rotateX*rotateY
   * @param {length-3 array} xyz
   */
  setEuclidZXY:function(xyz) {
    var q = quat.create();
    quat.rotateZ(q, q, xyz[2]);
    quat.rotateX(q, q, xyz[0]);
    quat.rotateY(q, q, xyz[1]);
    
    this.setQuaternion(q);
  },
  
  /** 
   * Sets the orientation to be equivalent to the following matrix product: 
   * rotateZ*rotateY*rotateX
   * @param {length-3 array} xyz
   */
  setEuclidZYX:function(xyz) {
    var q = quat.create();
    quat.rotateZ(q, q, xyz[2]);
    quat.rotateY(q, q, xyz[1]);
    quat.rotateX(q, q, xyz[0]);
    
    this.setQuaternion(q);
  },
  
  
  //////// Quaterion/Orientation
  
  
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
  
  
  /** 
   * Rotates the quaternion for this node ccw around the specified axis by the  
   * specified number of radians. 
   * @param {vec3} axis
   * @param {Number} rads
   */
  rotate:function(axis, rads) {
    var q = quat.setAxisAngle(quat.create(), axis, rads);
    this.setQuaternion(quat.mul(q, q, this._quat));
  },
  
  
  /** 
   * Returns the node's unit look vector in object space. 
   * @return {vec3}
   */
  getObjectLook:function() {
    return this._objLook;
  },
  
  /** 
   * Sets and normalizes the look vector for the node in object space. 
   * @param {vec3} look
   */
  setObjectLook:function(look) {
    vec3.normalize(this._objLook, look);
    this._correctUpVector();
  },
  
  
  /**
   * Returns the node's unit right vector in object space. (The cross product
   * of the look and up unit vectors)
   */
  getObjectRight:function() {
    return vec3.cross(vec3.create(), this._objLook, this._objUp);
  },
  
  
  /** 
   * Get the node's look vector augmented by quaternion orientation.
   * @return {vec3}
   */
  getLook:function() {
    var look = vec3.clone(this._objLook);
    return vec3.transformQuat(look, look, this._quat);
  },
  
  
  /** 
   * Get the node's up vector augmented by quaternion orientation.
   * @return {vec3}
   */
  getUp:function() {
    var up = vec3.clone(this._objUp);
    return vec3.transformQuat(up, up, this._quat);
  },
  
  
  
  /** 
   * Returns the node's unit up vector in object space. 
   * @return {vec3}
   */
  getObjectUp:function() {
    return this._objUp;
  },
  
  /** 
   * Sets and normalizes the up vector for the node in object space. 
   * @param {vec3} up
   */
  setObjectUp:function(up) {
    vec3.normalize(this._objUp, up);
    this._correctUpVector();
  },
  
  /** 
   * Corrects the up vector so that it forms a right angle with the look vector. 
   */
  _correctUpVector:function() {
    var look = this._objLook;
    var up = this._objUp;
    var right = vec3.cross(vec3.create(), look, up);
    this._objUp = vec3.cross(up, right, look);
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
  
  
  getWorldScaleUni:function() {
    var scale = this.getScaleUni();
    if(this._parent) {
      scale += this._parent.getWorldScaleUni();
    }
    return scale;
  },
  
  //////// Model transform
  
  
  /** 
   * Produces and returns the sprite's local model transform.
   * @return {mat4}
   */
  getModelTransform:function() {
    if(this._tranDirty) {
      this._transform = this.getTRSTransform();
      this._tranDirty = false;
    }
    return this._transform;
  },
  
  
  getTRSTransform:function() {
    var tx = this.getX();
    var ty = this.getY();
    var tz = this.getZ();
    
    var sUni = this.getScaleUni();
    var scaleX = this.getScaleX()*sUni;
    var scaleY = this.getScaleY()*sUni;
    var scaleZ = this.getScaleZ()*sUni;
    
    var m = this._transform; 
    m[0] = scaleX; 
    m[1] = 0; 
    m[2] = 0; 
    m[3] = 0;
    
    m[4] = 0; 
    m[5] = scaleY; 
    m[6] = 0; 
    m[7] = 0;
    
    m[8] = 0; 
    m[9] = 0; 
    m[10] = scaleZ;
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

  
  /** 
   * Obtains the world transform matrix for this node in the scene graph. 
   * This is simply the product of this node's model transform with its
   * ancestors' that results in the final model transformation of the node at 
   * render time.
   * @return {mat4}
   */
  getWorldTransform:function() {
    return this._getWorldTransform(mat4.create());
  },
  
  /** Private helper for getWorldTransform. */
  _getWorldTransform:function(resultMat) {
    mat4.mul(resultMat, this.getModelTransform(), resultMat);
    if(this._parent) {
      this._parent._getWorldTransform(resultMat);
    }
    return resultMat;
  },
  
};

TentaGL.Inheritance.inherit(TentaGL.SceneNode.prototype, TentaGL.Renderable.prototype);


