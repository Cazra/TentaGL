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
 * Constructs an empty group of objects in a scene graph. It also applies a 
 * transformation to all objects and nodes underneath it in the scene graph. 
 */
TentaGL.SceneNode = function() {
  this._sceneChildren = [];
  this._nextSceneID = 0;
};


TentaGL.SceneNode.prototype = {
  
  constructor:TentaGL.SceneNode,
  
  
  getSceneID:function() {
    return this._sceneID
  },
  
  
  /** 
   * Adds a renderable object or node to the scene immediately under this node. 
   * It is assigned a unique ID among this node's children.
   */
  add:function(object) {
    
    // Try to avoid integer overflow of IDs by skipping IDs that are in use.
    while(this._sceneChildren[this._nextSceneID]) {
      this._nextSceneID++;
    }
    
    object.setSceneID(this._nextSceneID);
    this._sceneChildren[this._nextSceneID] = object;
    this._nextSceneID++;
  },
  
  
  /** 
   * Removes an object from the scene, but only if it is an immediate child. 
   */
  remove:function(object) {
    var id = object.getSceneID();
    object.setSceneParent(undefined);
    this._sceneChildren[id] = undefined;
  },
  
};


