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

/** A singleton library for BlendStates. */
TentaGL.BlendStateLib = {
  
  _blendStates:{},
  
  _currentName:"",
  
  _locked:false,
  
  
  /** 
   * Returns true iff this contains a BlendState with the specified name. 
   * @param {string} name
   * @return {Boolean}
   */
  has:function(name) {
    if(this._blendStates[name]) {
      return true;
    }
    else {
      return false;
    }
  },
  
  
  /**
   * Adds a BlendState to the library with the specified name.
   */
  add:function(name, state) {
    this._blendStates[name] = state;
  },
  
  
  /** 
   * Removes the BlendState with the specified name from the library. 
   */
  remove:function(name) {
    delete this._blendStates[name];
  },
  
  
  /** 
   * Sets the GL context to use the parameters of the BlendState with 
   * the given name. 
   * @param {WebGLRenderingContext} gl
   * @param {string} name
   * @return {TentaGL.BlendState} The BlendState now being used.
   */
  use:function(gl, name) {
    if(!this._locked && this._currentName !== name) {
      this._currentName = name;
      var blendState = this._blendStates[name];
      blendState.useMe(gl);
    }
  },
  
  
  /** 
   * Returns the BlendState whose parameters are currently being used
   * by the GL context.
   * @return {TentaGL.BlendState}
   */
  current:function() {
    return this._blendStates[this._currentName];
  },
  
  
  /** 
   * Locks the library so that it cannot change which BlendState is in use.
   * By default, the library is unlocked.
   */
  lock:function() {
    this._lock = true;
  },
  
  /** 
   * Unlocks the library so that it can change which BlendState is in use.
   * By default, the library is unlocked.
   */
  unlock:function() {
    this._lock = false;
  }
  
  
};



