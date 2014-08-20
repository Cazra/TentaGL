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
 * Base class for UI components that contain other components.
 * @constructor
 * @abstract
 * @param {vec3} xyz
 */
TentaGL.UI.Container = function(xyz) {
  TentaGL.UI.Component.call(this, xyz);
  
  this._children = [];
  this._layout = undefined;
};


TentaGL.UI.Container.prototype = {
  
  constructor: TentaGL.UI.Container, 
  
  isaContainer: true,
  
  
  //////// Children
  
  /** 
   * Adds a component to this container. 
   * @param {TentaGL.UI.Component} comp
   * @param {uint} index    Optional. Insert at a specific index.
   */
  add: function(comp, index) {
    if(comp._parentContainer !== undefined) {
      throw new Error("Component cannot be added to another container.");
    }
    
    comp._parentContainer = this;
    if(index !== undefined) {
      this._children.splice(index, 0, comp);
    }
    else {
      this._children.push(comp);
    }
  },
  
  
  /** 
   * Returns the child component at the specified index. 
   * @param {uint} index
   * @return {TentaGL.UI.Component}
   */
  getComponent: function(index) {
    return this._children[index];
  },
  
  
  /** 
   * Returns a list of the components in this container.
   * @return {array: TentaGL.UI.Component}
   */
  getComponents: function() {
    return this._children.slice(0);
  },
  
  
  
  /** 
   * Removes a component from this container. 
   * @param {TentaGL.UI.Component}
   */
  remove: function(comp) {
    var index = this._children.indexOf(comp);
    this.removeAt(index);
  },
  
  
  /** 
   * Removes the component at the specified index from this container.
   * @param {uint} index
   */
  removeAt: function(index) {
    if(index < 0 || index >= this._children.length) {
      throw new Error("Component not found.");
    }
    var comp = this._children(index);
    
    comp._parentContainer = undefined;
    this._children.splice(index, 1);
  },
  
  
  /** 
   * Removes all components from this container. 
   */
  removeAll: function() {
    while(this._children.length > 0) {
      this.removeAt(0);
    }
  },
  
  
  
  /** 
   * Returns the number of components in this container. 
   * @return {uint}
   */
  count: function() {
    return this._children.length;
  },
  
  
  //////// Layout
  
  /** 
   * Lays out this container's components using the container's layout algorithm. 
   */
  doLayout: function() {
    if(this._layout) {
      this._layout.layoutContainer(this);
    }
  },
  
  
  /** 
   * Setter/getter for this container's layout algorithm.
   * @param {TentaGL.UI.Layout} layout    Optional.
   * @return {TentaGL.UI.Layout}
   */
  layout: function(layout) {
    if(layout) {
      this._layout = layout;
    }
    return this._layout;
  },
  
  
  //////// Rendering
  
  /** 
   * Override me.
   * The default implementation renders all the child components.
   */
  draw: function(gl) {
    for(var i=0; i<this._children.length; i++) {
      this._children[i].render(gl);
    }
  }
};


Util.Inheritance.inherit(TentaGL.UI.Container, TentaGL.UI.Component);


