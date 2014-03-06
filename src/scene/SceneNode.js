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
  
  
  removeFromParent:function() {
    if(this._parent && this._parent.remove) {
      this._parent.remove(this);
      this._parent = null;
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
   * Sets the Sprite's XYZ in local coordinates.
   * @param {vec3} xyz
   */
  setXYZ:function(xyz) {
    this._xyz[0] = xyz[0];
    this._xyz[1] = xyz[1];
    this._xyz[2] = xyz[2];
    this._tranDirty = true;
  },
  
  /**
   * Returns the Sprites X local coordinate.
   * @return {Number}
   */
  getX:function() {
    return this._xyz[0];
  },
  
  /**
   * Returns the Sprites Y local coordinate.
   * @return {Number}
   */
  getY:function() {
    return this._xyz[1];
  },
  
  /**
   * Returns the Sprites Z local coordinate.
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
    
    this.setQuat(q);
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
    
    this.setQuat(q);
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
    
    this.setQuat(q);
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
    
    this.setQuat(q);
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
    
    this.setQuat(q);
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
    
    this.setQuat(q);
  },
  
  
  //////// Quaterion/Orientation
  
  
  /** 
   * Returns the quaternion for this sprite. 
   * @return {quat}
   */
  getQuat:function() {
    return this._quat;
  },
  
  /** 
   * Returns the quaternion representing this node's orietnation 
   * in world coordinates. 
   * @return {quat}
   */
  getWorldQuat:function() {
    return this._getWorldQuat(quat.create());
  },
  
  _getWorldQuat:function(q) {
    quat.mul(q, this.getQuat(), q);
    if(this._parent) {
      return this._parent._getWorldQuat(q);
    }
    else {
      return q;
    }
  },
  
  /** 
   * Sets the quaternion for this sprite. 
   * @param {quat} q
   */
  setQuat:function(q) {
    this._quat = q;
    this._tranDirty = true;
  },
  
  
  getParentWorldQuat:function() {
    if(this._parent) {
      return this._parent.getWorldQuat();
    }
    else {
      return quat.create();
    }
  },
  
  
  /** 
   * Rotates the quaternion for this node ccw around the specified axis by the  
   * specified number of radians. 
   * @param {vec3} axis
   * @param {Number} rads
   */
  rotate:function(axis, rads) {
    var q = quat.setAxisAngle(quat.create(), axis, rads);
    this.setQuat(quat.mul(this._quat, q, this._quat));
  },
  
  
  /** 
   * Rotates the quaternion for this node's orientation S with some 
   * other quaternion T. 
   * The result quaternion is Q = T*S.
   * @param {quat} q
   */
  mulQuat:function(q) {
    this.setQuat(quat.mul(this._quat, q, this._quat));
  },
  
  
  //////// Look vector & orientation
  
  /** 
   * Returns the node's unit look vector in local space. This is used as the X
   * axis in the node's look space.
   * @return {vec3}
   */
  getBaseLook:function() {
    return this._objLook;
  },
  
  
  /** 
   * Returns the node's unit look vector in world space. This is used as the X
   * axis in the node's look space.
   * @return {vec3}
   */
  getWorldBaseLook:function() {
    var q = this.getParentWorldQuat();
    return vec3.transformQuat(vec3.create(), this._objLook, q);
  },
  
  
  /** 
   * Sets and normalizes the base look vector for the node in local space. 
   * @param {vec3} look
   */
  setBaseLook:function(look) {
    vec3.normalize(this._objLook, look);
    this._correctUpVector();
  },
  
  
  /** 
   * Get the node's oiented look vector in local coordinates.
   * @return {vec3}
   */
  getLook:function() {
    return vec3.transformQuat(vec3.create(), this._objLook, this._quat);
  },
  
  
  
  /** 
   * Returns the oriented look vector of this node in world coordinates. 
   * @return {vec3}
   */
  getWorldLook:function() {
    var worldQuat = this.getWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseLook(), worldQuat);
  },

  
  //////// Right vector & orientation
  
  /**
   * Returns the node's base unit right vector. (The cross product
   * of the look and up unit vectors). This is used as the Z axis in
   * look space.
   */
  getBaseRight:function() {
    return vec3.cross(vec3.create(), this._objLook, this._objUp);
  },
  
  /** 
   * Returns the node's unit right vector in world space. This is used as the Z 
   * axis in look space.
   * @return {vec3}
   */
  getWorldBaseRight:function() {
    var q = this.getParentWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseRight(), q);
  },
  
  
  /** 
   * Returns the oriented right vector of this node in local space.
   * @return {vec3}
   */
  getRight:function() {
    return vec3.transformQuat(vec3.create(), this.getBaseRight(), this._quat);
  },
  
  
  /**
   * Returns the oriented right vector of this node in world coordinates.
   * @return {vec3}
   */
  getWorldRight:function() {
    var worldQuat = this.getWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseRight(), worldQuat);
  },
  
  
  //////// Up vector & orientation
  
  /** 
   * Get the node's oriented up vector in local coordinates.
   * @return {vec3}
   */
  getUp:function() {
    return vec3.transformQuat(vec3.create(), this._objUp, this._quat);
  },
  
  
  /**
   * Returns the oriented up vector of this node in world coordinates.
   * @return {vec3}
   */
  getWorldUp:function() {
    var worldQuat = this.getWorldQuat();
    return vec3.transformQuat(vec3.create(), this.getBaseUp(), worldQuat);
  },
  
  
  /** 
   * Returns the node's base unit up vector. This is used as the Y axis in the
   * node's look space. 
   * @return {vec3}
   */
  getBaseUp:function() {
    return this._objUp;
  },
  
  
  /** 
   * Returns the node's unit up vector in world space. This is used as the Y
   * axis in the node's look space.
   * @return {vec3}
   */
  getWorldBaseUp:function() {
    var q = this.getParentWorldQuat();
    return vec3.transformQuat(vec3.create(), this._objUp, q);
  },
  

  /** 
   * Sets and normalizes the base up vector for the node. 
   * @param {vec3} up
   */
  setBaseUp:function(up) {
    vec3.normalize(this._objUp, up);
    this._correctUpVector();
  },
  
  /** 
   * Corrects the base up vector so that it forms a right angle with the base 
   * look vector. 
   */
  _correctUpVector:function() {
    var look = this._objLook;
    var up = this._objUp;
    var right = vec3.cross(vec3.create(), look, up);
    this._objUp = vec3.cross(up, right, look);
  },
  
  
  //////// Look/Up/Right vectors
  
  /** 
   * Returns an array containing the node's base look, up, and right vectors, 
   * in that order.
   * @return {length 3 array} Each element is a vec3.
   */
  getBaseLookVectors:function() {
    return [this.getBaseLook(), this.getBaseUp(), this.getBaseRight()];
  },
  
  
  /** 
   * Returns an array containing the node's look, up, and right vectors in
   * local coordinates, in that order.
   * @return {length 3 array} Each element is a vec3.
   */
  getLookVectors:function() {
    var q = this.getQuat();
    var look = vec3.transformQuat(vec3.create(), this._objLook, this._quat);
    var up = vec3.transformQuat(vec3.create(), this._objUp, this._quat);
    var right = vec3.transformQuat(vec3.create(), this.getBaseRight, this._quat);
    
    return [look, up, right];
  },
  
  /** 
   * Returns an array containing the node's look, up, and right vectors in
   * world coordinates, in that order.
   * @return {length 3 array} Each element is a vec3.
   */
  getWorldLookVectors:function() {
    var q = this.getWorldQuat();
    var look = vec3.transformQuat(vec3.create(), this._objLook, this._quat);
    var up = vec3.transformQuat(vec3.create(), this._objUp, this._quat);
    var right = vec3.transformQuat(vec3.create(), this.getBaseRight, this._quat);
    
    return [look, up, right];
  },
  
  
  
  
  //////// Orientation
  
  /** 
   * Orients the node so that its look and up vectors are in the 
   * specified directions in local space. 
   * @param {vec3} look
   * @param {vec3} up
   */
  orient:function(look, up) {
    /*
    var q = TentaGL.Math.getQuatFromTo(this.getBaseLook(), look);
    this.setQuat(q);
    
    if(up) {
      var curUp = this.getUp();
      var q2 = TentaGL.Math.getQuatFromTo(curUp, up);
      this.mulQuat(q2);
    }
    */
    
    this.setQuat(TentaGL.Math.getOrientation(this.getBaseLook(), this.getBaseUp(), look, up));
  },
  
  /** 
   * Orients the node so that its look and up vectors are in the specified 
   * directions in world space.
   * @param {vec3} look
   * @param {vec3} up
   */
  orientWorld:function(look, up) {
    var qToLocal = this.getParentWorldQuat();
    quat.invert(qToLocal, qToLocal);
    look = vec3.transformQuat(vec3.create(), look, qToLocal);
    up = vec3.transformQuat(vec3.create(), up, qToLocal);
    
    /*
    var q = TentaGL.Math.getQuatFromTo(this.getBaseLook(), look);
    this.setQuat(q);
    
    if(up) {
      var curUp = this.getUp();
      var q2 = TentaGL.Math.getQuatFromTo(curUp, up);
      this.mulQuat(q2);
    }
    */
    this.setQuat(TentaGL.Math.getOrientation(this.getBaseLook(), this.getBaseUp(), look, up));
  },
  
  
  //////// Look-At/Billboarding
  
  /** 
   * Orients the node to look towards the specified point in local space.
   * The look vector will be oriented towards the point, but the up vector
   * will be tilted from the base up vector.
   */
  lookAt:function(p) {
    var xyz = this.getXYZ();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, this.getBaseUp());
    var up = vec3.cross(vec3.create(), right, look);
    
    this.orient(look, up);
  },
  
  /** 
   * Orients the node to look towards the specified point in world space.
   * The look vector will be oriented towards the point, but the up vector
   * will be tilted from the base up vector.
   */
  lookAtWorld:function(p) {
    var xyz = this.getWorldXYZ();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, this.getWorldBaseUp());
    var up = vec3.cross(vec3.create(), right, look);
    
    this.orientWorld(look, up);
  },
  
  
  
  
  /** 
   * Orients the node so that it looks towards a certain point in local space 
   * and its up vector is oriented in some specified general direction 
   * in local space.
   * @param {vec4} p    The point to look at.
   * @param {vec3} up   The general direction of "up".
   */
  billboardPoint:function(p, up) {
    var xyz = this.getXYZ();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, up);
    up = vec3.cross(vec3.create(), right, look);
    
    this.orient(look, up);
  },
  
  
  /** 
   * Orients the node so that it looks towards a certain point in world space 
   * and its up vector is oriented in some specified general direction 
   * in world space.
   * @param {vec4} p    The point to look at.
   * @param {vec3} up   The general direction of "up".
   */
  billboardWorldPoint:function(p, up) {
    var xyz = this.getWorldXYZ();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var right = vec3.cross(vec3.create(), look, up);
    up = vec3.cross(vec3.create(), right, look);
    
    this.orientWorld(look, up);
  },
  
  
  /** 
   * Orients the node so that it looks in the direction of some point in local space, 
   * but its up vector remains set as the base up vector.
   */
  billboardAxis:function(p) {
    var xyz = this.getXYZ();
    var baseLook = this.getBaseLook();
    var baseUp = this.getBaseUp();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var q = TentaGL.Math.getQuatFromTo(baseLook, look);
    var up = vec3.transformQuat(vec3.create(), baseUp, q);
    
    var rightP = vec3.cross(vec3.create(), look, baseUp);
    var upP = vec3.cross(vec3.create(), rightP, look);
    
    var q2 = TentaGL.Math.getQuatFromTo(up, upP);
    quat.mul(q, q2, q);
    
    var q2 = TentaGL.Math.getQuatFromTo(upP, baseUp);
    quat.mul(q, q2, q);
    
    look = vec3.transformQuat(look, baseLook, q);
    up = baseUp
    
    
    this.orient(look, up);
  },
  
  
  /** 
   * Orients the node so that it looks in the direction of some point in world space, 
   * but its up vector remains set as the base up vector.
   */
  billboardWorldAxis:function(p) {
    var xyz = this.getWorldXYZ();
    var baseLook = this.getWorldBaseLook();
    var baseUp = this.getWorldBaseUp();
    
    var dx = p[0] - xyz[0];
    var dy = p[1] - xyz[1];
    var dz = p[2] - xyz[2];
    
    var look = vec3.fromValues(dx, dy, dz);
    var q = TentaGL.Math.getQuatFromTo(baseLook, look);
    var up = vec3.transformQuat(vec3.create(), baseUp, q);
    
    var rightP = vec3.cross(vec3.create(), look, baseUp);
    var upP = vec3.cross(vec3.create(), rightP, look);
    
    var q2 = TentaGL.Math.getQuatFromTo(up, upP);
    quat.mul(q, q2, q);
    
    var q2 = TentaGL.Math.getQuatFromTo(upP, baseUp);
    quat.mul(q, q2, q);
    
    look = vec3.transformQuat(look, baseLook, q);
    up = baseUp
    
    
    this.orientWorld(look, up);
  },
  
  
  /** 
   * Orients the node so that it is oriented in some plane in local space
   * defined by a look vector and an up vector.
   * @param {vec3} look
   * @param {vec3} up
   */
  billboardPlane:function(look, up) {
    this.orient(look, up);
  },
  
  
  /** 
   * Orients the node so that it is oriented in some plane in local space
   * defined by a look vector and an up vector.
   * @param {vec3} look
   * @param {vec3} up
   */
  billboardWorldPlane:function(look, up) {
    this.orientWorld(look, up);
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
  
  
  
  //////// Rendering
  
  
  /** 
   * Renders this node, temporarily concatenating its model transform to the 
   * current Model-view transform of the scene. 
   * @param {WebGLRenderingContext} gl
   */
  render:function(gl) {
    if(!this.isVisible() || !TentaGL.renderFilter(this)) {
      return;
    }
    TentaGL.pushTransform();
    
    TentaGL.mulTransform(this.getModelTransform());
    TentaGL.updateMVPUniforms(gl);
    
    this.draw(gl);
    
    TentaGL.popTransform();
  },
  
  
  /** 
   * "Draws" the contents of this node.
   * Override this. 
   */
  draw:function(gl) {}
};

TentaGL.Inheritance.inherit(TentaGL.SceneNode.prototype, TentaGL.Renderable.prototype);


